// backend/src/routes/blog.routes.ts
import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireAdmin } from '../middlewares/auth'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const router = Router()
const prisma = new PrismaClient()

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../public/uploads/blog')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'))
    }
  }
})

// Helper: Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ==========================================
// ADMIN ROUTES (must be before parameterized routes)
// ==========================================

// POST /api/blog/admin/upload - Upload image
router.post('/admin/upload', authenticate, requireAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' })
    }
    
    const imageUrl = `/uploads/blog/${req.file.filename}`
    
    res.json({ success: true, data: { url: imageUrl } })
  } catch (error) {
    console.error('Error uploading image:', error)
    res.status(500).json({ success: false, message: 'Failed to upload image' })
  }
})

// GET /api/blog/admin/categories - List categories (admin)
router.get('/admin/categories', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: 'asc' }
    })
    
    res.json({ success: true, data: categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch categories' })
  }
})

// POST /api/blog/admin/categories - Create category
router.post('/admin/categories', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' })
    }
    
    const slug = generateSlug(name)
    
    const category = await prisma.blogCategory.create({
      data: { name, slug, description }
    })
    
    res.status(201).json({ success: true, data: category })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Category already exists' })
    }
    console.error('Error creating category:', error)
    res.status(500).json({ success: false, message: 'Failed to create category' })
  }
})

// DELETE /api/blog/admin/categories/:id - Delete category
router.delete('/admin/categories/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    await prisma.blogCategory.delete({ where: { id } })
    
    res.json({ success: true, message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    res.status(500).json({ success: false, message: 'Failed to delete category' })
  }
})

// GET /api/blog/admin - List all posts (admin)
router.get('/admin', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status, category, search, limit = '20', page = '1' } = req.query
    
    const take = parseInt(limit as string)
    const skip = (parseInt(page as string) - 1) * take
    
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (category) {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { author: { contains: search as string, mode: 'insensitive' } }
      ]
    }
    
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip
      }),
      prisma.blogPost.count({ where })
    ])
    
    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: take,
          totalPages: Math.ceil(total / take)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching admin blog posts:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch posts' })
  }
})

// POST /api/blog/admin - Create new post
router.post('/admin', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const {
      title,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      author,
      status,
      featured,
      metaTitle,
      metaDescription,
      metaKeywords
    } = req.body
    
    if (!title || !content || !category || !author) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, category, and author are required'
      })
    }
    
    // Generate unique slug
    let slug = generateSlug(title)
    const existingSlug = await prisma.blogPost.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }
    
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        category,
        tags: tags || [],
        author,
        status: status || 'DRAFT',
        featured: featured || false,
        metaTitle,
        metaDescription,
        metaKeywords,
        publishedAt: status === 'PUBLISHED' ? new Date() : null
      }
    })
    
    res.status(201).json({ success: true, data: post })
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ success: false, message: 'Failed to create post' })
  }
})

// GET /api/blog/admin/:id - Get single post (admin)
router.get('/admin/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const post = await prisma.blogPost.findUnique({
      where: { id }
    })
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    
    res.json({ success: true, data: post })
  } catch (error) {
    console.error('Error fetching post:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch post' })
  }
})

// PUT /api/blog/admin/:id - Update post
router.put('/admin/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const {
      title,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      author,
      status,
      featured,
      metaTitle,
      metaDescription,
      metaKeywords
    } = req.body
    
    const existingPost = await prisma.blogPost.findUnique({ where: { id } })
    if (!existingPost) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    
    // Update slug if title changed
    let slug = existingPost.slug
    if (title && title !== existingPost.title) {
      slug = generateSlug(title)
      const slugExists = await prisma.blogPost.findFirst({
        where: { slug, id: { not: id } }
      })
      if (slugExists) {
        slug = `${slug}-${Date.now()}`
      }
    }
    
    // Set publishedAt if publishing for first time
    let publishedAt = existingPost.publishedAt
    if (status === 'PUBLISHED' && !existingPost.publishedAt) {
      publishedAt = new Date()
    }
    
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        category,
        tags,
        author,
        status,
        featured,
        metaTitle,
        metaDescription,
        metaKeywords,
        publishedAt
      }
    })
    
    res.json({ success: true, data: post })
  } catch (error) {
    console.error('Error updating post:', error)
    res.status(500).json({ success: false, message: 'Failed to update post' })
  }
})

// DELETE /api/blog/admin/:id - Delete post
router.delete('/admin/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    
    await prisma.blogPost.delete({ where: { id } })
    
    res.json({ success: true, message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    res.status(500).json({ success: false, message: 'Failed to delete post' })
  }
})

// ==========================================
// PUBLIC ROUTES
// ==========================================

// GET /api/blog/public/categories - Get all categories (must be before :slug)
router.get('/public/categories', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: 'asc' }
    })
    
    res.json({ success: true, data: categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch categories' })
  }
})

// GET /api/blog/public - List published posts
router.get('/public', async (req: Request, res: Response) => {
  try {
    const { category, search, limit = '10', page = '1' } = req.query
    
    const take = parseInt(limit as string)
    const skip = (parseInt(page as string) - 1) * take
    
    const where: any = {
      status: 'PUBLISHED'
    }
    
    if (category && category !== 'All') {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { excerpt: { contains: search as string, mode: 'insensitive' } }
      ]
    }
    
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        take,
        skip,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          featuredImage: true,
          category: true,
          tags: true,
          author: true,
          featured: true,
          publishedAt: true,
          views: true
        }
      }),
      prisma.blogPost.count({ where })
    ])
    
    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: take,
          totalPages: Math.ceil(total / take)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching public blog posts:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch posts' })
  }
})

// GET /api/blog/public/:slug - Get single post by slug (must be last)
router.get('/public/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    })
    
    if (!post || post.status !== 'PUBLISHED') {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    
    // Increment views
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    })
    
    res.json({ success: true, data: post })
  } catch (error) {
    console.error('Error fetching post:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch post' })
  }
})

export default router
