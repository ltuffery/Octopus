<!-- src/pages/logs.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLogs } from '@/composables/useLogs';
import { useColorMode } from '@vueuse/core';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  Calendar,
  AlertCircle,
  Info,
  AlertTriangle,
  Bug,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
} from 'lucide-vue-next';
import { format } from 'date-fns';
import type { Log, LogLevel, LogSource } from '@/composables/useLogs';

const mode = useColorMode();
const {
  logs,
  filters,
  isLoading,
  stats,
  currentPage,
  pageSize,
  totalPages,
  totalLogs,
  fetchLogs,
  setFilter,
  clearFilters,
  deleteLog,
  clearOldLogs,
  exportLogs,
} = useLogs();

const selectedLog = ref<Log | null>(null);
const showDetailDialog = ref(false);
const searchQuery = ref('');
const selectedLevel = ref<LogLevel | 'all'>('all');
const selectedSource = ref<LogSource | 'all'>('all');

onMounted(() => {
  fetchLogs();
});

const handleSearch = () => {
  setFilter('search', searchQuery.value || undefined);
};

const handleLevelFilter = (level: string) => {
  selectedLevel.value = level as LogLevel | 'all';
  setFilter('level', level === 'all' ? undefined : (level as LogLevel));
};

const handleSourceFilter = (source: string) => {
  selectedSource.value = source as LogSource | 'all';
  setFilter('source', source === 'all' ? undefined : (source as LogSource));
};

const handleClearFilters = () => {
  searchQuery.value = '';
  selectedLevel.value = 'all';
  selectedSource.value = 'all';
  clearFilters();
};

const showLogDetail = (log: Log) => {
  selectedLog.value = log;
  showDetailDialog.value = true;
};

const getLevelIcon = (level: LogLevel) => {
  switch (level) {
    case 'error':
      return AlertCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
      return Info;
    case 'debug':
      return Bug;
  }
};

const getLevelColor = (level: LogLevel) => {
  switch (level) {
    case 'error':
      return 'destructive';
    case 'warning':
      return 'warning';
    case 'info':
      return 'default';
    case 'debug':
      return 'secondary';
  }
};

const getSourceColor = (source: LogSource) => {
  switch (source) {
    case 'webhook':
      return 'bg-blue-500/10 text-blue-500';
    case 'cron':
      return 'bg-purple-500/10 text-purple-500';
    case 'system':
      return 'bg-orange-500/10 text-orange-500';
    case 'api':
      return 'bg-green-500/10 text-green-500';
  }
};

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const hasActiveFilters = () => {
  return searchQuery.value || selectedLevel.value !== 'all' || selectedSource.value !== 'all';
};
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Logs</h1>
        <p class="text-muted-foreground mt-1">
          Monitor and analyze system logs
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button
            variant="outline"
            size="sm"
            @click="fetchLogs"
            :disabled="isLoading"
        >
          <RefreshCw
              class="h-4 w-4 mr-2"
              :class="{ 'animate-spin': isLoading }"
          />
          Refresh
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm">
              <Download class="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Export Format</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="exportLogs('json')">
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem @click="exportLogs('csv')">
              Export as CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm">
              <Trash2 class="h-4 w-4 mr-2" />
              Clean
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Clear Old Logs</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="clearOldLogs(7)">
              Older than 7 days
            </DropdownMenuItem>
            <DropdownMenuItem @click="clearOldLogs(30)">
              Older than 30 days
            </DropdownMenuItem>
            <DropdownMenuItem @click="clearOldLogs(90)">
              Older than 90 days
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Total Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.total.toLocaleString() }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Errors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-red-500">{{ stats.errors }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Warnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-yellow-500">{{ stats.warnings }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-blue-500">{{ stats.info }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Avg Duration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ stats.avgDuration ? formatDuration(stats.avgDuration) : 'N/A' }}
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Filters -->
    <Card>
      <CardContent class="pt-6">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                  v-model="searchQuery"
                  placeholder="Search logs..."
                  class="pl-10"
                  @keyup.enter="handleSearch"
              />
            </div>
          </div>

          <!-- Level Filter -->
          <Select :model-value="selectedLevel" @update:model-value="handleLevelFilter">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Log Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>

          <!-- Source Filter -->
          <Select :model-value="selectedSource" @update:model-value="handleSourceFilter">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="webhook">Webhook</SelectItem>
              <SelectItem value="cron">Cron</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="api">API</SelectItem>
            </SelectContent>
          </Select>

          <!-- Clear Filters -->
          <Button
              v-if="hasActiveFilters()"
              variant="outline"
              @click="handleClearFilters"
          >
            <Filter class="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Logs Table -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>Log Entries</CardTitle>
          <div class="text-sm text-muted-foreground">
            Showing {{ ((currentPage - 1) * pageSize) + 1 }}-{{ Math.min(currentPage * pageSize, totalLogs) }} of {{ totalLogs }}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea class="h-[600px]">
          <div class="space-y-2">
            <div
                v-for="log in logs"
                :key="log.id"
                class="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                @click="showLogDetail(log)"
            >
              <!-- Level Icon -->
              <div
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  :class="{
                  'bg-red-500/10 text-red-500': log.level === 'error',
                  'bg-yellow-500/10 text-yellow-500': log.level === 'warning',
                  'bg-blue-500/10 text-blue-500': log.level === 'info',
                  'bg-gray-500/10 text-gray-500': log.level === 'debug',
                }"
              >
                <component :is="getLevelIcon(log.level)" class="h-4 w-4" />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <Badge :variant="getLevelColor(log.level)" class="text-xs">
                        {{ log.level.toUpperCase() }}
                      </Badge>
                      <Badge
                          variant="outline"
                          :class="getSourceColor(log.source)"
                          class="text-xs"
                      >
                        {{ log.source }}
                      </Badge>
                      <span class="text-xs text-muted-foreground">
                        {{ format(log.timestamp, 'MMM dd, HH:mm:ss') }}
                      </span>
                      <span v-if="log.duration" class="text-xs text-muted-foreground">
                        • {{ formatDuration(log.duration) }}
                      </span>
                    </div>
                    <p class="mt-1 text-sm font-medium text-foreground">
                      {{ log.message }}
                    </p>
                    <div class="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                      <span v-if="log.userId">User: {{ log.userId }}</span>
                      <span v-if="log.ip">IP: {{ log.ip }}</span>
                      <span v-if="log.statusCode">Status: {{ log.statusCode }}</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child @click.stop>
                      <Button variant="ghost" size="icon" class="h-8 w-8">
                        <MoreVertical class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click.stop="showLogDetail(log)">
                        <Eye class="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                          class="text-destructive"
                          @click.stop="deleteLog(log.id)"
                      >
                        <Trash2 class="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
                v-if="!isLoading && logs.length === 0"
                class="flex flex-col items-center justify-center py-12 text-muted-foreground"
            >
              <AlertCircle class="h-12 w-12 mb-4 opacity-50" />
              <p class="text-lg font-medium">No logs found</p>
              <p class="text-sm mt-1">Try adjusting your filters</p>
            </div>
          </div>
        </ScrollArea>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4 pt-4 border-t">
          <div class="text-sm text-muted-foreground">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
          <div class="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                :disabled="currentPage === 1"
                @click="currentPage--"
            >
              <ChevronLeft class="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
            >
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Log Detail Dialog -->
    <Dialog v-model:open="showDetailDialog">
      <DialogContent class="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Log Details</DialogTitle>
          <DialogDescription>
            {{ selectedLog?.id }}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea v-if="selectedLog" class="h-[500px]">
          <div class="space-y-4">
            <!-- Basic Info -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-muted-foreground">Level</p>
                <Badge :variant="getLevelColor(selectedLog.level)" class="mt-1">
                  {{ selectedLog.level.toUpperCase() }}
                </Badge>
              </div>
              <div>
                <p class="text-sm font-medium text-muted-foreground">Source</p>
                <Badge
                    variant="outline"
                    :class="getSourceColor(selectedLog.source)"
                    class="mt-1"
                >
                  {{ selectedLog.source }}
                </Badge>
              </div>
              <div>
                <p class="text-sm font-medium text-muted-foreground">Timestamp</p>
                <p class="text-sm mt-1">
                  {{ format(selectedLog.timestamp, 'PPpp') }}
                </p>
              </div>
              <div v-if="selectedLog.duration">
                <p class="text-sm font-medium text-muted-foreground">Duration</p>
                <p class="text-sm mt-1">
                  {{ formatDuration(selectedLog.duration) }}
                </p>
              </div>
              <div v-if="selectedLog.userId">
                <p class="text-sm font-medium text-muted-foreground">User ID</p>
                <p class="text-sm mt-1 font-mono">{{ selectedLog.userId }}</p>
              </div>
              <div v-if="selectedLog.ip">
                <p class="text-sm font-medium text-muted-foreground">IP Address</p>
                <p class="text-sm mt-1 font-mono">{{ selectedLog.ip }}</p>
              </div>
              <div v-if="selectedLog.statusCode">
                <p class="text-sm font-medium text-muted-foreground">Status Code</p>
                <Badge
                    :variant="selectedLog.statusCode >= 400 ? 'destructive' : 'default'"
                    class="mt-1"
                >
                  {{ selectedLog.statusCode }}
                </Badge>
              </div>
            </div>

            <!-- Message -->
            <div>
              <p class="text-sm font-medium text-muted-foreground mb-2">Message</p>
              <div class="p-4 rounded-lg bg-muted font-mono text-sm">
                {{ selectedLog.message }}
              </div>
            </div>

            <!-- Metadata -->
            <div v-if="selectedLog.metadata">
              <p class="text-sm font-medium text-muted-foreground mb-2">Metadata</p>
              <div class="p-4 rounded-lg bg-muted font-mono text-xs overflow-x-auto">
                <pre>{{ JSON.stringify(selectedLog.metadata, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  </div>
</template>
