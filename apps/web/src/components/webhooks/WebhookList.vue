<!-- src/components/webhooks/WebhookList.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import WebhookCard from './WebhookCard.vue';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-vue-next';

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
  webhooks: Webhook[];
  loading: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update', 'delete']);
</script>

<template>
  <div class="space-y-4">
    <!-- Loading -->
    <template v-if="loading">
      <Skeleton v-for="i in 3" :key="i" class="h-32" />
    </template>

    <!-- Empty State -->
    <Alert v-else-if="webhooks.length === 0">
      <AlertCircle class="h-4 w-4" />
      <AlertDescription>
        No webhooks found. Create your first webhook to get started.
      </AlertDescription>
    </Alert>

    <!-- Webhooks -->
    <template v-else>
      <WebhookCard
          v-for="webhook in webhooks"
          :key="webhook.id"
          :webhook="webhook"
          @update="emit('update', $event)"
          @delete="emit('delete', $event)"
      />
    </template>
  </div>
</template>
