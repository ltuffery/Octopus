<!-- src/components/layout/AppHeader.vue -->
<script setup lang="ts">
import {computed, ref} from 'vue';
import { useRoute } from 'vue-router';
import { Search, Bell, Moon, Sun } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {useColorMode} from "@vueuse/core";

interface Props {
  sidebarCollapsed?: boolean;
}

defineProps<Props>();

const mode = useColorMode()
const route = useRoute();
const isDarkMode = ref(true);
const notificationCount = ref(3);

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;

  if (isDarkMode.value) {
    mode.store.value = 'dark'
  } else {
    mode.store.value = 'light'
  }
};

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/webhooks': 'Webhooks',
    '/crons': 'Cron Jobs',
    '/monitoring': 'Monitoring',
    '/logs': 'Logs',
    '/settings': 'Settings'
  };
  return titles[route.path] || 'Octopus';
});
</script>

<template>
  <header class="flex h-16 items-center justify-between border-b bg-card px-6">
    <!-- Page Title -->
    <div>
      <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-4">

      <!-- Theme Toggle -->
      <Button
          variant="ghost"
          size="icon"
          @click="toggleTheme"
      >
        <Sun v-if="isDarkMode" :size="18" />
        <Moon v-else :size="18" />
      </Button>

      <!-- Notifications -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="relative">
            <Bell :size="18" />
            <Badge
                v-if="notificationCount > 0"
                class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0"
                variant="destructive"
            >
              {{ notificationCount }}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-80">
          <div class="flex items-center justify-between px-4 py-2">
            <h3 class="font-semibold">Notifications</h3>
            <Button variant="ghost" size="sm" class="h-auto p-0 text-xs">
              Mark all as read
            </Button>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div class="flex flex-col gap-1">
              <div class="font-medium">Webhook failed</div>
              <div class="text-sm text-muted-foreground">
                "Slack Notification" returned 500 error
              </div>
              <div class="text-xs text-muted-foreground">2 minutes ago</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div class="flex flex-col gap-1">
              <div class="font-medium">Cron job completed</div>
              <div class="text-sm text-muted-foreground">
                "Daily Backup" executed successfully
              </div>
              <div class="text-xs text-muted-foreground">1 hour ago</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div class="flex flex-col gap-1">
              <div class="font-medium">High CPU usage</div>
              <div class="text-sm text-muted-foreground">
                Server load at 85%
              </div>
              <div class="text-xs text-muted-foreground">3 hours ago</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="justify-center">
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
