import { Hono } from 'hono'
import sitesRoutes from "./routes/sites.routes";

const app = new Hono()

app.route("/api/sites", sitesRoutes)

export default app
