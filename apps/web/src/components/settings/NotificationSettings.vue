<!-- src/components/settings/NotificationSettings.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Save, Mail, MessageSquare, Bell } from 'lucide-vue-next';

interface Emits {
  (e: 'save'): void;
}

const emit = defineEmits<Emits>();

const settings = ref({
  emailEnabled: true,
  emailHost: 'smtp.gmail.com',
  emailPort: 587,
  emailUsername: '',
  emailPassword: '',
  emailFrom: 'devops@example.com',

  slackEnabled: false,
  slackWebhook: '',
  slackChannel: '#devops',

  discordEnabled: false,
  discordWebhook: '',

  notifyDeployment: true,
  notifyErrors: true,
  notifyUpdates: false,
  notifyBackups: true,
});
</script>

<template>
  <div class="space-y-6">
    <!-- Email Notifications -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="flex items-center gap-2">
              <Mail class="h-5 w-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Configure SMTP settings for email notifications
            </CardDescription>
          </div>
          <Switch v-model:checked="settings.emailEnabled" />
        </div>
      </CardHeader>
      <CardContent v-if="settings.emailEnabled" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="email-host">SMTP Host</Label>
            <Input
                id="email-host"
                v-model="settings.emailHost"
                placeholder="smtp.gmail.com"
            />
          </div>

          <div class="space-y-2">
            <Label for="email-port">SMTP Port</Label>
            <Input
                id="email-port"
                v-model.number="settings.emailPort"
                type="number"
                placeholder="587"
            />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="email-username">Username</Label>
          <Input
              id="email-username"
              v-model="settings.emailUsername"
              type="email"
              placeholder="your-email@gmail.com"
          />
        </div>

        <div class="space-y-2">
          <Label for="email-password">Password</Label>
          <Input
              id="email-password"
              v-model="settings.emailPassword"
              type="password"
              placeholder="••••••••"
          />
        </div>

        <div class="space-y-2">
          <Label for="email-from">From Address</Label>
          <Input
              id="email-from"
              v-model="settings.emailFrom"
              type="email"
              placeholder="devops@example.com"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Slack Notifications -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="flex items-center gap-2">
              <MessageSquare class="h-5 w-5" />
              Slack Notifications
            </CardTitle>
            <CardDescription>
              Send notifications to Slack channels
            </CardDescription>
          </div>
          <Switch v-model:checked="settings.slackEnabled" />
        </div>
      </CardHeader>
      <CardContent v-if="settings.slackEnabled" class="space-y-4">
        <div class="space-y-2">
          <Label for="slack-webhook">Webhook URL</Label>
          <Input
              id="slack-webhook"
              v-model="settings.slackWebhook"
              type="url"
              placeholder="https://hooks.slack.com/services/..."
          />
        </div>

        <div class="space-y-2">
          <Label for="slack-channel">Channel</Label>
          <Input
              id="slack-channel"
              v-model="settings.slackChannel"
              placeholder="#devops"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Discord Notifications -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="flex items-center gap-2">
              <MessageSquare class="h-5 w-5" />
              Discord Notifications
            </CardTitle>
            <CardDescription>
              Send notifications to Discord channels
            </CardDescription>
          </div>
          <Switch v-model:checked="settings.discordEnabled" />
        </div>
      </CardHeader>
      <CardContent v-if="settings.discordEnabled" class="space-y-4">
        <div class="space-y-2">
          <Label for="discord-webhook">Webhook URL</Label>
          <Input
              id="discord-webhook"
              v-model="settings.discordWebhook"
              type="url"
              placeholder="https://discord.com/api/webhooks/..."
          />
        </div>
      </CardContent>
    </Card>

    <!-- Notification Preferences -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Bell class="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose which events trigger notifications
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Deployments</Label>
            <p class="text-sm text-muted-foreground">
              Notify when sites are deployed or updated
            </p>
          </div>
          <Switch v-model:checked="settings.notifyDeployment" />
        </div>

        <Separator />

        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Errors</Label>
            <p class="text-sm text-muted-foreground">
              Notify when errors occur
            </p>
          </div>
          <Switch v-model:checked="settings.notifyErrors" />
        </div>

        <Separator />

        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Platform Updates</Label>
            <p class="text-sm text-muted-foreground">
              Notify when platform updates are available
            </p>
          </div>
          <Switch v-model:checked="settings.notifyUpdates" />
        </div>

        <Separator />

        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Backups</Label>
            <p class="text-sm text-muted-foreground">
              Notify when backups are completed
            </p>
          </div>
          <Switch v-model:checked="settings.notifyBackups" />
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
