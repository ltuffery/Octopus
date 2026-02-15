export interface Webhook {
  id: number
  name: string
  url: string
  method: string
  headers?: string
  body?: string
  isActive: boolean
  createdAt: Date
}

export interface Cron {
  id: number
  name: string
  schedule: string
  webhookId: number
  isActive: boolean
  lastRun?: Date
  createdAt: Date
}

export interface Log {
  id: number
  webhookId?: number
  cronId?: number
  status?: number
  response?: string
  error?: string
  executedAt: Date
}

export type CreateWebhook = Omit<Webhook, 'id' | 'createdAt'>
export type CreateCron = Omit<Cron, 'id' | 'lastRun' | 'createdAt'>
