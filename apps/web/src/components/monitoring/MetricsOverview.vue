<!-- src/components/monitoring/MetricsOverview.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Cpu, HardDrive, MemoryStick, Network, Thermometer } from 'lucide-vue-next';
import type { SystemMetrics } from '@/composables/useMonitoring';

interface Props {
  metrics: SystemMetrics;
}

const props = defineProps<Props>();

const cpuColor = computed(() => {
  if (props.metrics.cpu.usage > 80) return 'text-red-500';
  if (props.metrics.cpu.usage > 60) return 'text-yellow-500';
  return 'text-green-500';
});

const memoryColor = computed(() => {
  if (props.metrics.memory.percentage > 80) return 'text-red-500';
  if (props.metrics.memory.percentage > 60) return 'text-yellow-500';
  return 'text-green-500';
});

const diskColor = computed(() => {
  if (props.metrics.disk.percentage > 90) return 'text-red-500';
  if (props.metrics.disk.percentage > 75) return 'text-yellow-500';
  return 'text-green-500';
});

const formatBytes = (bytes: number) => {
  return `${bytes.toFixed(1)} GB`;
};

const formatSpeed = (speed: number) => {
  return `${speed.toFixed(1)} MB/s`;
};
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <!-- CPU -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">CPU Usage</CardTitle>
        <Cpu class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold" :class="cpuColor">
          {{ metrics.cpu.usage.toFixed(1) }}%
        </div>
        <Progress :model-value="metrics.cpu.usage" class="mt-2" />
        <div class="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <div class="flex items-center gap-1">
            <Cpu class="h-3 w-3" />
            {{ metrics.cpu.cores }} cores
          </div>
          <div class="flex items-center gap-1">
            <Thermometer class="h-3 w-3" />
            {{ metrics.cpu.temperature.toFixed(0) }}°C
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Memory -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Memory</CardTitle>
        <MemoryStick class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold" :class="memoryColor">
          {{ metrics.memory.percentage.toFixed(1) }}%
        </div>
        <Progress :model-value="metrics.memory.percentage" class="mt-2" />
        <p class="mt-2 text-xs text-muted-foreground">
          {{ formatBytes(metrics.memory.used) }} / {{ formatBytes(metrics.memory.total) }}
        </p>
      </CardContent>
    </Card>

    <!-- Disk -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Disk Space</CardTitle>
        <HardDrive class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold" :class="diskColor">
          {{ metrics.disk.percentage.toFixed(1) }}%
        </div>
        <Progress :model-value="metrics.disk.percentage" class="mt-2" />
        <p class="mt-2 text-xs text-muted-foreground">
          {{ formatBytes(metrics.disk.used) }} / {{ formatBytes(metrics.disk.total) }}
        </p>
      </CardContent>
    </Card>

    <!-- Network -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Network</CardTitle>
        <Network class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">↓ Inbound</span>
              <span class="font-medium">{{ formatSpeed(metrics.network.inbound) }}</span>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">↑ Outbound</span>
              <span class="font-medium">{{ formatSpeed(metrics.network.outbound) }}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
