<!-- src/components/webhooks/WebhookDialog.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Webhook {
  id?: string;
  name: string;
  url: string;
  method: string;
  status: 'active' | 'inactive';
  headers?: Record<string, string>;
  body?: string;
}

interface Props {
  open: boolean;
  webhook?: Webhook;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:open', 'submit']);

const form = ref<Webhook>({
  name: '',
  url: '',
  method: 'POST',
  status: 'active',
  headers: {},
  body: ''
});

const headersText = ref('');

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    if (props.webhook) {
      form.value = { ...props.webhook };
      headersText.value = JSON.stringify(props.webhook.headers || {}, null, 2);
    } else {
      form.value = {
        name: '',
        url: '',
        method: 'POST',
        status: 'active',
        headers: {},
        body: ''
      };
      headersText.value = '{}';
    }
  }
});

const handleSubmit = () => {
  try {
    const headers = JSON.parse(headersText.value || '{}');
    emit('submit', { ...form.value, headers });
    emit('update:open', false);
  } catch (error) {
    alert('Invalid JSON in headers');
  }
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>
          {{ webhook ? 'Edit Webhook' : 'Create Webhook' }}
        </DialogTitle>
        <DialogDescription>
          Configure your webhook endpoint and settings
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <!-- Name -->
        <div class="grid gap-2">
          <Label for="name">Name</Label>
          <Input
              id="name"
              v-model="form.name"
              placeholder="My Webhook"
          />
        </div>

        <!-- URL -->
        <div class="grid gap-2">
          <Label for="url">URL</Label>
          <Input
              id="url"
              v-model="form.url"
              type="url"
              placeholder="https://api.example.com/webhook"
          />
        </div>

        <!-- Method -->
        <div class="grid gap-2">
          <Label for="method">Method</Label>
          <Select v-model="form.method">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Headers -->
        <div class="grid gap-2">
          <Label for="headers">Headers (JSON)</Label>
          <Textarea
              id="headers"
              v-model="headersText"
              placeholder='{"Authorization": "Bearer token"}'
              class="font-mono text-sm"
              rows="4"
          />
        </div>

        <!-- Body -->
        <div class="grid gap-2">
          <Label for="body">Body Template</Label>
          <Textarea
              id="body"
              v-model="form.body"
              placeholder='{"event": "{{event}}", "data": {{data}}}'
              class="font-mono text-sm"
              rows="4"
          />
        </div>

        <!-- Status -->
        <div class="flex items-center justify-between">
          <Label for="status">Active</Label>
          <Switch
              id="status"
              :checked="form.status === 'active'"
              @update:checked="form.status = $event ? 'active' : 'inactive'"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Cancel
        </Button>
        <Button @click="handleSubmit">
          {{ webhook ? 'Update' : 'Create' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
