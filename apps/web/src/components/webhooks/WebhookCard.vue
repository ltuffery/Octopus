<!-- src/components/webhooks/WebhookCard.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { MoreVertical, Play, Edit, Trash2, Copy, ExternalLink } from 'lucide-vue-next';
import WebhookDialog from './WebhookDialog.vue';
import WebhookExecuteDialog from './WebhookExecuteDialog.vue';
import { toast } from 'vue-sonner';

interface Webhook {
  id: string;
  name: string;
  url: string;
  method: string;
  status: 'active' | 'inactive';
  lastExecuted?: string;
  lastStatus?: 'success' | 'failed';
  organizationId: string;
}

interface Props {
  webhook: Webhook;
}

const props = defineProps<Props>();
const emit = defineEmits(['update', 'delete']);

const isEditDialogOpen = ref(false);
const isExecuteDialogOpen = ref(false);

const methodColors: Record<string, string> = {
  GET: 'default',
  POST: 'default',
  PUT: 'secondary',
  DELETE: 'destructive',
  PATCH: 'outline'
};

const statusColors = {
  success: 'default',
  failed: 'destructive'
};

const toggleStatus = () => {
  const newStatus = props.webhook.status === 'active' ? 'inactive' : 'active';
  emit('update', { ...props.webhook, status: newStatus });

  toast({
    title: 'Status updated',
    description: `Webhook is now ${newStatus}`,
  });
};

const copyUrl = () => {
  navigator.clipboard.writeText(props.webhook.url);
  toast({
    title: 'Copied',
    description: 'Webhook URL copied to clipboard',
  });
};

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this webhook?')) {
    emit('delete', props.webhook.id);
    toast({
      title: 'Deleted',
      description: 'Webhook deleted successfully',
    });
  }
};

const formatDate = (date?: string) => {
  if (!date) return 'Never';
  return new Date(date).toLocaleString();
};
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <CardTitle class="text-xl">{{ webhook.name }}</CardTitle>
            <Badge :variant="methodColors[webhook.method]">
              {{ webhook.method }}
            </Badge>
            <Badge
                v-if="webhook.lastStatus"
                :variant="statusColors[webhook.lastStatus]"
            >
              {{ webhook.lastStatus }}
            </Badge>
          </div>
          <CardDescription class="flex items-center gap-2">
            <span class="font-mono text-sm">{{ webhook.url }}</span>
            <Button
                variant="ghost"
                size="icon"
                class="h-6 w-6"
                @click="copyUrl"
            >
              <Copy :size="14" />
            </Button>
          </CardDescription>
        </div>

        <div class="flex items-center gap-2">
          <Switch
              :checked="webhook.status === 'active'"
              @update:checked="toggleStatus"
          />

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon">
                <MoreVertical :size="18" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="isExecuteDialogOpen = true">
                <Play :size="16" class="mr-2" />
                Execute
              </DropdownMenuItem>
              <DropdownMenuItem @click="isEditDialogOpen = true">
                <Edit :size="16" class="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem @click="copyUrl">
                <Copy :size="16" class="mr-2" />
                Copy URL
              </DropdownMenuItem>
              <DropdownMenuItem as="a" :href="webhook.url" target="_blank">
                <ExternalLink :size="16" class="mr-2" />
                Open URL
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleDelete" class="text-destructive">
                <Trash2 :size="16" class="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <div class="text-sm text-muted-foreground">
        Last executed: {{ formatDate(webhook.lastExecuted) }}
      </div>
    </CardContent>

    <!-- Edit Dialog -->
    <WebhookDialog
        v-model:open="isEditDialogOpen"
        :webhook="webhook"
        @submit="emit('update', $event)"
    />

    <!-- Execute Dialog -->
    <WebhookExecuteDialog
        v-model:open="isExecuteDialogOpen"
        :webhook="webhook"
    />
  </Card>
</template>
