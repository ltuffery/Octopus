<!-- src/components/layout/AppSidebar.vue -->
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import {
  LayoutDashboard,
  Webhook,
  Clock,
  Activity,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Props {
  collapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
});

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>();

const route = useRoute();
const router = useRouter();

const navigationItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
    badge: null
  },
  {
    label: 'Webhooks',
    icon: Webhook,
    path: '/webhooks',
    badge: null
  },
  {
    label: 'Cron Jobs',
    icon: Clock,
    path: '/crons',
    badge: 3
  },
  {
    label: 'Monitoring',
    icon: Activity,
    path: '/monitoring',
    badge: null
  },
  {
    label: 'Logs',
    icon: FileText,
    path: '/logs',
    badge: null
  }
];

const settingsItems = [
  {
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    badge: null
  }
];

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};

const toggleCollapse = () => {
  emit('update:collapsed', !props.collapsed);
};

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<template>
  <aside
      :class="cn(
      'flex flex-col bg-card transition-all duration-300 ease-in-out',
      collapsed ? 'w-16' : 'w-64'
    )"
  >
    <!-- Logo -->
    <div class="flex h-16 shrink-0 items-center justify-between border-b px-4">
      <transition
          enter-active-class="transition-all duration-300"
          leave-active-class="transition-all duration-300"
          enter-from-class="opacity-0 w-0"
          leave-to-class="opacity-0 w-0"
      >
        <div
            v-show="!collapsed"
            class="flex items-center gap-2"
        >
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span class="text-lg font-bold">🐙</span>
          </div>
          <span class="whitespace-nowrap text-xl font-bold">Octopus</span>
        </div>
      </transition>

      <Button
          variant="ghost"
          size="icon"
          @click="toggleCollapse"
          class="h-8 w-8 shrink-0"
      >
        <ChevronLeft v-if="!collapsed" :size="16" />
        <ChevronRight v-else :size="16" />
      </Button>
    </div>

    <!-- Navigation -->
    <ScrollArea class="flex-1 px-3 py-4">
      <TooltipProvider :delay-duration="0">
        <nav class="space-y-1">
          <!-- Main Navigation -->
          <div class="space-y-1">
            <Tooltip
                v-for="item in navigationItems"
                :key="item.path"
                :disabled="!collapsed"
            >
              <TooltipTrigger as-child>
                <button
                    @click="navigateTo(item.path)"
                    :class="cn(
                    'flex w-full items-center gap-3 rounded-lg my-2 px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )"
                >
                  <component
                      :is="item.icon"
                      :size="20"
                      class="shrink-0"
                  />

                  <transition
                      enter-active-class="transition-all duration-300"
                      leave-active-class="transition-all duration-300"
                      enter-from-class="opacity-0 w-0"
                      leave-to-class="opacity-0 w-0"
                  >
                    <span
                        v-show="!collapsed"
                        class="flex-1 whitespace-nowrap text-left"
                    >
                      {{ item.label }}
                    </span>
                  </transition>

                  <transition
                      enter-active-class="transition-all duration-300"
                      leave-active-class="transition-all duration-300"
                      enter-from-class="opacity-0 scale-0"
                      leave-to-class="opacity-0 scale-0"
                  >
                    <span
                        v-if="item.badge && !collapsed"
                        class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary"
                    >
                      {{ item.badge }}
                    </span>
                  </transition>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>{{ item.label }}</span>
                <span v-if="item.badge" class="ml-2 text-xs text-muted-foreground">
                  ({{ item.badge }})
                </span>
              </TooltipContent>
            </Tooltip>
          </div>

          <!-- Divider -->
          <div class="my-4 border-t" />

          <!-- Settings -->
          <div class="space-y-1">
            <Tooltip
                v-for="item in settingsItems"
                :key="item.path"
                :disabled="!collapsed"
            >
              <TooltipTrigger as-child>
                <button
                    @click="navigateTo(item.path)"
                    :class="cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )"
                >
                  <component
                      :is="item.icon"
                      :size="20"
                      class="shrink-0"
                  />

                  <transition
                      enter-active-class="transition-all duration-300"
                      leave-active-class="transition-all duration-300"
                      enter-from-class="opacity-0 w-0"
                      leave-to-class="opacity-0 w-0"
                  >
                    <span
                        v-show="!collapsed"
                        class="flex-1 whitespace-nowrap text-left"
                    >
                      {{ item.label }}
                    </span>
                  </transition>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {{ item.label }}
              </TooltipContent>
            </Tooltip>
          </div>
        </nav>
      </TooltipProvider>
    </ScrollArea>
  </aside>
</template>
