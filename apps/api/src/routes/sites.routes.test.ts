import { describe, it, expect, beforeEach } from 'bun:test';
import app from '../index';
import { db } from '../db';
import { sites } from '../db/schema';

const baseUrl = 'http://localhost';

describe('Sites Routes', () => {
    beforeEach(async () => {
        await db.delete(sites);
    });

    describe('GET /sites', () => {
        it('responds with 200', async () => {
            const req = new Request(`${baseUrl}/sites`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const res = await app.fetch(req)

            expect(res.status).toBe(200)
            const data = await res.json()
            expect(data).toEqual([])
        })
    });

    describe('POST /sites', () => {
        it('responds with 201', async () => {
            const payload = {
                name: 'test-site',
                source: 'local',
                framework: 'php',
                localPath: '/var/www/test',
                port: 1234,
            }
            const req = new Request(`${baseUrl}/sites`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            const res = await app.fetch(req)
            const data = await res.json()

            expect(res.status).toBe(201)
            expect(data.success).toBeTrue()
            expect(data.data.name).toEqual('test-site')
        })
    })
});
