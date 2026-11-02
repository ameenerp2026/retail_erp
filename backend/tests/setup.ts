if (!process.env.DATABASE_URL?.includes('retail_erp_test')) {
  throw new Error('Refusing to run tests: DATABASE_URL is not the test database')
}