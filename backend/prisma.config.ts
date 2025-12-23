export default defineConfig({
  migrations: {
    seed: 'bun ./prisma/seed.ts',
  },
  datasource: {
    url: 'postgresql://matic_user:matictrade11478@localhost:5432/matic_futures?schema=public',
  },
})