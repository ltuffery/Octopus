<!-- src/components/settings/GeneralSettings.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-vue-next';

interface Emits {
  (e: 'save'): void;
}

const emit = defineEmits<Emits>();

const settings = ref({
  platformName: 'DevOps Dashboard',
  platformUrl: 'https://devops.example.com',
  adminEmail: 'admin@example.com',
  timezone: 'UTC',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  autoUpdate: true,
  telemetry: false,
});

const timezones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
];

const dateFormats = [
  'MM/DD/YYYY',
  'DD/MM/YYYY',
  'YYYY-MM-DD',
];
</script>

<template>
  <div class="space-y-6">
    <!-- Platform Information -->
    <Card>
      <CardHeader>
        <CardTitle>Platform Information</CardTitle>
        <CardDescription>
          Basic information about your DevOps platform
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="platform-name">Platform Name</Label>
          <Input
              id="platform-name"
              v-model="settings.platformName"
              placeholder="Enter platform name"
          />
        </div>

        <div class="space-y-2">
          <Label for="platform-url">Platform URL</Label>
          <Input
              id="platform-url"
              v-model="settings.platformUrl"
              type="url"
              placeholder="https://example.com"
          />
        </div>

        <div class="space-y-2">
          <Label for="admin-email">Admin Email</Label>
          <Input
              id="admin-email"
              v-model="settings.adminEmail"
              type="email"
              placeholder="admin@example.com"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Localization -->
    <Card>
      <CardHeader>
        <CardTitle>Localization</CardTitle>
        <CardDescription>
          Configure timezone, language and date formats
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="timezone">Timezone</Label>
          <Select v-model="settings.timezone">
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="tz in timezones" :key="tz" :value="tz">
                {{ tz }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <Label for="language">Language</Label>
          <Select v-model="settings.language">
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="lang in languages" :key="lang.value" :value="lang.value">
                {{ lang.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <Label for="date-format">Date Format</Label>
          <Select v-model="settings.dateFormat">
            <SelectTrigger id="date-format">
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="format in dateFormats" :key="format" :value="format">
                {{ format }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Updates & Privacy -->
    <Card>
      <CardHeader>
        <CardTitle>Updates & Privacy</CardTitle>
        <CardDescription>
          Manage automatic updates and telemetry data
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Automatic Updates</Label>
            <p class="text-sm text-muted-foreground">
              Automatically update to the latest version
            </p>
          </div>
          <Switch v-model:checked="settings.autoUpdate" />
        </div>

        <Separator />

        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Send Telemetry Data</Label>
            <p class="text-sm text-muted-foreground">
              Help improve the platform by sharing anonymous usage data
            </p>
          </div>
          <Switch v-model:checked="settings.telemetry" />
        </div>
      </CardContent>
    </Card>

    <!-- Actions -->
    <div class="flex justify-end">
      <Button @click="emit('save')" size="lg">
        <Save class="h-4 w-4 mr-2" />
        Save Changes
      </Button>
    </div>
  </div>
</template>
