<!-- src/components/crons/CronDialog.vue -->
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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Loader2 } from 'lucide-vue-next';
import type { CronJob } from '@/composables/useCrons';

interface Props {
  open: boolean;
  cron?: CronJob | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:open': [value: boolean];
  submit: [data: Partial<CronJob>];
}>();

const submitting = ref(false);
const formData = ref({
  name: '',
  description: '',
  schedule: '',
  command: '',
  enabled: true,
  tags: [] as string[]
});
const tagInput = ref('');

// Preset schedules
const presets = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every 6 hours', value: '0 */6 * * *' },
  { label: 'Daily at midnight', value: '0 0 * * *' },
  { label: 'Daily at 2:00 AM', value: '0 2 * * *' },
  { label: 'Weekly on Monday', value: '0 9 * * 1' },
  { label: 'Monthly on 1st', value: '0 0 1 * *' }
];

const reset = () => {
  formData.value = {
    name: '',
    description: '',
    schedule: '',
    command: '',
    enabled: true,
    tags: []
  };
  tagInput.value = '';
};

watch(() => props.cron, (cron) => {
  if (cron) {
    formData.value = {
      name: cron.name,
      description: cron.description,
      schedule: cron.schedule,
      command: cron.command,
      enabled: cron.enabled,
      tags: [...cron.tags]
    };
  } else {
    reset();
  }
}, { immediate: true });

const addTag = () => {
  const tag = tagInput.value.trim();
  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag);
    tagInput.value = '';
  }
};

const removeTag = (tag: string) => {
  formData.value.tags = formData.value.tags.filter(t => t !== tag);
};

const setSchedule = (schedule: string) => {
  formData.value.schedule = schedule;
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    await emit('submit', formData.value);
    emit('update:open', false);
    reset();
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {{ cron ? 'Edit Cron Job' : 'Create Cron Job' }}
        </DialogTitle>
        <DialogDescription>
          {{ cron ? 'Update cron job settings' : 'Schedule a new automated task' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Name -->
        <div class="space-y-2">
          <Label for="name">Name *</Label>
          <Input
              id="name"
              v-model="formData.name"
              placeholder="Database Backup"
              required
          />
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea
              id="description"
              v-model="formData.description"
              placeholder="Daily backup of production database"
              rows="2"
          />
        </div>

        <!-- Schedule -->
        <div class="space-y-2">
          <Label for="schedule">Schedule (Cron Expression) *</Label>
          <Input
              id="schedule"
              v-model="formData.schedule"
              placeholder="0 2 * * *"
              required
          />
          <div class="flex flex-wrap gap-2 mt-2">
            <Button
                v-for="preset in presets"
                :key="preset.value"
                type="button"
                variant="outline"
                size="sm"
                @click="setSchedule(preset.value)"
            >
              {{ preset.label }}
            </Button>
          </div>
          <p class="text-xs text-muted-foreground">
            Format: minute hour day month weekday
          </p>
        </div>

        <!-- Command -->
        <div class="space-y-2">
          <Label for="command">Command *</Label>
          <Textarea
              id="command"
              v-model="formData.command"
              placeholder="/scripts/backup-db.sh"
              rows="3"
              required
              class="font-mono text-sm"
          />
        </div>

        <!-- Tags -->
        <div class="space-y-2">
          <Label for="tags">Tags</Label>
          <div class="flex gap-2">
            <Input
                id="tags"
                v-model="tagInput"
                placeholder="Add tag..."
                @keydown.enter.prevent="addTag"
            />
            <Button type="button" variant="outline" @click="addTag">
              Add
            </Button>
          </div>
          <div v-if="formData.tags.length" class="flex flex-wrap gap-2 mt-2">
            <Badge
                v-for="tag in formData.tags"
                :key="tag"
                variant="secondary"
                class="gap-1"
            >
              {{ tag }}
              <button
                  type="button"
                  @click="removeTag(tag)"
                  class="ml-1 hover:text-destructive"
              >
                <X class="h-3 w-3" />
              </button>
            </Badge>
          </div>
        </div>

        <!-- Enabled -->
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Enabled</Label>
            <p class="text-sm text-muted-foreground">
              Start this cron job immediately
            </p>
          </div>
          <Switch v-model:checked="formData.enabled" />
        </div>

        <DialogFooter>
          <Button
              type="button"
              variant="outline"
              @click="emit('update:open', false)"
              :disabled="submitting"
          >
            Cancel
          </Button>
          <Button type="submit" :disabled="submitting">
            <Loader2 v-if="submitting" class="mr-2 h-4 w-4 animate-spin" />
            {{ cron ? 'Update' : 'Create' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
