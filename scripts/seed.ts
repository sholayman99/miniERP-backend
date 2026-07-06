import { connectMongo, disconnectMongo } from '../src/lib/mongo'
import { seedPermissions } from './seed-permissions'
import { seedRoles } from './seed-roles'
import { seedUsers } from './seed-users'

async function main() {
  await connectMongo()
  await seedPermissions()
  await seedRoles() // depends on permissions existing
  await seedUsers() // depends on roles existing
  await disconnectMongo()
  console.log('✅ Seed complete')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Seed failed', err)
  process.exit(1)
})
