<!-- src/components/dashboard/SitesTable.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Play,
  Square,
  RotateCw,
  Wrench,
  Trash2,
  MoreVertical,
  ExternalLink,
  Github,
  Gitlab,
  FolderOpen,
  Eye,
  Circle,
} from 'lucide-vue-next';
import type { Site } from '@/composables/useSites';

interface Props {
  sites: Site[];
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

const getStatusVariant = (status: Site['status']) => {
  const variants: Record<Site['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
    running: 'default',
    stopped: 'secondary',
    building: 'outline',
    pending: 'outline',
    error: 'destructive',
  };
  return variants[status];
};

const getStatusColor = (status: Site['status']) => {
  const colors = {
    running: 'text-green-500',
    stopped: 'text-gray-500',
    building: 'text-blue-500',
    pending: 'text-yellow-500',
    error: 'text-red-500',
  };
  return colors[status];
};

const getSourceIcon = (source: Site['source']) => {
  const icons = {
    github: Github,
    gitlab: Gitlab,
    local: FolderOpen,
  };
  return icons[source];
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

const viewSite = (site: Site) => {
  router.push(`/sites/${site.id}`);
};

const openSite = (domain: string, port: number) => {
  const url = port === 80 || port === 443
      ? `https://${domain}`
      : `http://${domain}:${port}`;
  window.open(url, '_blank');
};
</script>

<template>
  <div class="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[250px]">Name</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Framework</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
            v-for="site in sites"
            :key="site.id"
            class="cursor-pointer"
            @click="viewSite(site)"
        >
          <!-- Name -->
          <TableCell class="font-medium">
            <div class="flex flex-col gap-1">
              <span class="font-semibold">{{ site.name }}</span>
              <span class="text-xs text-muted-foreground font-mono">
                {{ site.id.slice(0, 8) }}...
              </span>
            </div>
          </TableCell>

          <!-- Source -->
          <TableCell>
            <div class="flex items-center gap-2">
              <component
                  :is="getSourceIcon(site.source)"
                  class="h-4 w-4 text-muted-foreground"
              />
              <div class="flex flex-col">
                <span class="text-sm capitalize">{{ site.source }}</span>
                <span v-if="site.branch" class="text-xs text-muted-foreground">
                  {{ site.branch }}
                </span>
              </div>
            </div>
          </TableCell>

          <!-- Framework -->
          <TableCell>
            <Badge variant="outline" class="capitalize">
              {{ site.framework }}
            </Badge>
          </TableCell>

          <!-- Domain -->
          <TableCell>
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">{{ site.domain }}</span>
                <Button
                    size="icon"
                    variant="ghost"
                    class="h-6 w-6"
                    @click.stop="openSite(site.domain, site.port)"
                >
                  <ExternalLink class="h-3 w-3" />
                </Button>
              </div>
              <span class="text-xs text-muted-foreground">
                Port {{ site.port }}
              </span>
            </div>
          </TableCell>

          <!-- Status -->
          <TableCell>
            <div class="flex items-center gap-2">
              <Circle
                  class="h-2 w-2 fill-current"
                  :class="[getStatusColor(site.status), { 'animate-pulse': site.status === 'building' || site.status === 'pending' }]"
              />
              <Badge :variant="getStatusVariant(site.status)" class="capitalize">
                {{ site.status }}
              </Badge>
            </div>
          </TableCell>

          <!-- Updated -->
          <TableCell class="text-sm text-muted-foreground">
            <div class="flex flex-col gap-1">
              <span>{{ formatDate(site.updatedAt) }}</span>
            </div>
          </TableCell>

          <!-- Actions -->
          <TableCell class="text-right" @click.stop>
            <div class="flex items-center justify-end gap-2">
              <!-- Quick Actions -->
              <Button
                  v-if="site.status === 'stopped'"
                  size="icon"
                  variant="ghost"
                  @click="emit('start', site.id)"
                  title="Start"
              >
                <Play class="h-4 w-4" />
              </Button>

              <Button
                  v-if="site.status === 'running'"
                  size="icon"
                  variant="ghost"
                  @click="emit('stop', site.id)"
                  title="Stop"
              >
                <Square class="h-4 w-4" />
              </Button>

              <Button
                  v-if="site.status === 'running'"
                  size="icon"
                  variant="ghost"
                  @click="emit('restart', site.id)"
                  title="Restart"
              >
                <RotateCw class="h-4 w-4" />
              </Button>

              <!-- More Actions -->
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button size="icon" variant="ghost">
                    <MoreVertical class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-48">
                  <DropdownMenuItem @click="viewSite(site)">
                    <Eye class="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>

                  <DropdownMenuItem @click="openSite(site.domain, site.port)">
                    <ExternalLink class="h-4 w-4 mr-2" />
                    Open Site
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                      v-if="site.status === 'stopped'"
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
                    <Wrench class="h-4 w-4 mr-2" />
                    Rebuild
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                      @click="emit('delete', site.id)"
                      class="text-destructive focus:text-destructive"
                  >
                    <Trash2 class="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
