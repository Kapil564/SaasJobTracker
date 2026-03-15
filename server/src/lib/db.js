import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

const pool = {
  query: async (text, params = []) => {
    const rows = await sql.query(text, params);
    return { rows };
  },
};

export default pool;