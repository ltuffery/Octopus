import {Hono} from "hono";
import {db} from "../db";
import {sites} from "../db/schema";
import {zValidator} from "@hono/zod-validator";
import {createSiteSchema} from "../validators/site.validator";

const sitesRoutes = new Hono()

sitesRoutes.get('/', async (c) => {
    const allSites = await db.select().from(sites)

    return c.json(allSites, 200)
})

sitesRoutes.post('/', zValidator('json', createSiteSchema), async (c) => {
    const validated = c.req.valid('json')

    const [newSite] = await db
        .insert(sites)
        .values({
            ...validated,
            status: 'pending', // Ajoute le status par défaut
        })
        .returning()

    return c.json(newSite, 201)
})

export default sitesRoutes