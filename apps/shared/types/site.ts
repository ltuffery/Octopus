export type SiteSource = 'local' | 'github' | 'gitlab'
export type SiteStatus = 'pending' | 'building' | 'running' | 'stopped' | 'error'

export interface Site {
    id: string
    name: string
    source: SiteSource
    sourceUrl?: string
    localPath?: string
    framework: string
    branch?: string
    buildCommand?: string
    startCommand?: string
    envVars: string[]
    domain: string
    port: number
    status: SiteStatus
    createdAt: string | Date
    updatedAt: string | Date
}

export interface CreateSite {
    name: string
    source: SiteSource
    sourceUrl?: string
    localPath?: string
    framework: string
    branch?: string
    buildCommand?: string
    startCommand?: string
    envVars: string[]
    domain: string
    port: number
}