<!-- src/components/monitoring/ServiceStatus.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Play, Square, RotateCw, MoreVertical, Activity } from 'lucide-vue-next';
import type { ServiceStatus } from '@/composables/useMonitoring';

interface Props {
  services: ServiceStatus[];
  loading: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  restart: [serviceId: string];
  stop: [serviceId: string];
  start: [serviceId: string];
}>();

const getStatusColor = (status: ServiceStatus['status']) => {
  switch (status) {
    case 'running':
      return 'default';
    case 'stopped':
      return 'secondary';
    case 'error':
      return 'destructive';
    case 'warning':
      return 'outline';
    default:
      return 'secondary';
  }
};

const getStatusIcon = (status: ServiceStatus['status']) => {
  switch (status) {
    case 'running':
      return '●';
    case 'stopped':
      return '○';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    default:
      return '○';
  }
};

const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Services Status</CardTitle>
      <CardDescription>Monitor and control your services</CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-20 bg-muted rounded-lg" />
        </div>
      </div>

      <div v-else class="space-y-3">
        <div
            v-for="service in services"
            :key="service.id"
            class="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div class="flex items-center gap-4 flex-1">
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <span class="font-semibold">{{ service.name }}</span>
                <Badge :variant="getStatusColor(service.status)">
                  {{ getStatusIcon(service.status) }} {{ service.status }}
                </Badge>
              </div>
              <div class="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                <span>Uptime: {{ formatUptime(service.uptime) }}</span>
                <span v-if="service.port">Port: {{ service.port }}</span>
                <span>CPU: {{ service.cpu.toFixed(1) }}%</span>
                <span>RAM: {{ service.memory }}MB</span>
                <span v-if="service.requests">Req: {{ service.requests }}/min</span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon">
                <MoreVertical class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                  v-if="service.status === 'stopped'"
                  @click="emit('start', service.id)"
              >
                <Play class="mr-2 h-4 w-4" />
                Start
              </DropdownMenuItem>
              <DropdownMenuItem
                  v-else
                  @click="emit('restart', service.id)"
              >
                <RotateCw class="mr-2 h-4 w-4" />
                Restart
              </DropdownMenuItem>
              <DropdownMenuItem
                  v-if="service.status !== 'stopped'"
                  @click="emit('stop', service.id)"
                  class="text-destructive"
              >
                <Square class="mr-2 h-4 w-4" />
                Stop
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Activity class="mr-2 h-4 w-4" />
                View Logs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
