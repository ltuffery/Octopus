<!-- src/components/monitoring/AlertsPanel.vue -->
<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, AlertTriangle, Info, Check, X } from 'lucide-vue-next';
import { formatDistanceToNow } from 'date-fns';
import type { Alert } from '@/composables/useMonitoring';

interface Props {
  alerts: Alert[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  acknowledge: [alertId: string];
  delete: [alertId: string];
}>();

const getAlertIcon = (type: Alert['type']) => {
  switch (type) {
    case 'error':
      return AlertCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
      return Info;
  }
};

const getAlertColor = (type: Alert['type']) => {
  switch (type) {
    case 'error':
      return 'destructive';
    case 'warning':
      return 'outline';
    case 'info':
      return 'secondary';
  }
};
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle>Alerts</CardTitle>
          <CardDescription>System alerts and notifications</CardDescription>
        </div>
        <Badge variant="secondary">
          {{ alerts.filter(a => !a.acknowledged).length }} unread
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <ScrollArea class="h-[400px] pr-4">
        <div v-if="alerts.length === 0" class="text-center py-8 text-muted-foreground">
          <Info class="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No alerts</p>
        </div>

        <div v-else class="space-y-3">
          <div
              v-for="alert in alerts"
              :key="alert.id"
              class="flex items-start gap-3 p-3 rounded-lg border"
              :class="alert.acknowledged ? 'opacity-50' : 'bg-accent/50'"
          >
            <component
                :is="getAlertIcon(alert.type)"
                class="h-5 w-5 mt-0.5"
                :class="{
                'text-destructive': alert.type === 'error',
                'text-yellow-500': alert.type === 'warning',
                'text-blue-500': alert.type === 'info'
              }"
            />

            <div class="flex-1 space-y-1">
              <div class="flex items-center gap-2">
                <Badge :variant="getAlertColor(alert.type)" class="text-xs">
                  {{ alert.type }}
                </Badge>
                <span class="text-xs text-muted-foreground">
                  {{ alert.service }}
                </span>
                <span class="text-xs text-muted-foreground">
                  {{ formatDistanceToNow(alert.timestamp, { addSuffix: true }) }}
                </span>
              </div>
              <p class="text-sm">{{ alert.message }}</p>
            </div>

            <div class="flex gap-1">
              <Button
                  v-if="!alert.acknowledged"
                  variant="ghost"
                  size="icon"
                  @click="emit('acknowledge', alert.id)"
              >
                <Check class="h-4 w-4" />
              </Button>
              <Button
                  variant="ghost"
                  size="icon"
                  @click="emit('delete', alert.id)"
              >
                <X class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
</template>
