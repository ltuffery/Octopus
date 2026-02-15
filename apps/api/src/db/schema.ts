import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core'

export const webhooks = pgTable('webhooks', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  method: text('method').default('POST'),
  headers: text('headers'),
  body: text('body'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

export const crons = pgTable('crons', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  schedule: text('schedule').notNull(),
  webhookId: integer('webhook_id').references(() => webhooks.id),
  isActive: boolean('is_active').default(true),
  lastRun: timestamp('last_run'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const logs = pgTable('logs', {
  id: serial('id').primaryKey(),
  webhookId: integer('webhook_id').references(() => webhooks.id),
  cronId: integer('cron_id').references(() => crons.id),
  status: integer('status'),
  response: text('response'),
  error: text('error'),
  executedAt: timestamp('executed_at').defaultNow(),
})
