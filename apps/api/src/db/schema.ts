import { pgTable, uuid, varchar, text, timestamp, jsonb, integer, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const sourceEnum = pgEnum('source', ['local', 'github']);
export const statusEnum = pgEnum('status', ['pending', 'building', 'running', 'stopped', 'error']);

// Table sites
export const sites = pgTable('sites', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    source: sourceEnum('source').notNull(),
    sourceUrl: text('source_url'),
    localPath: text('local_path'),
    framework: varchar('framework'),
    branch: varchar('branch', { length: 100 }),
    buildCommand: text('build_command'),
    startCommand: text('start_command'),
    envVars: jsonb('env_vars'),
    domain: varchar('domain', { length: 255 }),
    port: integer('port'),
    status: statusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
