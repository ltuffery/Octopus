// src/composables/useLogs.ts
import { ref, computed } from 'vue';
import type { Ref } from 'vue';

export type LogLevel = 'info' | 'warning' | 'error' | 'debug';
export type LogSource = 'webhook' | 'cron' | 'system' | 'api';

export interface Log {
    id: string;
    timestamp: Date;
    level: LogLevel;
    source: LogSource;
    message: string;
    metadata?: Record<string, any>;
    userId?: string;
    ip?: string;
    duration?: number;
    statusCode?: number;
}

export interface LogFilters {
    level?: LogLevel;
    source?: LogSource;
    search?: string;
    dateFrom?: Date;
    dateTo?: Date;
}

export interface LogStats {
    total: number;
    errors: number;
    warnings: number;
    info: number;
    debug: number;
    avgDuration?: number;
}

export function useLogs() {
    const logs: Ref<Log[]> = ref([]);
    const filters: Ref<LogFilters> = ref({});
    const isLoading = ref(false);
    const currentPage = ref(1);
    const pageSize = ref(50);
    const totalLogs = ref(0);

    // Generate mock logs
    const generateMockLogs = (count: number): Log[] => {
        const levels: LogLevel[] = ['info', 'warning', 'error', 'debug'];
        const sources: LogSource[] = ['webhook', 'cron', 'system', 'api'];
        const messages = {
            info: [
                'Request processed successfully',
                'User logged in',
                'Data synced',
                'Cache updated',
                'Job completed',
            ],
            warning: [
                'Rate limit approaching',
                'Slow query detected',
                'High memory usage',
                'Deprecated API used',
                'Connection timeout',
            ],
            error: [
                'Database connection failed',
                'API request failed',
                'Validation error',
                'Authentication failed',
                'Internal server error',
            ],
            debug: [
                'Function called',
                'Variable state changed',
                'Request received',
                'Response sent',
                'Cache miss',
            ],
        };

        return Array.from({ length: count }, (_, i) => {
            const level = levels[Math.floor(Math.random() * levels.length)];
            const source = sources[Math.floor(Math.random() * sources.length)];
            const messageList = messages[level];
            const message = messageList[Math.floor(Math.random() * messageList.length)];

            return {
                id: `log-${Date.now()}-${i}`,
                timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                level,
                source,
                message,
                metadata: {
                    requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
                    environment: 'production',
                },
                userId: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 1000)}` : undefined,
                ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                duration: Math.floor(Math.random() * 5000),
                statusCode: level === 'error' ? 500 : level === 'warning' ? 429 : 200,
            };
        }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    // Fetch logs
    const fetchLogs = async () => {
        isLoading.value = true;
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            const mockLogs = generateMockLogs(500);
            totalLogs.value = mockLogs.length;
            logs.value = mockLogs;
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            isLoading.value = false;
        }
    };

    // Filtered logs
    const filteredLogs = computed(() => {
        let result = [...logs.value];

        // Filter by level
        if (filters.value.level) {
            result = result.filter(log => log.level === filters.value.level);
        }

        // Filter by source
        if (filters.value.source) {
            result = result.filter(log => log.source === filters.value.source);
        }

        // Filter by search
        if (filters.value.search) {
            const search = filters.value.search.toLowerCase();
            result = result.filter(log =>
                log.message.toLowerCase().includes(search) ||
                log.id.toLowerCase().includes(search) ||
                log.userId?.toLowerCase().includes(search) ||
                log.ip?.toLowerCase().includes(search)
            );
        }

        // Filter by date range
        if (filters.value.dateFrom) {
            result = result.filter(log => log.timestamp >= filters.value.dateFrom!);
        }
        if (filters.value.dateTo) {
            result = result.filter(log => log.timestamp <= filters.value.dateTo!);
        }

        return result;
    });

    // Paginated logs
    const paginatedLogs = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        const end = start + pageSize.value;
        return filteredLogs.value.slice(start, end);
    });

    const totalPages = computed(() =>
        Math.ceil(filteredLogs.value.length / pageSize.value)
    );

    // Stats
    const stats = computed((): LogStats => {
        const filtered = filteredLogs.value;
        const durations = filtered.filter(l => l.duration).map(l => l.duration!);

        return {
            total: filtered.length,
            errors: filtered.filter(l => l.level === 'error').length,
            warnings: filtered.filter(l => l.level === 'warning').length,
            info: filtered.filter(l => l.level === 'info').length,
            debug: filtered.filter(l => l.level === 'debug').length,
            avgDuration: durations.length
                ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
                : undefined,
        };
    });

    // Set filter
    const setFilter = (key: keyof LogFilters, value: any) => {
        filters.value[key] = value;
        currentPage.value = 1; // Reset to first page
    };

    // Clear filters
    const clearFilters = () => {
        filters.value = {};
        currentPage.value = 1;
    };

    // Delete log
    const deleteLog = async (id: string) => {
        logs.value = logs.value.filter(log => log.id !== id);
    };

    // Delete multiple logs
    const deleteLogs = async (ids: string[]) => {
        logs.value = logs.value.filter(log => !ids.includes(log.id));
    };

    // Clear old logs
    const clearOldLogs = async (days: number) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        logs.value = logs.value.filter(log => log.timestamp > cutoff);
    };

    // Export logs
    const exportLogs = (format: 'json' | 'csv') => {
        const data = filteredLogs.value;

        if (format === 'json') {
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json',
            });
            downloadFile(blob, `logs-${Date.now()}.json`);
        } else {
            const csv = convertToCSV(data);
            const blob = new Blob([csv], { type: 'text/csv' });
            downloadFile(blob, `logs-${Date.now()}.csv`);
        }
    };

    const convertToCSV = (data: Log[]): string => {
        const headers = ['Timestamp', 'Level', 'Source', 'Message', 'User ID', 'IP', 'Duration', 'Status'];
        const rows = data.map(log => [
            log.timestamp.toISOString(),
            log.level,
            log.source,
            `"${log.message.replace(/"/g, '""')}"`,
            log.userId || '',
            log.ip || '',
            log.duration || '',
            log.statusCode || '',
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    };

    const downloadFile = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return {
        logs: paginatedLogs,
        allLogs: filteredLogs,
        filters,
        isLoading,
        stats,
        currentPage,
        pageSize,
        totalPages,
        totalLogs: computed(() => filteredLogs.value.length),
        fetchLogs,
        setFilter,
        clearFilters,
        deleteLog,
        deleteLogs,
        clearOldLogs,
        exportLogs,
    };
}
