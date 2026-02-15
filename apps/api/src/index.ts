import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json({ message: 'Octopus API 🐙' }))

const port = 8080
console.log(`🚀 Server running on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
