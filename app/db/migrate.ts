await migrate(db, {
    migrationsFolder: './drizzle'
})

await connections.end()