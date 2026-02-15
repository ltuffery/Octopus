import { Hono } from 'hono'
import sitesRoutes from "./routes/sites.routes";

const app = new Hono()

app.route("/sites", sitesRoutes)

export default app
