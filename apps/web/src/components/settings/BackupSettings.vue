<!-- src/components/settings/BackupSettings.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Save, Download, Trash2, Clock } from 'lucide-vue-next';

interface Emits {
  (e: 'save'): void;
}

const emit = defineEmits<Emits>();

interface Backup {
  id: string;
  name: string;
  size: string;
  date: string;
  type: 'full' | 'incremental';
}

const settings = ref({
  autoBackup: true,
  backupFrequency: 'daily',
  backupTime: '02:00',
  retentionDays: 30,
  backupLocation: '/var/backups/devops',
  includeDatabase: true,
  includeSites: true,
  includeDocker: true,
  compressBackups: true,
  encryptBackups: false,
  encryptionKey: '',
});

const backups = ref<Backup[]>([
  {
    id: '1',
    name: 'backup-2024-02-14-full',
    size: '2.4 GB',
    date: '2024-02-14 02:00:00',
    type: 'full',
  },
  {
    id: '2',
    name: 'backup-2024-02-13-incremental',
    size: '450 MB',
    date: '2024-02-13 02:00:00',
    type: 'incremental',
  },
]);

const frequencies = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const createBackup = () => {
  console.log('Creating backup...');
};

const downloadBackup = (id: string) => {
  console.log('Downloading backup:', id);
};

const deleteBackup = (id: string) => {
  backups.value = backups.value.filter(b => b.id !== id);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Automatic Backups -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Automatic Backups</CardTitle>
            <CardDescription>
              Configure scheduled backup settings
            </CardDescription>
          </div>
          <Switch v-model:checked="settings.autoBackup" />
        </div>
      </CardHeader>
      <CardContent v-if="settings.autoBackup" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="backup-frequency">Frequency</Label>
            <Select v-model="settings.backupFrequency">
              <SelectTrigger id="backup-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="freq in frequencies" :key="freq.value" :value="freq.value">
                  {{ freq.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="backup-time">Time</Label>
            <Input
                id="backup-time"
                v-model="settings.backupTime"
                type="time"
            />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="retention-days">Retention Period (days)</Label>
          <Input
              id="retention-days"
              v-model.number="settings.retentionDays"
              type="number"
              min="1"
              max="365"
          />
          <p class="text-xs text-muted-foreground">
            Backups older than this will be automatically deleted
          </p>
        </div>

        <div class="space-y-2">
          <Label for="backup-location">Backup Location</Label>
          <Input
              id="backup-location"
              v-model="settings.backupLocation"
              placeholder="/var/backups/devops"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Backup Content -->
    <Card>
      <CardHeader>
        <CardTitle>Backup Content</CardTitle>
        <CardDescription>
          Choose what to include in backups
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Database</Label>
            <p class="text-sm text-muted-foreground">
              Backup all database contents
            </p>
          </div>
          <Switch v-model:checked="settings.includeDatabase" />
        </div>

        <Separator />

        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Site Files</Label>
            <p class="text-sm text-muted-foreground">
              Backup all deployed site files
            </p>
          </div>
          <Switch v-model:checked="settings.includeSites" />
        </div>

        <Separator />

        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Docker Volumes</Label>
            <p class="text-sm text-muted-foreground">
              Backup Docker volumes and configurations
            </p>
          </div>
          <Switch v-model:checked="settings.includeDocker" />
        </div>
      </CardContent>
    </Card>

    <!-- Backup Options -->
    <Card>
      <CardHeader>
        <CardTitle>Backup Options</CardTitle>
        <CardDescription>
          Additional backup settings
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Compress Backups</Label>
            <p class="text-sm text-muted-foreground">
              Use compression to reduce backup size
            </p>
          </div>
          <Switch v-model:checked="settings.compressBackups" />
        </div>

        <Separator />

        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Encrypt Backups</Label>
            <p class="text-sm text-muted-foreground">
              Encrypt backups with AES-256
            </p>
          </div>
          <Switch v-model:checked="settings.encryptBackups" />
        </div>

        <div v-if="settings.encryptBackups" class="space-y-2">
          <Label for="encryption-key">Encryption Key</Label>
          <Input
              id="encryption-key"
              v-model="settings.encryptionKey"
              type="password"
              placeholder="Enter encryption key"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Recent Backups -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Recent Backups</CardTitle>
            <CardDescription>
              View and manage existing backups
            </CardDescription>
          </div>
          <Button @click="createBackup" variant="outline" size="sm">
            Create Backup Now
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div
              v-for="backup in backups"
              :key="backup.id"
              class="flex items-center justify-between p-4 border rounded-lg"
          >
            <div class="flex items-center gap-4">
              <div class="p-2 rounded-lg bg-muted">
                <Clock class="h-5 w-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <p class="font-medium">{{ backup.name }}</p>
                  <Badge :variant="backup.type === 'full' ? 'default' : 'secondary'">
                    {{ backup.type }}
                  </Badge>
                </div>
                <p class="text-sm text-muted-foreground">
                  {{ backup.size }} • {{ backup.date }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <Button
                  @click="downloadBackup(backup.id)"
                  variant="ghost"
                  size="icon"
              >
                <Download class="h-4 w-4" />
              </Button>
              <Button
                  @click="deleteBackup(backup.id)"
                  variant="ghost"
                  size="icon"
                  class="text-destructive"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </div>
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
