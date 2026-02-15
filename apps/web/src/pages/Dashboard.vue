<!-- src/pages/Dashboard.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useSites } from '@/composables/useSites';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-vue-next';

// Components
import StatsCards from '@/components/dashboard/StatsCards.vue';
import CreateSiteDialog from '@/components/dashboard/CreateSiteDialog.vue';
import SitesTable from '@/components/dashboard/SitesTable.vue';
import EmptyState from '@/components/dashboard/EmptyState.vue';

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

const createDialogRef = ref();

onMounted(() => {
  fetchSites();
});

const openCreateDialog = () => {
  createDialogRef.value?.open();
};

const handleCreateSite = async (payload: any) => {
  await createSite(payload);
  createDialogRef.value?.close();
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

      <!-- Create Dialog -->
      <CreateSiteDialog
          ref="createDialogRef"
          :is-creating="isCreating"
          @create="handleCreateSite"
      />
    </div>

    <!-- Stats Cards -->
    <StatsCards :stats="stats" />

    <!-- Sites Table -->
    <div v-if="!isLoading && sites.length > 0">
      <SitesTable
          :sites="sites"
          @start="startSite"
          @stop="stopSite"
          @restart="restartSite"
          @rebuild="rebuildSite"
          @delete="deleteSite"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
    </div>

    <!-- Empty State -->
    <EmptyState
        v-if="!isLoading && sites.length === 0"
        @create="openCreateDialog"
    />
  </div>
</template>
