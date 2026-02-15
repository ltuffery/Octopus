<!-- src/components/webhooks/WebhookExecuteDialog.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

interface Webhook {
  id: string;
  name: string;
  url: string;
  method: string;
}

interface Props {
  open: boolean;
  webhook: Webhook;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:open']);

const payload = ref('{\n  "test": true\n}');
const executing = ref(false);
const result = ref<{ success: boolean; data: any; status?: number } | null>(null);

const execute = async () => {
  executing.value = true;
  result.value = null;

  try {
    // Simuler l'exécution (remplacer par vraie API)
    await new Promise(resolve => setTimeout(resolve, 1500));

    result.value = {
      success: true,
      status: 200,
      data: { message: 'Webhook executed successfully' }
    };

    toast({
      title: 'Success',
      description: 'Webhook executed successfully',
    });
  } catch (error) {
    result.value = {
      success: false,
      data: { error: 'Failed to execute webhook' }
    };

    toast({
      title: 'Error',
      description: 'Failed to execute webhook',
      variant: 'destructive',
    });
  } finally {
    executing.value = false;
  }
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Execute Webhook</DialogTitle>
        <DialogDescription>
          Test your webhook with custom payload
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <!-- Webhook Info -->
        <Alert>
          <AlertDescription>
            <div class="font-mono text-sm">
              <div><strong>{{ webhook.method }}</strong> {{ webhook.url }}</div>
            </div>
          </AlertDescription>
        </Alert>

        <!-- Payload -->
        <div class="grid gap-2">
          <Label for="payload">Payload (JSON)</Label>
          <Textarea
              id="payload"
              v-model="payload"
              class="font-mono text-sm"
              rows="8"
              :disabled="executing"
          />
        </div>

        <!-- Result -->
        <Alert v-if="result" :variant="result.success ? 'default' : 'destructive'">
          <CheckCircle2 v-if="result.success" class="h-4 w-4" />
          <XCircle v-else class="h-4 w-4" />
          <AlertDescription>
            <div class="font-mono text-sm whitespace-pre-wrap">
              {{ JSON.stringify(result.data, null, 2) }}
            </div>
          </AlertDescription>
        </Alert>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)" :disabled="executing">
          Close
        </Button>
        <Button @click="execute" :disabled="executing">
          <Loader2 v-if="executing" class="mr-2 h-4 w-4 animate-spin" />
          Execute
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
