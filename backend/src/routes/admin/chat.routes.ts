// backend/src/routes/admin/chat.routes.ts
import { Router } from 'express'
import { prisma } from '../../config/database'
import { sendSuccess, sendError } from '../../utils/apiResponse'
import { getIO } from '../../ws/socketServer'

const router = Router()

/**
 * GET /api/admin/chats
 * Get all chat sessions
 */
router.get('/', async (req, res) => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query as any
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [sessions, total] = await Promise.all([
      prisma.chatSession.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: parseInt(limit),
        skip,
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1  // Get last message
          },
          _count: {
            select: {
              messages: {
                where: { isRead: false, senderType: 'VISITOR' }
              }
            }
          }
        }
      }),
      prisma.chatSession.count({ where })
    ])

    // Format response
    const formattedSessions = sessions.map(session => ({
      id: session.id,
      email: session.email,
      fullName: session.fullName,
      whatsapp: session.whatsapp,
      username: session.username,
      address: session.address,
      status: session.status,
      isOnline: session.isOnline,
      lastSeenAt: session.lastSeenAt,
      createdAt: session.createdAt,
      lastMessage: session.messages[0] || null,
      unreadCount: session._count.messages
    }))

    return sendSuccess(res, {
      sessions: formattedSessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }, 'Chat sessions retrieved')
  } catch (error: any) {
    console.error('Get chats error:', error)
    return sendError(res, 'Failed to get chats', 500, error.message)
  }
})

/**
 * GET /api/admin/chats/:sessionId
 * Get chat session with all messages
 */
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!session) {
      return sendError(res, 'Chat session not found', 404)
    }

    // Mark all visitor messages as read
    await prisma.chatMessage.updateMany({
      where: {
        sessionId,
        senderType: 'VISITOR',
        isRead: false
      },
      data: { isRead: true }
    })

    return sendSuccess(res, session, 'Chat session retrieved')
  } catch (error: any) {
    console.error('Get chat error:', error)
    return sendError(res, 'Failed to get chat', 500, error.message)
  }
})

/**
 * POST /api/admin/chats/:sessionId/reply
 * Send reply from admin
 */
router.post('/:sessionId/reply', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { message } = req.body
    const adminId = (req as any).user?.userId

    if (!message || !message.trim()) {
      return sendError(res, 'Message is required', 400)
    }

    // Verify session exists
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId }
    })

    if (!session) {
      return sendError(res, 'Chat session not found', 404)
    }

    // Create message
    const chatMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        senderType: 'ADMIN',
        adminId,
        message: message.trim(),
        isRead: false
      }
    })

    // Update session
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() }
    })

    // Emit to chat room (visitor will receive)
    const io = getIO()
    if (io) {
      io.to(`chat:${sessionId}`).emit('chat:message', chatMessage)
    }

    return sendSuccess(res, chatMessage, 'Reply sent')
  } catch (error: any) {
    console.error('Reply error:', error)
    return sendError(res, 'Failed to send reply', 500, error.message)
  }
})

/**
 * PATCH /api/admin/chats/:sessionId/status
 * Update chat session status
 */
router.patch('/:sessionId/status', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { status } = req.body

    if (!['ACTIVE', 'CLOSED', 'ARCHIVED'].includes(status)) {
      return sendError(res, 'Invalid status', 400)
    }

    const session = await prisma.chatSession.update({
      where: { id: sessionId },
      data: { status }
    })

    return sendSuccess(res, session, 'Status updated')
  } catch (error: any) {
    console.error('Update status error:', error)
    return sendError(res, 'Failed to update status', 500, error.message)
  }
})

/**
 * DELETE /api/admin/chats/:sessionId
 * Delete chat session
 */
router.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params

    await prisma.chatSession.delete({
      where: { id: sessionId }
    })

    return sendSuccess(res, null, 'Chat session deleted')
  } catch (error: any) {
    console.error('Delete chat error:', error)
    return sendError(res, 'Failed to delete chat', 500, error.message)
  }
})

/**
 * GET /api/admin/chats/stats
 * Get chat statistics
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const [total, active, closed, unread] = await Promise.all([
      prisma.chatSession.count(),
      prisma.chatSession.count({ where: { status: 'ACTIVE' } }),
      prisma.chatSession.count({ where: { status: 'CLOSED' } }),
      prisma.chatMessage.count({ where: { isRead: false, senderType: 'VISITOR' } })
    ])

    return sendSuccess(res, {
      total,
      active,
      closed,
      unread
    }, 'Stats retrieved')
  } catch (error: any) {
    return sendError(res, 'Failed to get stats', 500, error.message)
  }
})

export default router
