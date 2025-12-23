/// <reference types="node" />
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verifying admin users...')

  const admins = ['admin@matictrade.com', 'superadmin@matictrade.com']

  for (const email of admins) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, username: true, role: true }
    })

    if (user) {
      console.log(`✅ User found: ${user.username} (${user.email}) - Role: ${user.role}`)
    } else {
      console.log(`❌ User NOT found: ${email}`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
