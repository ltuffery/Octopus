// src/composables/useSites.ts
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import {useFetch} from "@vueuse/core";
import type {Site} from "@octopus/shared";

export type SiteStatus = 'running' | 'stopped' | 'building' | 'error' | 'starting' | 'stopping';
export type SiteSource = 'github' | 'gitlab' | 'local';

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

export interface CreateSitePayload {
    name: string;
    source: SiteSource;
    sourceUrl?: string;
    localPath?: string;
    framework: string;
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
    const sites: Ref<Site[]> = ref<Site[]>([]);
    const isLoading = ref(false);
    const isCreating = ref(false);

    // Fetch sites
    const fetchSites = async () => {
        isLoading.value = true;

        const { data } = await useFetch<Site[]>(`http://localhost:3000/api/sites`).json()

        if (data.value != null) {
            sites.value = data.value
        }

        isLoading.value = false;
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

        site.status = 'building';
        await new Promise(resolve => setTimeout(resolve, 2000));
        site.status = 'running';
    };

    // Stop site
    const stopSite = async (id: string) => {
        const site = sites.value.find(s => s.id === id);
        if (!site) return;

        site.status = 'stopped';
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
    };

    // Stats
    const stats = computed((): SiteStats => {
        return {
            total: sites.value.length,
            running: sites.value.filter(s => s.status === 'running').length,
            stopped: sites.value.filter(s => s.status === 'stopped').length,
            building: sites.value.filter(s => s.status === 'building').length,
            error: sites.value.filter(s => s.status === 'error').length,
            totalRequests: sites.value.reduce((sum, s) => sum + 0, 0),
            avgUptime: sites.value.length > 0
                ? sites.value.reduce((sum, s) => sum + 0, 0) / sites.value.length
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
