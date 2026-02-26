import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);

async function migrate() {
    console.log("📦 Creating admins and otp_codes tables...");

    await sql`
        CREATE TABLE IF NOT EXISTS admins (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'staff',
            created_at TIMESTAMP DEFAULT NOW() NOT NULL
        )
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS otp_codes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT NOT NULL,
            code TEXT NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT NOW() NOT NULL
        )
    `;

    console.log("✅ Tables created successfully!");
    process.exit(0);
}

migrate().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
