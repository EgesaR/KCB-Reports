const { Client } = await import("pg");

const client = new Client({
  connectionString:
    "postgresql://neondb_owner:npg_agQjA1dHE4hk@ep-curly-sky-abjw5gsh-pooler.eu-west-2.aws.neon.tech/kcb-reports?sslmode=require&channel_binding=require",
});

async function deleteTables() {
  try {
    await client.connect();
    console.log("Connected to the database...");

    // Deleting the tables in the correct order (comments -> posts -> users)
    await client.query("DROP TABLE IF EXISTS comments CASCADE");
    console.log("Comments table deleted.");

    await client.query("DROP TABLE IF EXISTS posts CASCADE");
    console.log("Posts table deleted.");

    await client.query("DROP TABLE IF EXISTS users CASCADE");
    console.log("Users table deleted.");

    await client.end();
    console.log("Disconnected from the database.");
  } catch (err) {
    console.error("Error deleting tables:", err.stack);
  }
}

deleteTables();
