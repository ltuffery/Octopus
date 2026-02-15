<!-- src/pages/index.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSites } from '@/composables/useSites';
import type { CreateSitePayload } from '@/composables/useSites';
import StatsCards from '@/components/dashboard/StatsCards.vue';
import CreateSiteDialog from '@/components/dashboard/CreateSiteDialog.vue';
import SiteCard from '@/components/dashboard/SiteCard.vue';
import EmptyState from '@/components/dashboard/EmptyState.vue';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-vue-next';

const {
  sites,
  isLoading,
  isCreating,
  stats,
  fetchSites,
  createSite,
  startSite,
  stopSite,
  restartSite,
  deleteSite,
  rebuildSite,
} = useSites();

const createDialogRef = ref<InstanceType<typeof CreateSiteDialog>>();

onMounted(() => {
  fetchSites();
});

const handleCreateSite = async (payload: CreateSitePayload) => {
  try {
    await createSite(payload);
  } catch (error) {
    console.error('Failed to create site:', error);
  }
};

const openCreateDialog = () => {
  // Trigger dialog programmatically if needed
};
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <p class="text-muted-foreground mt-1">
          Manage your sites and infrastructure
        </p>
      </div>

      <CreateSiteDialog
          ref="createDialogRef"
          :is-creating="isCreating"
          @create="handleCreateSite"
      />
    </div>

    <!-- Stats Cards -->
    <StatsCards :stats="stats" />

    <!-- Sites Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <SiteCard
          v-for="site in sites"
          :key="site.id"
          :site="site"
          @start="startSite"
          @stop="stopSite"
          @restart="restartSite"
          @rebuild="rebuildSite"
          @delete="deleteSite"
      />

      <!-- Loading State -->
      <Card v-if="isLoading" class="opacity-50">
        <CardHeader>
          <div class="flex items-center gap-2">
            <Loader2 class="h-4 w-4 animate-spin" />
            <CardTitle>Loading...</CardTitle>
          </div>
        </CardHeader>
      </Card>
    </div>

    <!-- Empty State -->
    <EmptyState
        v-if="!isLoading && sites.length === 0"
        @create="openCreateDialog"
    />
  </div>
</template>
