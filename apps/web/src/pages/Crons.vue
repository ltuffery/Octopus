<!-- src/pages/Crons.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Plus, Search, Filter, RefreshCw, Clock } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CronList from '@/components/crons/CronList.vue';
import CronDialog from '@/components/crons/CronDialog.vue';
import CronExecuteDialog from '@/components/crons/CronExecuteDialog.vue';
import { useCrons } from '@/composables/useCrons';
import type { CronJob } from '@/composables/useCrons';

const {
  crons,
  loading,
  executions,
  fetchCrons,
  createCron,
  updateCron,
  deleteCron,
  toggleCron,
  executeCron,
  fetchExecutions
} = useCrons();

const isCreateDialogOpen = ref(false);
const isExecuteDialogOpen = ref(false);
const searchQuery = ref('');
const selectedCron = ref<CronJob | null>(null);
const editingCron = ref<CronJob | null>(null);
const showFilters = ref(false);
const filters = ref({
  status: 'all',
  enabled: 'all'
});

// Crons filtrés
const filteredCrons = computed(() => {
  let result = crons.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
        (c) =>
            c.name.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            c.command.toLowerCase().includes(query) ||
            c.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  if (filters.value.status !== 'all') {
    result = result.filter((c) => c.status === filters.value.status);
  }

  if (filters.value.enabled !== 'all') {
    const enabled = filters.value.enabled === 'enabled';
    result = result.filter((c) => c.enabled === enabled);
  }

  return result;
});

// Stats
const stats = computed(() => ({
  total: crons.value.length,
  active: crons.value.filter((c) => c.enabled && c.status === 'active').length,
  inactive: crons.value.filter((c) => !c.enabled).length,
  running: crons.value.filter((c) => c.status === 'running').length,
  failed: crons.value.filter((c) => c.status === 'failed').length
}));

const handleCreate = () => {
  editingCron.value = null;
  isCreateDialogOpen.value = true;
};

const handleEdit = (cron: CronJob) => {
  editingCron.value = cron;
  isCreateDialogOpen.value = true;
};

const handleSubmit = async (data: Partial<CronJob>) => {
  if (editingCron.value) {
    await updateCron(editingCron.value.id, data);
  } else {
    await createCron(data);
  }
};

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this cron job?')) {
    await deleteCron(id);
  }
};

const handleViewExecutions = async (cron: CronJob) => {
  selectedCron.value = cron;
  await fetchExecutions(cron.id);
  isExecuteDialogOpen.value = true;
};

const handleExecute = async (cronId: string) => {
  await executeCron(cronId);
  if (selectedCron.value?.id === cronId) {
    await fetchExecutions(cronId);
  }
};

onMounted(() => {
  fetchCrons();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Cron Jobs</h1>
        <p class="text-muted-foreground">Manage and monitor your scheduled tasks</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="icon" @click="fetchCrons">
          <RefreshCw class="h-4 w-4" />
        </Button>
        <Button @click="handleCreate">
          <Plus class="mr-2 h-4 w-4" />
          Create Cron Job
        </Button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid gap-4 md:grid-cols-5">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Jobs</CardTitle>
          <Clock class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.total }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-green-500">{{ stats.active }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Inactive</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-500">{{ stats.inactive }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Running</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-blue-500">{{ stats.running }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-red-500">{{ stats.failed }}</div>
        </CardContent>
      </Card>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-col gap-4 sm:flex-row">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
            v-model="searchQuery"
            placeholder="Search cron jobs..."
            class="pl-9"
        />
      </div>
      <Button
          variant="outline"
          @click="showFilters = !showFilters"
      >
        <Filter class="mr-2 h-4 w-4" />
        Filters
        <Badge v-if="filters.status !== 'all' || filters.enabled !== 'all'" variant="secondary" class="ml-2">
          Active
        </Badge>
      </Button>
    </div>

    <!-- Filters Panel -->
    <Card v-if="showFilters">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm font-medium">Status</label>
            <select
                v-model="filters.status"
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="running">Running</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">State</label>
            <select
                v-model="filters.enabled"
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All States</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        <Button
            variant="outline"
            class="w-full"
            @click="filters = { status: 'all', enabled: 'all' }"
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>

    <!-- List -->
    <CronList
        :crons="filteredCrons"
        :loading="loading"
        @edit="handleEdit"
        @delete="handleDelete"
        @toggle="toggleCron"
        @execute="handleExecute"
        @view-executions="handleViewExecutions"
    />

    <!-- Dialogs -->
    <CronDialog
        v-model:open="isCreateDialogOpen"
        :cron="editingCron"
        @submit="handleSubmit"
    />

    <CronExecuteDialog
        v-model:open="isExecuteDialogOpen"
        :cron="selectedCron"
        :executions="executions"
        :loading="loading"
        @execute="handleExecute"
    />
  </div>
</template>
