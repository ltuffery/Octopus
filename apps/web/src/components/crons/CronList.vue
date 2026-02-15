<!-- src/components/crons/CronList.vue -->
<script setup lang="ts">
import { Play, Pause, Edit, Trash2, Clock, CheckCircle2, XCircle, Loader2, MoreVertical } from 'lucide-vue-next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import type { CronJob } from '@/composables/useCrons';

interface Props {
  crons: CronJob[];
  loading?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  edit: [cron: CronJob];
  delete: [id: string];
  toggle: [id: string];
  execute: [id: string];
  viewExecutions: [cron: CronJob];
}>();

const getStatusColor = (status: CronJob['status']) => {
  const colors = {
    active: 'bg-green-500/10 text-green-500 border-green-500/20',
    inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    running: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    failed: 'bg-red-500/10 text-red-500 border-red-500/20'
  };
  return colors[status];
};

const getSuccessRateColor = (rate: number) => {
  if (rate >= 95) return 'text-green-500';
  if (rate >= 80) return 'text-yellow-500';
  return 'text-red-500';
};

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
};

const formatSchedule = (schedule: string) => {
  const patterns: Record<string, string> = {
    '* * * * *': 'Every minute',
    '*/5 * * * *': 'Every 5 minutes',
    '0 * * * *': 'Every hour',
    '0 */6 * * *': 'Every 6 hours',
    '0 0 * * *': 'Daily at midnight',
    '0 2 * * *': 'Daily at 2:00 AM',
    '0 9 * * 1': 'Every Monday at 9:00 AM',
    '0 0 1 * *': 'Monthly on 1st at midnight'
  };
  return patterns[schedule] || schedule;
};
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
    </div>

    <div v-else-if="crons.length === 0" class="text-center py-12">
      <Clock class="mx-auto h-12 w-12 text-muted-foreground/50" />
      <h3 class="mt-4 text-lg font-semibold">No cron jobs yet</h3>
      <p class="text-muted-foreground">Create your first cron job to get started</p>
    </div>

    <Card
        v-for="cron in crons"
        :key="cron.id"
        class="hover:shadow-md transition-shadow"
    >
      <CardContent class="p-6">
        <div class="flex items-start justify-between gap-4">
          <!-- Left: Info -->
          <div class="flex-1 space-y-3">
            <!-- Header -->
            <div class="flex items-start gap-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-lg font-semibold">{{ cron.name }}</h3>
                  <Badge :class="getStatusColor(cron.status)" variant="outline">
                    {{ cron.status }}
                  </Badge>
                  <Loader2 v-if="cron.status === 'running'" class="h-4 w-4 animate-spin" />
                </div>
                <p class="text-sm text-muted-foreground">{{ cron.description }}</p>
              </div>
            </div>

            <!-- Schedule & Command -->
            <div class="grid gap-2 sm:grid-cols-2">
              <div class="flex items-center gap-2 text-sm">
                <Clock class="h-4 w-4 text-muted-foreground" />
                <span class="font-medium">{{ formatSchedule(cron.schedule) }}</span>
                <code class="text-xs text-muted-foreground">{{ cron.schedule }}</code>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <code class="px-2 py-1 bg-muted rounded text-xs">{{ cron.command }}</code>
              </div>
            </div>

            <!-- Stats -->
            <div class="flex flex-wrap gap-4 text-sm">
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground">Executions:</span>
                <span class="font-medium">{{ cron.executions }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground">Success Rate:</span>
                <span :class="getSuccessRateColor(cron.successRate)" class="font-medium">
                  {{ cron.successRate }}%
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground">Avg Duration:</span>
                <span class="font-medium">{{ formatDuration(cron.avgDuration) }}</span>
              </div>
            </div>

            <!-- Times -->
            <div class="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div v-if="cron.lastRun">
                Last run: {{ new Date(cron.lastRun).toLocaleString() }}
              </div>
              <div>
                Next run: {{ new Date(cron.nextRun).toLocaleString() }}
              </div>
            </div>

            <!-- Tags -->
            <div v-if="cron.tags.length" class="flex flex-wrap gap-2">
              <Badge
                  v-for="tag in cron.tags"
                  :key="tag"
                  variant="secondary"
                  class="text-xs"
              >
                {{ tag }}
              </Badge>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-2">
            <Switch
                :checked="cron.enabled"
                @update:checked="emit('toggle', cron.id)"
            />

            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon">
                  <MoreVertical class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="emit('execute', cron.id)">
                  <Play class="mr-2 h-4 w-4" />
                  Execute Now
                </DropdownMenuItem>
                <DropdownMenuItem @click="emit('viewExecutions', cron)">
                  <Clock class="mr-2 h-4 w-4" />
                  View Executions
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="emit('edit', cron)">
                  <Edit class="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    @click="emit('delete', cron.id)"
                    class="text-destructive focus:text-destructive"
                >
                  <Trash2 class="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
