import mysql from 'mysql2/promise';

/**
 * Database Connection Pool
 * 
 * Instructions:
 * 1. Create a .env.local file in the root directory.
 * 2. Add the following variables:
 *    DB_HOST=localhost
 *    DB_USER=your_user
 *    DB_PASSWORD=your_password
 *    DB_NAME=your_database
 */

let pool: mysql.Pool | null = null;

if (process.env.DB_HOST) {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        // charset: 'utf8mb4' // Match your DB charset
    });
}

export async function query(sql: string, params: any[] = []) {
    if (!pool) {
        throw new Error("Database not configured. Please check .env.local");
    }
    const [results] = await pool.execute(sql, params);
    return results;
}

export default pool;
