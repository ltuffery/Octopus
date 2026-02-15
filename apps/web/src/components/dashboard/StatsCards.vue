<!-- src/components/dashboard/StatsCards.vue -->
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Activity, TrendingUp, Clock } from 'lucide-vue-next';
import type { SiteStats } from '@/composables/useSites';

interface Props {
  stats: SiteStats;
}

defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Sites</CardTitle>
        <Server class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.total }}</div>
        <p class="text-xs text-muted-foreground mt-1">
          {{ stats.running }} running
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Active Sites</CardTitle>
        <Activity class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold text-green-500">{{ stats.running }}</div>
        <p class="text-xs text-muted-foreground mt-1">
          {{ stats.stopped }} stopped
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Requests</CardTitle>
        <TrendingUp class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">
          {{ stats.totalRequests.toLocaleString() }}
        </div>
        <p class="text-xs text-muted-foreground mt-1">
          Across all sites
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Avg Uptime</CardTitle>
        <Clock class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">
          {{ Math.round(stats.avgUptime) }}%
        </div>
        <p class="text-xs text-muted-foreground mt-1">
          Last 30 days
        </p>
      </CardContent>
    </Card>
  </div>
</template>
