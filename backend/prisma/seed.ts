/// <reference types="node" />
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // ==========================================
  // 1. SUPER ADMIN MATIC VIKSRY
  // ==========================================

  const adminMaticPassword = await bcrypt.hash('Vik@11478', 12)
  const adminMatic = await prisma.user.upsert({
    where: { email: 'admin@matictrade.com' },
    update: {},
    create: {
      email: 'admin@matictrade.com',
      username: 'viksry',
      password: adminMaticPassword,
      fullName: 'Viksry',
      phone: '+6289651837578',
      role: 'SUPER_ADMIN',
      isActive: true,
      isEmailVerified: true,
      profile: {
        create: {
          phone: '+6289651837578',
          address: 'Tasikmalaya, Indonesia'
        }
      },
      portfolio: { create: {} },
      botSettings: { create: {} }
    }
  })
  console.log('✅ Super Admin Viksry created:', adminMatic.username)

  // ==========================================
  // 2. SUPER ADMIN - Aryanto Hong
  // ==========================================

  const superAdminPassword = await bcrypt.hash('Aryantohong@11478', 12)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@matictrade.com' },
    update: {},
    create: {
      email: 'superadmin@matictrade.com',
      username: 'aryantohong',
      password: superAdminPassword,
      fullName: 'Aryanto Hong',
      phone: '+6282124872587',
      role: 'SUPER_ADMIN',
      isActive: true,
      isEmailVerified: true,
      profile: {
        create: {
          phone: '+6282124872587',
          address: 'Jakarta, Indonesia'
        }
      },
      portfolio: { create: {} },
      botSettings: { create: {} }
    }
  })
  console.log('✅ Super Admin Aryanto Hong created:', superAdmin.username)

  console.log('🎉 Seed completed successfully!')

  console.log('\n=============================================')
  console.log('SUPER ADMIN CREDENTIALS:')
  console.log('(Login dapat menggunakan email/username/phone)')
  console.log('---------------------------------------------')
  console.log('Super Admin Viksry:')
  console.log('  Email   : admin@matictrade.com')
  console.log('  Username: viksry')
  console.log('  Phone   : +6289651837578')
  console.log('  Pass    : Vik@11478')
  console.log('---------------------------------------------')
  console.log('Super Admin Aryanto Hong:')
  console.log('  Email   : superadmin@matictrade.com')
  console.log('  Username: aryantohong')
  console.log('  Phone   : +6282124872587')
  console.log('  Pass    : Aryantohong@11478')
  console.log('=============================================')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })