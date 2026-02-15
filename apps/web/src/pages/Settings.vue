<!-- src/pages/Settings.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'vue-sonner';

// Tabs Components
import GeneralSettings from '@/components/settings/GeneralSettings.vue';
import DockerSettings from '@/components/settings/DockerSettings.vue';
import GitSettings from '@/components/settings/GitSettings.vue';
import SecuritySettings from '@/components/settings/SecuritySettings.vue';
import NotificationSettings from '@/components/settings/NotificationSettings.vue';
import BackupSettings from '@/components/settings/BackupSettings.vue';

const activeTab = ref('general');

const handleSave = (section: string) => {
  toast({
    title: 'Settings saved',
    description: `${section} settings have been updated successfully.`,
  });
};
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold">Settings</h1>
      <p class="text-muted-foreground mt-1">
        Manage your platform configuration and preferences
      </p>
    </div>

    <!-- Settings Tabs -->
    <Tabs v-model="activeTab" class="space-y-6">
      <TabsList class="grid w-full grid-cols-6">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="docker">Docker</TabsTrigger>
        <TabsTrigger value="git">Git</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="backup">Backup</TabsTrigger>
      </TabsList>

      <!-- General Settings -->
      <TabsContent value="general">
        <GeneralSettings @save="handleSave('General')" />
      </TabsContent>

      <!-- Docker Settings -->
      <TabsContent value="docker">
        <DockerSettings @save="handleSave('Docker')" />
      </TabsContent>

      <!-- Git Settings -->
      <TabsContent value="git">
        <GitSettings @save="handleSave('Git')" />
      </TabsContent>

      <!-- Security Settings -->
      <TabsContent value="security">
        <SecuritySettings @save="handleSave('Security')" />
      </TabsContent>

      <!-- Notification Settings -->
      <TabsContent value="notifications">
        <NotificationSettings @save="handleSave('Notification')" />
      </TabsContent>

      <!-- Backup Settings -->
      <TabsContent value="backup">
        <BackupSettings @save="handleSave('Backup')" />
      </TabsContent>
    </Tabs>
  </div>
</template>
