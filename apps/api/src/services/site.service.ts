import {CreateSite, Site} from "@octopus/shared";
import {db} from "../db";
import {sites} from "../db/schema";
import {eq} from "drizzle-orm";

export class SiteService {

    async getAllSites(): Promise<Site[]> {
        return db.select().from(sites);
    }

    async getSiteByName(name: string): Promise<Site | undefined> {
        const result = db.select().from(sites).where(eq(sites.name, name)) as unknown as Site[];

        return result[0];
    }

    async createSite(data: CreateSite) {
        const [site] = await db
            .insert(sites)
            .values({
                ...data,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning()

        return site
    }
}