// backend/src/routes/settings.routes.ts
import { Router } from 'express'
import { prisma } from '../config/database'
import { sendSuccess, sendError } from '../utils/apiResponse'
import { authenticate, requireAdmin } from '../middlewares/auth'

const router = Router()

// Default social media settings
const DEFAULT_SOCIAL_LINKS = {
  telegram: '',        // For group/channel link (footer)
  contactTelegram: '', // For contacting admin directly (CTA)
  twitter: '',
  instagram: '',
  facebook: '',
  youtube: '',
  discord: ''
}

// Default homepage settings
const DEFAULT_HOMEPAGE_SETTINGS = {
  watchDemoLink: ''  // Empty means use default #how-it-works
}

/**
 * GET /api/settings/social
 * Get social media links (public)
 */
router.get('/social', async (req, res) => {
  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key: 'social_links' }
    })

    let socialLinks = DEFAULT_SOCIAL_LINKS
    if (setting && setting.value) {
      try {
        socialLinks = { ...DEFAULT_SOCIAL_LINKS, ...JSON.parse(setting.value) }
      } catch {
        // Keep defaults if parse fails
      }
    }

    return sendSuccess(res, socialLinks, 'Social links retrieved')
  } catch (error: any) {
    console.error('Get social links error:', error)
    return sendError(res, 'Failed to get social links', 500, error.message)
  }
})

/**
 * PUT /api/settings/social
 * Update social media links (admin only)
 */
router.put('/social', authenticate, requireAdmin, async (req, res) => {
  try {
    const { telegram, contactTelegram, twitter, instagram, facebook, youtube, discord } = req.body

    const socialLinks = {
      telegram: telegram || '',
      contactTelegram: contactTelegram || '',
      twitter: twitter || '',
      instagram: instagram || '',
      facebook: facebook || '',
      youtube: youtube || '',
      discord: discord || ''
    }

    await prisma.siteSettings.upsert({
      where: { key: 'social_links' },
      update: { value: JSON.stringify(socialLinks) },
      create: { key: 'social_links', value: JSON.stringify(socialLinks) }
    })

    return sendSuccess(res, socialLinks, 'Social links updated')
  } catch (error: any) {
    console.error('Update social links error:', error)
    return sendError(res, 'Failed to update social links', 500, error.message)
  }
})

/**
 * GET /api/settings/homepage
 * Get homepage settings (public)
 */
router.get('/homepage', async (req, res) => {
  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key: 'homepage_settings' }
    })

    let homepageSettings = DEFAULT_HOMEPAGE_SETTINGS
    if (setting && setting.value) {
      try {
        homepageSettings = { ...DEFAULT_HOMEPAGE_SETTINGS, ...JSON.parse(setting.value) }
      } catch {
        // Keep defaults if parse fails
      }
    }

    return sendSuccess(res, homepageSettings, 'Homepage settings retrieved')
  } catch (error: any) {
    console.error('Get homepage settings error:', error)
    return sendError(res, 'Failed to get homepage settings', 500, error.message)
  }
})

/**
 * PUT /api/settings/homepage
 * Update homepage settings (admin only)
 */
router.put('/homepage', authenticate, requireAdmin, async (req, res) => {
  try {
    const { watchDemoLink } = req.body

    const homepageSettings = {
      watchDemoLink: watchDemoLink || ''
    }

    await prisma.siteSettings.upsert({
      where: { key: 'homepage_settings' },
      update: { value: JSON.stringify(homepageSettings) },
      create: { key: 'homepage_settings', value: JSON.stringify(homepageSettings) }
    })

    return sendSuccess(res, homepageSettings, 'Homepage settings updated')
  } catch (error: any) {
    console.error('Update homepage settings error:', error)
    return sendError(res, 'Failed to update homepage settings', 500, error.message)
  }
})

/**
 * GET /api/settings/all
 * Get all settings (admin only)
 */
router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findMany()
    
    const result: Record<string, any> = {}
    for (const setting of settings) {
      try {
        result[setting.key] = JSON.parse(setting.value)
      } catch {
        result[setting.key] = setting.value
      }
    }

    return sendSuccess(res, result, 'Settings retrieved')
  } catch (error: any) {
    console.error('Get settings error:', error)
    return sendError(res, 'Failed to get settings', 500, error.message)
  }
})

/**
 * PUT /api/settings/:key
 * Update a specific setting (admin only)
 */
router.put('/:key', authenticate, requireAdmin, async (req, res) => {
  try {
    const { key } = req.params
    const { value } = req.body

    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)

    await prisma.siteSettings.upsert({
      where: { key },
      update: { value: stringValue },
      create: { key, value: stringValue }
    })

    return sendSuccess(res, { key, value }, 'Setting updated')
  } catch (error: any) {
    console.error('Update setting error:', error)
    return sendError(res, 'Failed to update setting', 500, error.message)
  }
})

export default router
