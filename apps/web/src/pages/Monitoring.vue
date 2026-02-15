<!-- src/pages/Monitoring.vue -->
<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { RefreshCw, Play, Pause } from 'lucide-vue-next';
import MetricsOverview from '@/components/monitoring/MetricsOverview.vue';
import ServiceStatus from '@/components/monitoring/ServiceStatus.vue';
import AlertsPanel from '@/components/monitoring/AlertsPanel.vue';
import PerformanceChart from '@/components/monitoring/PerformanceChart.vue';
import { useMonitoring } from '@/composables/useMonitoring';

const {
  metrics,
  services,
  alerts,
  performanceHistory,
  loading,
  realtime,
  fetchMetrics,
  fetchServices,
  fetchAlerts,
  fetchPerformanceHistory,
  restartService,
  stopService,
  startService,
  acknowledgeAlert,
  deleteAlert,
  toggleRealtime
} = useMonitoring();

let refreshInterval: number | undefined;

const startRefresh = () => {
  // refreshInterval = window.setInterval(() => {
  //   if (realtime.value) {
  //     fetchMetrics();
  //     fetchServices();
  //     fetchAlerts();
  //     fetchPerformanceHistory();
  //   }
  // }, 5000);
};

const stopRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = undefined;
  }
};

const handleRefresh = async () => {
  await Promise.all([
    fetchMetrics(),
    fetchServices(),
    fetchAlerts(),
    fetchPerformanceHistory()
  ]);
};

watch(realtime, (value) => {
  if (value) {
    startRefresh();
  } else {
    stopRefresh();
  }
});

onMounted(async () => {
  await handleRefresh();
  if (realtime.value) {
    startRefresh();
  }
});

onUnmounted(() => {
  stopRefresh();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Monitoring</h1>
        <p class="text-muted-foreground">
          Real-time system monitoring and alerts
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button
            variant="outline"
            @click="toggleRealtime"
            :class="realtime ? 'bg-green-500/10 hover:bg-green-500/20' : ''"
        >
          <component :is="realtime ? Pause : Play" class="mr-2 h-4 w-4" />
          {{ realtime ? 'Realtime On' : 'Realtime Off' }}
        </Button>
        <Button variant="outline" @click="handleRefresh" :disabled="loading">
          <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': loading }" />
          Refresh
        </Button>
      </div>
    </div>

    <!-- Metrics Overview -->
    <MetricsOverview :metrics="metrics" />

    <!-- Performance Chart -->
    <PerformanceChart :data="performanceHistory" />

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Services Status -->
      <ServiceStatus
          :services="services"
          :loading="loading"
          @restart="restartService"
          @stop="stopService"
          @start="startService"
      />

      <!-- Alerts Panel -->
      <AlertsPanel
          :alerts="alerts"
          @acknowledge="acknowledgeAlert"
          @delete="deleteAlert"
      />
    </div>
  </div>
</template>
