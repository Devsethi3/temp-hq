#!/bin/bash
# Quick setup - run this on VPS

mkdir -p /root/logo-inspo/server

cat > /root/logo-inspo/server/index.ts << 'SERVERCODE'
import Elysia from "elysia"
import pg from "pg"
const { Pool } = pg

const PORT = parseInt(process.env.PORT || "3001")
const pool = new Pool({
  host: "137.184.101.222",
  port: 5432,
  user: "logo_inspo",
  password: process.env.DB_PASSWORD || "Logo@4522",
  database: "logo_inspo",
})

const app = new Elysia()
  .get("/", () => ({ status: "ok" }))
  .get("/api/logos", async ({ query }) => {
    const limit = Math.min(Number(query.limit) || 6, 20)
    const cursor = query.cursor ? Number(query.cursor) : undefined
    
    let sql = "SELECT * FROM logos"
    const params: any[] = []
    const where: string[] = []
    
    if (cursor) { params.push(cursor); where.push("id < $1") }
    if (query.category && query.category !== "all") { params.push(query.category); where.push(`category = $${params.length}`) }
    if (where.length > 0) sql += " WHERE " + where.join(" AND ")
    sql += " ORDER BY id DESC LIMIT $" + (params.length + 1)
    params.push(limit + 1)
    
    const result = await pool.query(sql, params)
    const hasNextPage = result.rows.length > limit
    return { logos: hasNextPage ? result.rows.slice(0, limit) : result.rows, nextCursor: hasNextPage ? result.rows[limit-1]?.id : null, hasNextPage }
  })
  .get("/api/categories", () => [
    { value: "all", label: "All" }, { value: "ai", label: "AI" }, { value: "finance", label: "Finance" },
    { value: "saas", label: "SaaS" }, { value: "ecommerce", label: "Ecommerce" }, { value: "healthcare", label: "Healthcare" }
  ])
  .listen(PORT)

console.log("Server running on port " + PORT)
SERVERCODE

echo "Server file created. Now run:"
echo "cd /root/logo-inspo"
echo "bun install elysia pg"
echo "PORT=3001 DB_PASSWORD='Logo@4522' bun run server/index.ts"