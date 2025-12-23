// backend/src/routes/chat.routes.ts
import { Router } from 'express'
import { prisma } from '../config/database'
import { sendSuccess, sendError } from '../utils/apiResponse'
import { authenticate, requireAdmin } from '../middlewares/auth'
import { emitToRoom, getIO } from '../ws/socketServer'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = Router()

// Configure multer for chat image uploads
const chatUploadDir = path.join(__dirname, '../../public/uploads/chat')
if (!fs.existsSync(chatUploadDir)) {
  fs.mkdirSync(chatUploadDir, { recursive: true })
}

const chatStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, chatUploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `chat-${uniqueSuffix}${path.extname(file.originalname)}`)
  }
})

const chatUpload = multer({
  storage: chatStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only images are allowed'))
    }
  }
})

// ============ PUBLIC ENDPOINTS (No Auth) ============

/**
 * POST /api/public/chat/start
 * Start a new chat session with visitor info
 */
router.post('/start', async (req, res) => {
  try {
    const { email, fullName, whatsapp, username, address } = req.body

    // Validate required fields
    if (!email || !fullName || !whatsapp || !username) {
      return sendError(res, 'Email, Full Name, WhatsApp, and Username are required', 400)
    }

    // Check if session already exists for this email
    let session = await prisma.chatSession.findFirst({
      where: { 
        email,
        status: 'ACTIVE'
      }
    })

    if (!session) {
      // Create new session
      session = await prisma.chatSession.create({
        data: {
          email,
          fullName,
          whatsapp,
          username,
          address: address || null,
          isOnline: true,
          lastSeenAt: new Date()
        }
      })

      // Notify admin of new chat session
      const io = getIO()
      if (io) {
        io.to('admin:chats').emit('chat:new_session', {
          sessionId: session.id,
          email: session.email,
          fullName: session.fullName,
          createdAt: session.createdAt
        })
      }
    } else {
      // Update existing session
      session = await prisma.chatSession.update({
        where: { id: session.id },
        data: {
          isOnline: true,
          lastSeenAt: new Date()
        }
      })
    }

    return sendSuccess(res, { 
      sessionId: session.id,
      email: session.email,
      fullName: session.fullName
    }, 'Chat session started')
  } catch (error: any) {
    console.error('Start chat error:', error)
    return sendError(res, 'Failed to start chat', 500, error.message)
  }
})

/**
 * POST /api/public/chat/:sessionId/send
 * Send message from visitor
 */
router.post('/:sessionId/send', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { message } = req.body

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
        senderType: 'VISITOR',
        message: message.trim(),
        isRead: false
      }
    })

    // Update session lastSeenAt
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { 
        lastSeenAt: new Date(),
        isOnline: true
      }
    })

    // Emit to admin room
    const io = getIO()
    if (io) {
      io.to('admin:chats').emit('chat:new_message', {
        sessionId,
        message: chatMessage,
        session: {
          id: session.id,
          fullName: session.fullName,
          email: session.email
        }
      })
      
      // Also emit to session room (for real-time sync)
      io.to(`chat:${sessionId}`).emit('chat:message', chatMessage)
    }

    return sendSuccess(res, chatMessage, 'Message sent')
  } catch (error: any) {
    console.error('Send message error:', error)
    return sendError(res, 'Failed to send message', 500, error.message)
  }
})

/**
 * POST /api/public/chat/:sessionId/upload
 * Upload image from visitor
 */
router.post('/:sessionId/upload', chatUpload.single('image'), async (req, res) => {
  try {
    const { sessionId } = req.params
    const { message } = req.body
    const file = req.file

    if (!file) {
      return sendError(res, 'Image file is required', 400)
    }

    // Verify session exists
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId }
    })

    if (!session) {
      return sendError(res, 'Chat session not found', 404)
    }

    // Create image URL
    const imageUrl = `/uploads/chat/${file.filename}`

    // Create message with image
    const chatMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        senderType: 'VISITOR',
        message: message?.trim() || '',
        imageUrl,
        isRead: false
      }
    })

    // Update session lastSeenAt
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { 
        lastSeenAt: new Date(),
        isOnline: true
      }
    })

    // Emit to admin room
    const io = getIO()
    if (io) {
      io.to('admin:chats').emit('chat:new_message', {
        sessionId,
        message: chatMessage,
        session: {
          id: session.id,
          fullName: session.fullName,
          email: session.email
        }
      })
      io.to(`chat:${sessionId}`).emit('chat:message', chatMessage)
    }

    return sendSuccess(res, chatMessage, 'Image sent')
  } catch (error: any) {
    console.error('Upload image error:', error)
    return sendError(res, 'Failed to upload image', 500, error.message)
  }
})

/**
 * GET /api/public/chat/:sessionId/messages
 * Get all messages for a chat session
 */
router.get('/:sessionId/messages', async (req, res) => {
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

    return sendSuccess(res, {
      session: {
        id: session.id,
        email: session.email,
        fullName: session.fullName,
        status: session.status
      },
      messages: session.messages
    }, 'Messages retrieved')
  } catch (error: any) {
    console.error('Get messages error:', error)
    return sendError(res, 'Failed to get messages', 500, error.message)
  }
})

/**
 * POST /api/public/chat/:sessionId/offline
 * Mark visitor as offline
 */
router.post('/:sessionId/offline', async (req, res) => {
  try {
    const { sessionId } = req.params

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { 
        isOnline: false,
        lastSeenAt: new Date()
      }
    })

    // Notify admin
    const io = getIO()
    if (io) {
      io.to('admin:chats').emit('chat:visitor_offline', { sessionId })
    }

    return sendSuccess(res, null, 'Marked as offline')
  } catch (error: any) {
    return sendError(res, 'Failed to update status', 500, error.message)
  }
})

export default router
