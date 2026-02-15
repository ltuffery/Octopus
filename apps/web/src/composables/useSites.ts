// src/composables/useSites.ts
import { ref, computed } from 'vue';
import type { Ref } from 'vue';

export type SiteStatus = 'running' | 'stopped' | 'building' | 'error' | 'starting' | 'stopping';
export type SiteSource = 'github' | 'gitlab' | 'local';
export type Framework = 'nextjs' | 'nuxt' | 'vue' | 'react' | 'php' | 'static' | 'custom';

export interface DockerContainer {
    id: string;
    name: string;
    image: string;
    status: 'running' | 'stopped' | 'paused';
    ports: { host: number; container: number }[];
    created: Date;
    uptime?: number;
}

export interface Database {
    id: string;
    type: 'mysql' | 'postgres' | 'mongodb' | 'redis';
    name: string;
    host: string;
    port: number;
    username: string;
    status: 'connected' | 'disconnected';
    size?: string;
}

export interface Volume {
    id: string;
    name: string;
    mountPath: string;
    size: string;
    used: string;
    available: string;
}

export interface Site {
    id: string;
    name: string;
    domain: string;
    description?: string;
    status: SiteStatus;
    source: SiteSource;
    sourceUrl?: string;
    localPath?: string;
    framework: Framework;
    branch?: string;

    // Docker
    containers: DockerContainer[];
    volumes: Volume[];
    databases: Database[];

    // Resources
    cpu: number;
    memory: number;
    disk: number;

    // URLs
    url: string;
    adminUrl?: string;

    // Stats
    requests: number;
    uptime: number;
    lastDeploy?: Date;

    // Config
    envVars: Record<string, string>;
    buildCommand?: string;
    startCommand?: string;
    port: number;

    // Metadata
    createdAt: Date;
    updatedAt: Date;
    organizationId?: string;
}

export interface CreateSitePayload {
    name: string;
    source: SiteSource;
    sourceUrl?: string;
    localPath?: string;
    framework: Framework;
    branch?: string;
    domain?: string;
    databases?: Array<{
        type: Database['type'];
        name: string;
    }>;
    envVars?: Record<string, string>;
    buildCommand?: string;
    startCommand?: string;
}

export interface SiteStats {
    total: number;
    running: number;
    stopped: number;
    building: number;
    error: number;
    totalRequests: number;
    avgUptime: number;
}

export function useSites() {
    const sites: Ref<Site[]> = ref([]);
    const isLoading = ref(false);
    const isCreating = ref(false);

    // Generate mock sites
    const generateMockSites = (): Site[] => {
        const frameworks: Framework[] = ['nextjs', 'nuxt', 'vue', 'react', 'php', 'static'];
        const sources: SiteSource[] = ['github', 'gitlab', 'local'];
        const statuses: SiteStatus[] = ['running', 'stopped', 'building', 'error'];

        return Array.from({ length: 8 }, (_, i) => {
            const framework = frameworks[Math.floor(Math.random() * frameworks.length)];
            const source = sources[Math.floor(Math.random() * sources.length)];
            const status = i < 6 ? 'running' : statuses[Math.floor(Math.random() * statuses.length)];
            const name = `site-${i + 1}`;

            return {
                id: `site-${i + 1}`,
                name,
                domain: `${name}.dev.local`,
                description: `Production ${framework} application`,
                status,
                source,
                sourceUrl: source !== 'local' ? `https://${source}.com/user/${name}` : undefined,
                localPath: source === 'local' ? `/var/www/${name}` : undefined,
                framework,
                branch: 'main',

                containers: [
                    {
                        id: `container-${i}-1`,
                        name: `${name}-web`,
                        image: `${framework}:latest`,
                        status: status === 'running' ? 'running' : 'stopped',
                        ports: [{ host: 3000 + i, container: 3000 }],
                        created: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                        uptime: status === 'running' ? Math.floor(Math.random() * 720) : undefined,
                    },
                ],

                volumes: [
                    {
                        id: `volume-${i}-1`,
                        name: `${name}-data`,
                        mountPath: '/app/data',
                        size: '10GB',
                        used: `${Math.floor(Math.random() * 8)}GB`,
                        available: `${10 - Math.floor(Math.random() * 8)}GB`,
                    },
                ],

                databases: Math.random() > 0.3 ? [
                    {
                        id: `db-${i}-1`,
                        type: ['mysql', 'postgres', 'mongodb'][Math.floor(Math.random() * 3)] as Database['type'],
                        name: `${name}_db`,
                        host: 'localhost',
                        port: 5432 + i,
                        username: 'admin',
                        status: status === 'running' ? 'connected' : 'disconnected',
                        size: `${Math.floor(Math.random() * 500)}MB`,
                    },
                ] : [],

                cpu: status === 'running' ? Math.random() * 100 : 0,
                memory: status === 'running' ? Math.random() * 100 : 0,
                disk: Math.random() * 100,

                url: `http://${name}.dev.local:${3000 + i}`,
                adminUrl: Math.random() > 0.5 ? `http://${name}.dev.local:${3000 + i}/admin` : undefined,

                requests: Math.floor(Math.random() * 10000),
                uptime: status === 'running' ? Math.random() * 100 : 0,
                lastDeploy: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),

                envVars: {
                    NODE_ENV: 'production',
                    PORT: String(3000 + i),
                    DATABASE_URL: `postgresql://localhost:${5432 + i}/${name}_db`,
                },
                buildCommand: 'npm run build',
                startCommand: 'npm start',
                port: 3000 + i,

                createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            };
        });
    };

    // Fetch sites
    const fetchSites = async () => {
        isLoading.value = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            sites.value = generateMockSites();
        } catch (error) {
            console.error('Failed to fetch sites:', error);
        } finally {
            isLoading.value = false;
        }
    };

    // Create site
    const createSite = async (payload: CreateSitePayload): Promise<Site> => {
        isCreating.value = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate build time

            const newSite: Site = {
                id: `site-${Date.now()}`,
                name: payload.name,
                domain: payload.domain || `${payload.name}.dev.local`,
                description: `New ${payload.framework} site`,
                status: 'building',
                source: payload.source,
                sourceUrl: payload.sourceUrl,
                localPath: payload.localPath,
                framework: payload.framework,
                branch: payload.branch || 'main',

                containers: [
                    {
                        id: `container-${Date.now()}`,
                        name: `${payload.name}-web`,
                        image: `${payload.framework}:latest`,
                        status: 'running',
                        ports: [{ host: 3000, container: 3000 }],
                        created: new Date(),
                    },
                ],

                volumes: [
                    {
                        id: `volume-${Date.now()}`,
                        name: `${payload.name}-data`,
                        mountPath: '/app/data',
                        size: '10GB',
                        used: '0GB',
                        available: '10GB',
                    },
                ],

                databases: payload.databases?.map((db, i) => ({
                    id: `db-${Date.now()}-${i}`,
                    type: db.type,
                    name: db.name,
                    host: 'localhost',
                    port: 5432 + i,
                    username: 'admin',
                    status: 'connected',
                    size: '0MB',
                })) || [],

                cpu: 0,
                memory: 0,
                disk: 0,

                url: `http://${payload.name}.dev.local:3000`,

                requests: 0,
                uptime: 100,
                lastDeploy: new Date(),

                envVars: payload.envVars || {},
                buildCommand: payload.buildCommand,
                startCommand: payload.startCommand,
                port: 3000,

                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // Simulate status changes
            setTimeout(() => {
                const site = sites.value.find(s => s.id === newSite.id);
                if (site) site.status = 'running';
            }, 2000);

            sites.value.unshift(newSite);
            return newSite;
        } catch (error) {
            console.error('Failed to create site:', error);
            throw error;
        } finally {
            isCreating.value = false;
        }
    };

    // Start site
    const startSite = async (id: string) => {
        const site = sites.value.find(s => s.id === id);
        if (!site) return;

        site.status = 'starting';
        await new Promise(resolve => setTimeout(resolve, 2000));
        site.status = 'running';

        site.containers.forEach(c => c.status = 'running');
        site.databases.forEach(db => db.status = 'connected');
    };

    // Stop site
    const stopSite = async (id: string) => {
        const site = sites.value.find(s => s.id === id);
        if (!site) return;

        site.status = 'stopping';
        await new Promise(resolve => setTimeout(resolve, 2000));
        site.status = 'stopped';

        site.containers.forEach(c => c.status = 'stopped');
        site.databases.forEach(db => db.status = 'disconnected');
        site.cpu = 0;
        site.memory = 0;
    };

    // Restart site
    const restartSite = async (id: string) => {
        await stopSite(id);
        await startSite(id);
    };

    // Delete site
    const deleteSite = async (id: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        sites.value = sites.value.filter(s => s.id !== id);
    };

    // Rebuild site
    const rebuildSite = async (id: string) => {
        const site = sites.value.find(s => s.id === id);
        if (!site) return;

        site.status = 'building';
        await new Promise(resolve => setTimeout(resolve, 5000));
        site.status = 'running';
        site.lastDeploy = new Date();
    };

    // Stats
    const stats = computed((): SiteStats => {
        return {
            total: sites.value.length,
            running: sites.value.filter(s => s.status === 'running').length,
            stopped: sites.value.filter(s => s.status === 'stopped').length,
            building: sites.value.filter(s => s.status === 'building').length,
            error: sites.value.filter(s => s.status === 'error').length,
            totalRequests: sites.value.reduce((sum, s) => sum + s.requests, 0),
            avgUptime: sites.value.length > 0
                ? sites.value.reduce((sum, s) => sum + s.uptime, 0) / sites.value.length
                : 0,
        };
    });

    return {
        sites,
        isLoading,
        isCreating,
        stats,
        fetchSites,
        createSite,
        startSite,
        stopSite,
        restartSite,
        deleteSite,
        rebuildSite,
    };
}
