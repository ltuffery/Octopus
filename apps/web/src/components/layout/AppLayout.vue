<!-- src/components/layout/AppLayout.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import AppSidebar from './AppSidebar.vue';
import AppHeader from './AppHeader.vue';

const isSidebarCollapsed = ref(false);

const handleSidebarToggle = (value: boolean) => {
  isSidebarCollapsed.value = value;
  console.log('Sidebar collapsed:', value); // Debug
};
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <!-- Sidebar -->
    <AppSidebar
        :collapsed="isSidebarCollapsed"
        @update:collapsed="handleSidebarToggle"
        class="border-r"
    />

    <!-- Main Content -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Header -->
      <AppHeader :sidebar-collapsed="isSidebarCollapsed" />

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto">
        <div class="container mx-auto p-6">
          <router-view v-slot="{ Component }">
            <transition
                name="fade"
                mode="out-in"
            >
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
