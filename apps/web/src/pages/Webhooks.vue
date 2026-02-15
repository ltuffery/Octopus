<!-- src/pages/Webhooks.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Plus, Search, Filter, RefreshCw } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import WebhookList from '@/components/webhooks/WebhookList.vue';
import WebhookDialog from '@/components/webhooks/WebhookDialog.vue';
import WebhookFilters from '@/components/webhooks/WebhookFilters.vue';
import { useWebhooks } from '@/composables/useWebhooks';
import { toast } from 'vue-sonner';

const {
  webhooks,
  loading,
  fetchWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook
} = useWebhooks();

const isCreateDialogOpen = ref(false);
const searchQuery = ref('');
const showFilters = ref(false);
const filters = ref({
  status: 'all',
  method: 'all'
});

// Webhooks filtrés
const filteredWebhooks = computed(() => {
  let result = webhooks.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
        (w) =>
            w.name.toLowerCase().includes(query) ||
            w.url.toLowerCase().includes(query)
    );
  }

  if (filters.value.status !== 'all') {
    result = result.filter((w) => w.status === filters.value.status);
  }

  if (filters.value.method !== 'all') {
    result = result.filter((w) => w.method === filters.value.method);
  }

  return result;
});

// Stats
const stats = computed(() => ({
  total: webhooks.value.length,
  active: webhooks.value.filter((w) => w.status === 'active').length,
  inactive: webhooks.value.filter((w) => w.status === 'inactive').length,
  failed: webhooks.value.filter((w) => w.lastStatus === 'failed').length
}));

const handleCreate = async (data: any) => {
  try {
    await createWebhook(data);
    isCreateDialogOpen.value = false;
    toast({
      title: 'Success',
      description: 'Webhook created successfully',
    });
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to create webhook',
      variant: 'destructive',
    });
  }
};

const handleRefresh = async () => {
  await fetchWebhooks();
  toast({
    title: 'Refreshed',
    description: 'Webhooks list updated',
  });
};

onMounted(() => {
  fetchWebhooks();
});
</script>

<template>
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Webhooks</h1>
        <p class="text-muted-foreground">
          Manage your HTTP webhooks and endpoints
        </p>
      </div>
      <div class="flex gap-2">
        <Button
            variant="outline"
            size="icon"
            @click="handleRefresh"
            :disabled="loading"
        >
          <RefreshCw :size="18" :class="{ 'animate-spin': loading }" />
        </Button>
        <Button @click="isCreateDialogOpen = true">
          <Plus :size="18" class="mr-2" />
          New Webhook
        </Button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Webhooks</CardTitle>
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
          <div class="text-2xl font-bold text-green-600">{{ stats.active }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Inactive</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-slate-600">{{ stats.inactive }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-red-600">{{ stats.failed }}</div>
        </CardContent>
      </Card>
    </div>

    <!-- Search & Filters -->
    <div class="flex gap-4">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" :size="18" />
        <Input
            v-model="searchQuery"
            placeholder="Search webhooks..."
            class="pl-10"
        />
      </div>
      <Button
          variant="outline"
          @click="showFilters = !showFilters"
      >
        <Filter :size="18" class="mr-2" />
        Filters
        <Badge v-if="filters.status !== 'all' || filters.method !== 'all'" class="ml-2" variant="secondary">
          Active
        </Badge>
      </Button>
    </div>

    <!-- Filters Panel -->
    <WebhookFilters
        v-if="showFilters"
        v-model:filters="filters"
        @close="showFilters = false"
    />

    <!-- Webhooks List -->
    <WebhookList
        :webhooks="filteredWebhooks"
        :loading="loading"
        @update="updateWebhook"
        @delete="deleteWebhook"
    />

    <!-- Create Dialog -->
    <WebhookDialog
        v-model:open="isCreateDialogOpen"
        @submit="handleCreate"
    />
  </div>
</template>
