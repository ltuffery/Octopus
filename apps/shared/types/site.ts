export interface Site {
    id: string
    name: string
    source: 'local' | 'github' | 'gitlab'
    sourceUrl: string | undefined
    localPath: string | undefined
    framework: string
    branch: string
    buildCommand: string
    startCommand: string
    envVars: string[]
    domain: string
    port: number
    status: 'pending' | 'building' | 'running' | 'stopped' | 'error'
    createdAt: string
    updatedAt: string
}