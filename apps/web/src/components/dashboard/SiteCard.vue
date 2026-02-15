<!-- src/components/dashboard/StatsCards.vue -->
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Activity, AlertCircle, CheckCircle } from 'lucide-vue-next';

interface Props {
  stats: {
    total: number;
    running: number;
    stopped: number;
    error: number;
  };
}

const props = defineProps<Props>();

const cards = [
  {
    title: 'Total Sites',
    value: props.stats.total,
    icon: Server,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Running',
    value: props.stats.running,
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'Stopped',
    value: props.stats.stopped,
    icon: Activity,
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
  },
  {
    title: 'Errors',
    value: props.stats.error,
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
];
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card v-for="card in cards" :key="card.title">
      <CardHeader class="flex flex-row items-center justify-between pb-2">
        <CardTitle class="text-sm font-medium">
          {{ card.title }}
        </CardTitle>
        <div :class="[card.bgColor, 'p-2 rounded-lg']">
          <component :is="card.icon" :class="[card.color, 'h-4 w-4']" />
        </div>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ card.value }}</div>
      </CardContent>
    </Card>
  </div>
</template>
