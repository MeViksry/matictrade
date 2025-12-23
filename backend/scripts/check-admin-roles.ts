// Script to check and update admin roles
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAndFixAdminRoles() {
  console.log('🔍 Checking all users with admin roles...\n')
  
  // Get all users
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      isActive: true
    },
    orderBy: { role: 'asc' }
  })
  
  console.log('📋 Current users in database:')
  console.log('=' .repeat(80))
  
  allUsers.forEach(user => {
    const roleEmoji = user.role === 'SUPER_ADMIN' ? '👑' : user.role === 'ADMIN' ? '🔑' : '👤'
    console.log(`${roleEmoji} ${user.username.padEnd(20)} | ${user.email.padEnd(35)} | ${user.role.padEnd(12)} | Active: ${user.isActive}`)
  })
  
  console.log('=' .repeat(80))
  
  // Count by role
  const adminCount = allUsers.filter(u => u.role === 'ADMIN').length
  const superAdminCount = allUsers.filter(u => u.role === 'SUPER_ADMIN').length
  const userCount = allUsers.filter(u => u.role === 'USER').length
  
  console.log(`\n📊 Summary:`)
  console.log(`   👤 Users: ${userCount}`)
  console.log(`   🔑 Admins: ${adminCount}`)
  console.log(`   👑 Super Admins: ${superAdminCount}`)
  
  // Check specific admin emails
  const expectedAdmins = [
    'admin@matictrade.com',
    'adminjkt@matictrade.com', 
    'admintsk@matictrade.com',
    'superadmin@matictrade.com'
  ]
  
  console.log('\n🔧 Checking expected admin accounts...')
  
  for (const email of expectedAdmins) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { email: true, username: true, role: true }
    })
    
    if (user) {
      if (user.role === 'USER') {
        console.log(`⚠️  ${email} has role USER (should be ADMIN or SUPER_ADMIN)`)
        
        // Fix the role
        const newRole = email.includes('super') || email === 'admin@matictrade.com' ? 'SUPER_ADMIN' : 'ADMIN'
        await prisma.user.update({
          where: { email },
          data: { role: newRole }
        })
        console.log(`✅ Fixed ${email} role to ${newRole}`)
      } else {
        console.log(`✅ ${email} has correct role: ${user.role}`)
      }
    } else {
      console.log(`❌ ${email} not found in database`)
    }
  }
  
  console.log('\n🎉 Check complete!')
}

checkAndFixAdminRoles()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
