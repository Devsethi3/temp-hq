import { Database } from "bun:sqlite"

const sqlite = new Database("./logo-inspo.db")

export { sqlite }
