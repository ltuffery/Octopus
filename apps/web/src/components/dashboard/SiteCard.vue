<!-- src/components/dashboard/SiteCard.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Site, SiteSource } from '@/composables/useSites';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Play,
  Square,
  RotateCw,
  Trash2,
  Settings,
  MoreVertical,
  Github,
  Gitlab,
  Folder,
  Cpu,
  MemoryStick,
  HardDrive,
  Clock,
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-vue-next';
import { format } from 'date-fns';

interface Props {
  site: Site;
}

interface Emits {
  (e: 'start', id: string): void;
  (e: 'stop', id: string): void;
  (e: 'restart', id: string): void;
  (e: 'rebuild', id: string): void;
  (e: 'delete', id: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const router = useRouter();

const getStatusColor = (status: string) => {
  switch (status) {
    case 'running':
      return 'default';
    case 'stopped':
      return 'secondary';
    case 'building':
    case 'starting':
    case 'stopping':
      return 'outline';
    case 'error':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running':
      return CheckCircle;
    case 'stopped':
      return Square;
    case 'building':
    case 'starting':
    case 'stopping':
      return Loader2;
    case 'error':
      return AlertCircle;
    default:
      return AlertCircle;
  }
};

const getSourceIcon = (source: SiteSource) => {
  switch (source) {
    case 'github':
      return Github;
    case 'gitlab':
      return Gitlab;
    case 'local':
      return Folder;
  }
};
</script>

<template>
  <Card class="hover:shadow-lg transition-shadow">
    <CardHeader>
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <CardTitle class="text-lg">{{ site.name }}</CardTitle>
            <Badge :variant="getStatusColor(site.status)">
              <component
                  :is="getStatusIcon(site.status)"
                  class="h-3 w-3 mr-1"
                  :class="{ 'animate-spin': site.status === 'building' || site.status === 'starting' || site.status === 'stopping' }"
              />
              {{ site.status }}
            </Badge>
          </div>
          <CardDescription class="mt-1">
            {{ site.domain }}
          </CardDescription>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                v-if="site.status !== 'running'"
                @click="emit('start', site.id)"
            >
              <Play class="h-4 w-4 mr-2" />
              Start
            </DropdownMenuItem>
            <DropdownMenuItem
                v-if="site.status === 'running'"
                @click="emit('stop', site.id)"
            >
              <Square class="h-4 w-4 mr-2" />
              Stop
            </DropdownMenuItem>
            <DropdownMenuItem @click="emit('restart', site.id)">
              <RotateCw class="h-4 w-4 mr-2" />
              Restart
            </DropdownMenuItem>
            <DropdownMenuItem @click="emit('rebuild', site.id)">
              <Settings class="h-4 w-4 mr-2" />
              Rebuild
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                class="text-destructive"
                @click="emit('delete', site.id)"
            >
              <Trash2 class="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Info -->
      <div class="flex items-center gap-4 text-sm text-muted-foreground">
        <div class="flex items-center gap-1">
          <component :is="getSourceIcon(site.source)" class="h-4 w-4" />
          <span>{{ site.source }}</span>
        </div>
        <div>{{ site.framework }}</div>
        <div v-if="site.lastDeploy" class="flex items-center gap-1">
          <Clock class="h-4 w-4" />
          {{ format(site.lastDeploy, 'MMM dd') }}
        </div>
      </div>

      <Separator />

      <!-- Resources -->
      <div class="grid grid-cols-3 gap-2 text-sm">
        <div class="space-y-1">
          <div class="flex items-center gap-1 text-muted-foreground">
            <Cpu class="h-3 w-3" />
            <span class="text-xs">CPU</span>
          </div>
          <div class="font-semibold">{{ Math.round(site.cpu) }}%</div>
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-1 text-muted-foreground">
            <MemoryStick class="h-3 w-3" />
            <span class="text-xs">Memory</span>
          </div>
          <div class="font-semibold">{{ Math.round(site.memory) }}%</div>
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-1 text-muted-foreground">
            <HardDrive class="h-3 w-3" />
            <span class="text-xs">Disk</span>
          </div>
          <div class="font-semibold">{{ Math.round(site.disk) }}%</div>
        </div>
      </div>

      <Separator />

      <!-- Docker Resources -->
      <div class="space-y-2 text-sm">
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">Containers</span>
          <Badge variant="outline">{{ site.containers.length }}</Badge>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">Volumes</span>
          <Badge variant="outline">{{ site.volumes.length }}</Badge>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">Databases</span>
          <Badge variant="outline">{{ site.databases.length }}</Badge>
        </div>
      </div>

      <Separator />

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <Button
            variant="outline"
            size="sm"
            class="flex-1"
            as-child
        >
          <a :href="site.url" target="_blank">
            <Globe class="h-4 w-4 mr-2" />
            Visit
          </a>
        </Button>
        <Button
            variant="outline"
            size="sm"
            class="flex-1"
            @click="router.push(`/sites/${site.id}`)"
        >
          <Settings class="h-4 w-4 mr-2" />
          Manage
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
