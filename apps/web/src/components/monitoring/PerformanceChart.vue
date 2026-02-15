<!-- src/components/monitoring/PerformanceChart.vue -->
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useColorMode } from '@vueuse/core';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'vue-chartjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Activity, LineChart as LineChartIcon } from 'lucide-vue-next';
import type { PerformanceData } from '@/composables/useMonitoring';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface Props {
  data: PerformanceData[];
}

const props = defineProps<Props>();
const mode = useColorMode();

const hasData = computed(() => props.data.length > 0);

// Fonction pour obtenir les couleurs CSS
const getCSSVariable = (variable: string): string => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
};

// Couleurs adaptatives
const colors = computed(() => {
  const isDark = mode.value === 'dark';

  return {
    grid: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
    text: isDark ? 'rgba(226, 232, 240, 0.7)' : 'rgba(51, 65, 85, 0.7)',
    cpu: {
      line: 'rgb(59, 130, 246)',
      bg: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
    },
    memory: {
      line: 'rgb(34, 197, 94)',
      bg: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)',
    },
  };
});

const chartData = computed(() => ({
  labels: props.data.map(d =>
      d.timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
  ),
  datasets: [
    {
      label: 'CPU Usage',
      data: props.data.map(d => Math.round(d.cpu * 10) / 10),
      borderColor: colors.value.cpu.line,
      backgroundColor: colors.value.cpu.bg,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: colors.value.cpu.line,
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
    },
    {
      label: 'Memory Usage',
      data: props.data.map(d => Math.round(d.memory * 10) / 10),
      borderColor: colors.value.memory.line,
      backgroundColor: colors.value.memory.bg,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: colors.value.memory.line,
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
    },
  ],
}));

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false, // On affiche notre propre légende
    },
    tooltip: {
      enabled: true,
      backgroundColor: mode.value === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      titleColor: colors.value.text,
      bodyColor: colors.value.text,
      borderColor: colors.value.grid,
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      callbacks: {
        label: (context) => {
          return `${context.dataset.label}: ${context.parsed.y}%`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: colors.value.grid,
        drawTicks: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: colors.value.text,
        font: {
          size: 11,
        },
        maxRotation: 0,
        autoSkipPadding: 20,
      },
    },
    y: {
      min: 0,
      max: 100,
      grid: {
        color: colors.value.grid,
        drawTicks: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: colors.value.text,
        font: {
          size: 11,
        },
        callback: (value) => `${value}%`,
      },
    },
  },
}));

const avgCpu = computed(() => {
  if (!hasData.value) return 0;
  return Math.round(
      props.data.reduce((acc, d) => acc + d.cpu, 0) / props.data.length
  );
});

const avgMemory = computed(() => {
  if (!hasData.value) return 0;
  return Math.round(
      props.data.reduce((acc, d) => acc + d.memory, 0) / props.data.length
  );
});
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle>Performance History</CardTitle>
          <CardDescription>Last 20 minutes</CardDescription>
        </div>
        <Activity class="h-4 w-4 text-muted-foreground" />
      </div>
    </CardHeader>
    <CardContent>
      <!-- Empty state -->
      <div
          v-if="!hasData"
          class="flex items-center justify-center h-[300px] text-muted-foreground"
      >
        <div class="text-center">
          <LineChartIcon class="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p class="text-sm">No performance data available</p>
          <p class="text-xs text-muted-foreground/60 mt-1">
            Data will appear once monitoring starts
          </p>
        </div>
      </div>

      <!-- Chart -->
      <div v-else class="space-y-4">
        <!-- Legend personnalisée -->
        <div class="flex items-center gap-4 text-sm">
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-blue-500" />
            <span class="text-foreground/70">CPU Usage</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-green-500" />
            <span class="text-foreground/70">Memory Usage</span>
          </div>
        </div>

        <!-- Chart.js -->
        <div class="h-[300px]">
          <Line :data="chartData" :options="chartOptions" />
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 gap-4 pt-4 border-t">
          <div class="text-center">
            <p class="text-xs text-muted-foreground">Avg CPU</p>
            <p class="text-2xl font-semibold text-blue-500">
              {{ avgCpu }}%
            </p>
          </div>
          <div class="text-center">
            <p class="text-xs text-muted-foreground">Avg Memory</p>
            <p class="text-2xl font-semibold text-green-500">
              {{ avgMemory }}%
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
