<!-- src/components/settings/SecuritySettings.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, AlertTriangle, Shield, Key } from 'lucide-vue-next';

interface Emits {
  (e: 'save'): void;
}

const emit = defineEmits<Emits>();

const settings = ref({
  twoFactorAuth: false,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  passwordMinLength: 12,
  requireSpecialChars: true,
  requireNumbers: true,
  requireUppercase: true,
  sslCertAutoRenew: true,
  forceHttps: true,
  corsEnabled: false,
  corsOrigins: '',
  rateLimitEnabled: true,
  rateLimitRequests: 100,
  rateLimitWindow: 15,
});
</script>

<template>
  <div class="space-y-6">
    <!-- Security Warning -->
    <Alert>
      <AlertTriangle class="h-4 w-4" />
      <AlertDescription>
        Changes to security settings will affect all users. Please review carefully before saving.
      </AlertDescription>
    </Alert>

    <!-- Authentication -->
    <Card>
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <CardDescription>
          Configure authentication and session management
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Two-Factor Authentication</Label>
            <p class="text-sm text-muted-foreground">
              Require 2FA for all users
            </p>
          </div>
          <Switch v-model:checked="settings.twoFactorAuth" />
        </div>

        <Separator />

        <div class="space-y-2">
          <Label for="session-timeout">Session Timeout (minutes)</Label>
          <Input
              id="session-timeout"
              v-model.number="settings.sessionTimeout"
              type="number"
              min="5"
              max="1440"
          />
        </div>

        <div class="space-y-2">
          <Label for="max-login-attempts">Max Login Attempts</Label>
          <Input
              id="max-login-attempts"
              v-model.number="settings.maxLoginAttempts"
              type="number"
              min="3"
              max="10"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Password Policy -->
    <Card>
      <CardHeader>
        <CardTitle>Password Policy</CardTitle>
        <CardDescription>
          Set password requirements for all users
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="password-min-length">Minimum Password Length</Label>
          <Input
              id="password-min-length"
              v-model.number="settings.passwordMinLength"
              type="number"
              min="8"
              max="32"
          />
        </div>

        <Separator />

        <div class="flex items-center justify-between">
          <Label>Require Special Characters</Label>
          <Switch v-model:checked="settings.requireSpecialChars" />
        </div>

        <div class="flex items-center justify-between">
          <Label>Require Numbers</Label>
          <Switch v-model:checked="settings.requireNumbers" />
        </div>

        <div class="flex items-center justify-between">
          <Label>Require Uppercase Letters</Label>
          <Switch v-model:checked="settings.requireUppercase" />
        </div>
      </CardContent>
    </Card>

    <!-- SSL/TLS -->
    <Card>
      <CardHeader>
        <CardTitle>SSL/TLS</CardTitle>
        <CardDescription>
          Configure HTTPS and certificate management
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Auto-Renew SSL Certificates</Label>
            <p class="text-sm text-muted-foreground">
              Automatically renew Let's Encrypt certificates
            </p>
          </div>
          <Switch v-model:checked="settings.sslCertAutoRenew" />
        </div>

        <Separator />

        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Force HTTPS</Label>
            <p class="text-sm text-muted-foreground">
              Redirect all HTTP traffic to HTTPS
            </p>
          </div>
          <Switch v-model:checked="settings.forceHttps" />
        </div>
      </CardContent>
    </Card>

    <!-- CORS -->
    <Card>
      <CardHeader>
        <CardTitle>CORS (Cross-Origin Resource Sharing)</CardTitle>
        <CardDescription>
          Configure cross-origin request policies
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Enable CORS</Label>
            <p class="text-sm text-muted-foreground">
              Allow cross-origin requests
            </p>
          </div>
          <Switch v-model:checked="settings.corsEnabled" />
        </div>

        <div v-if="settings.corsEnabled" class="space-y-2">
          <Label for="cors-origins">Allowed Origins</Label>
          <Textarea
              id="cors-origins"
              v-model="settings.corsOrigins"
              placeholder="https://example.com&#10;https://app.example.com"
              rows="4"
          />
          <p class="text-xs text-muted-foreground">
            One origin per line. Use * to allow all origins (not recommended)
          </p>
        </div>
      </CardContent>
    </Card>

    <!-- Rate Limiting -->
    <Card>
      <CardHeader>
        <CardTitle>Rate Limiting</CardTitle>
        <CardDescription>
          Protect against abuse with rate limits
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Enable Rate Limiting</Label>
            <p class="text-sm text-muted-foreground">
              Limit the number of requests per IP
            </p>
          </div>
          <Switch v-model:checked="settings.rateLimitEnabled" />
        </div>

        <div v-if="settings.rateLimitEnabled" class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="rate-limit-requests">Max Requests</Label>
            <Input
                id="rate-limit-requests"
                v-model.number="settings.rateLimitRequests"
                type="number"
                min="10"
            />
          </div>

          <div class="space-y-2">
            <Label for="rate-limit-window">Time Window (minutes)</Label>
            <Input
                id="rate-limit-window"
                v-model.number="settings.rateLimitWindow"
                type="number"
                min="1"
            />
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
