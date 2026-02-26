import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as schema from "../src/db/schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

async function seedAdmin() {
    console.log("🔑 Seeding superuser...");

    const hashedPassword = await bcrypt.hash("Admin@123", 12);

    const existing = await db
        .select()
        .from(schema.admins)
        .where(eq(schema.admins.email, "admin@luxestate.com"))
        .limit(1);

    if (existing.length === 0) {
        await db.insert(schema.admins).values({
            name: "Admin",
            email: "admin@luxestate.com",
            password: hashedPassword,
            role: "superuser",
        });
        console.log("✅ Superuser created: admin@luxestate.com / Admin@123");
    } else {
        console.log("ℹ️  Superuser already exists, skipping.");
    }

    process.exit(0);
}

seedAdmin().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
