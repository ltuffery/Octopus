<!-- src/components/crons/CronExecuteDialog.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Clock, CheckCircle2, XCircle } from 'lucide-vue-next';
import type { CronJob, CronExecution } from '@/composables/useCrons';

interface Props {
  open: boolean;
  cron: CronJob | null;
  executions: CronExecution[];
  loading?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:open': [value: boolean];
  execute: [cronId: string];
}>();

const executing = ref(false);

const sortedExecutions = computed(() => {
  return [...props.executions].sort((a, b) =>
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
});

const getStatusIcon = (status: CronExecution['status']) => {
  const icons = {
    running: Loader2,
    success: CheckCircle2,
    failed: XCircle
  };
  return icons[status];
};

const getStatusColor = (status: CronExecution['status']) => {
  const colors = {
    running: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    failed: 'bg-red-500/10 text-red-500 border-red-500/20'
  };
  return colors[status];
};

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
};

const execute = async () => {
  if (!props.cron) return;

  executing.value = true;
  try {
    await emit('execute', props.cron.id);
  } finally {
    executing.value = false;
  }
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-4xl max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>{{ cron?.name }}</DialogTitle>
        <DialogDescription>
          Execution history and logs
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <!-- Execute Button -->
        <Button
            @click="execute"
            :disabled="executing || cron?.status === 'running'"
            class="w-full"
        >
          <Loader2 v-if="executing || cron?.status === 'running'" class="mr-2 h-4 w-4 animate-spin" />
          Execute Now
        </Button>

        <!-- Executions List -->
        <div class="border rounded-lg">
          <div class="p-4 border-b bg-muted/50">
            <h3 class="font-semibold">Execution History</h3>
          </div>

          <ScrollArea class="h-[400px]">
            <div v-if="loading" class="flex items-center justify-center py-12">
              <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
            </div>

            <div v-else-if="sortedExecutions.length === 0" class="text-center py-12 text-muted-foreground">
              No executions yet
            </div>

            <div v-else class="divide-y">
              <div
                  v-for="execution in sortedExecutions"
                  :key="execution.id"
                  class="p-4 hover:bg-muted/50 transition-colors"
              >
                <div class="flex items-start justify-between gap-4 mb-3">
                  <div class="flex items-center gap-2">
                    <component
                        :is="getStatusIcon(execution.status)"
                        :class="[
                        'h-5 w-5',
                        execution.status === 'running' && 'animate-spin'
                      ]"
                    />
                    <Badge :class="getStatusColor(execution.status)" variant="outline">
                      {{ execution.status }}
                    </Badge>
                  </div>
                  <div class="text-sm text-muted-foreground">
                    {{ new Date(execution.startedAt).toLocaleString() }}
                  </div>
                </div>

                <div class="space-y-2 text-sm">
                  <div class="flex items-center gap-4">
                    <span class="text-muted-foreground">Duration:</span>
                    <span class="font-medium">{{ formatDuration(execution.duration) }}</span>
                  </div>

                  <div v-if="execution.output" class="space-y-1">
                    <span class="text-muted-foreground">Output:</span>
                    <pre class="p-2 bg-muted rounded text-xs overflow-x-auto">{{ execution.output }}</pre>
                  </div>

                  <div v-if="execution.error" class="space-y-1">
                    <span class="text-destructive">Error:</span>
                    <pre class="p-2 bg-destructive/10 text-destructive rounded text-xs overflow-x-auto">{{ execution.error }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
