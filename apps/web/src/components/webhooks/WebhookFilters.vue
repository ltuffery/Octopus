<!-- src/components/webhooks/WebhookFilters.vue -->
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-vue-next';

interface Filters {
  status: string;
  method: string;
}

interface Props {
  filters: Filters;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:filters', 'close']);

const updateFilter = (key: keyof Filters, value: string) => {
  emit('update:filters', { ...props.filters, [key]: value });
};

const reset = () => {
  emit('update:filters', { status: 'all', method: 'all' });
};
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle>Filters</CardTitle>
        <Button
            variant="ghost"
            size="icon"
            @click="emit('close')"
        >
          <X :size="18" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4 md:grid-cols-3">
        <!-- Status Filter -->
        <div class="grid gap-2">
          <Label>Status</Label>
          <Select
              :model-value="filters.status"
              @update:model-value="updateFilter('status', $event)"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Method Filter -->
        <div class="grid gap-2">
          <Label>Method</Label>
          <Select
              :model-value="filters.method"
              @update:model-value="updateFilter('method', $event)"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Reset -->
        <div class="flex items-end">
          <Button variant="outline" class="w-full" @click="reset">
            Reset Filters
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
