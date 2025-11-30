import { env } from "node:process";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

const connectionString = env.DATABASE_URL;
if (!connectionString) {
	throw new Error("Missing DATABASE_URL for database connection");
}

const client = neon(connectionString);

export const db = drizzle({ client, schema });
export type DbInstance = typeof db;
