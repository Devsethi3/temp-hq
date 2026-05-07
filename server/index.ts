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
    if (cursor) {
      params.push(cursor)
      where.push("id < $1")
    }
    if (query.category && query.category !== "all") {
      params.push(query.category)
      where.push(`category = $${params.length + 1}`)
    }
    if (where.length > 0) sql += " WHERE " + where.join(" AND ")
    sql += " ORDER BY id DESC LIMIT $" + (params.length + 1)
    params.push(limit + 1)
    const result = await pool.query(sql, params)
    const hasNextPage = result.rows.length > limit
    return {
      logos: hasNextPage ? result.rows.slice(0, limit) : result.rows,
      nextCursor: hasNextPage ? result.rows[limit - 1]?.id : null,
      hasNextPage,
    }
  })
  .get("/api/logos/:slug", async ({ params: { slug } }) => {
    const result = await pool.query("SELECT * FROM logos WHERE slug = $1", [
      slug,
    ])
    if (result.rows.length === 0) return { error: "Logo not found" }
    return result.rows[0]
  })
  .get("/api/categories", () => [
    { value: "all", label: "All" },
    { value: "ai", label: "AI" },
    { value: "design", label: "Design" },
    { value: "saas", label: "SaaS" },
    { value: "tech", label: "Tech" },
    { value: "food", label: "Food" },
  ])
  .listen(PORT)

console.log("Server on port " + PORT)
