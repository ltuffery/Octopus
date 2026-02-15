<!-- src/components/settings/DockerSettings.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Info, CheckCircle } from 'lucide-vue-next';

interface Emits {
  (e: 'save'): void;
}

const emit = defineEmits<Emits>();

const settings = ref({
  dockerHost: 'unix:///var/run/docker.sock',
  registry: 'docker.io',
  registryUsername: '',
  registryPassword: '',
  defaultNetwork: 'devops-network',
  autoCleanup: true,
  maxContainers: 50,
  maxImages: 100,
  cpuLimit: 2,
  memoryLimit: 4096,
  enableSwarm: false,
});

const isConnected = ref(true);
</script>

<template>
  <div class="space-y-6">
    <!-- Connection Status -->
    <Alert v-if="isConnected">
      <CheckCircle class="h-4 w-4" />
      <AlertDescription>
        Connected to Docker daemon successfully
      </AlertDescription>
    </Alert>

    <!-- Docker Connection -->
    <Card>
      <CardHeader>
        <CardTitle>Docker Connection</CardTitle>
        <CardDescription>
          Configure connection to Docker daemon
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="docker-host">Docker Host</Label>
          <Input
              id="docker-host"
              v-model="settings.dockerHost"
              placeholder="unix:///var/run/docker.sock"
          />
          <p class="text-xs text-muted-foreground">
            Use unix:///var/run/docker.sock for local or tcp://host:port for remote
          </p>
        </div>

        <div class="space-y-2">
          <Label for="default-network">Default Network</Label>
          <Input
              id="default-network"
              v-model="settings.defaultNetwork"
              placeholder="devops-network"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Enable Docker Swarm</Label>
            <p class="text-sm text-muted-foreground">
              Use Docker Swarm for container orchestration
            </p>
          </div>
          <Switch v-model:checked="settings.enableSwarm" />
        </div>
      </CardContent>
    </Card>

    <!-- Registry Settings -->
    <Card>
      <CardHeader>
        <CardTitle>Container Registry</CardTitle>
        <CardDescription>
          Configure Docker registry authentication
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="registry">Registry URL</Label>
          <Input
              id="registry"
              v-model="settings.registry"
              placeholder="docker.io"
          />
        </div>

        <div class="space-y-2">
          <Label for="registry-username">Username</Label>
          <Input
              id="registry-username"
              v-model="settings.registryUsername"
              placeholder="Enter username"
              autocomplete="username"
          />
        </div>

        <div class="space-y-2">
          <Label for="registry-password">Password</Label>
          <Input
              id="registry-password"
              v-model="settings.registryPassword"
              type="password"
              placeholder="Enter password"
              autocomplete="current-password"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Resource Limits -->
    <Card>
      <CardHeader>
        <CardTitle>Resource Limits</CardTitle>
        <CardDescription>
          Set default resource limits for containers
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="cpu-limit">CPU Limit (cores)</Label>
            <Input
                id="cpu-limit"
                v-model.number="settings.cpuLimit"
                type="number"
                min="1"
                max="16"
            />
          </div>

          <div class="space-y-2">
            <Label for="memory-limit">Memory Limit (MB)</Label>
            <Input
                id="memory-limit"
                v-model.number="settings.memoryLimit"
                type="number"
                min="512"
                step="512"
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Cleanup Settings -->
    <Card>
      <CardHeader>
        <CardTitle>Cleanup Settings</CardTitle>
        <CardDescription>
          Manage automatic cleanup of unused resources
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Auto Cleanup</Label>
            <p class="text-sm text-muted-foreground">
              Automatically remove unused containers and images
            </p>
          </div>
          <Switch v-model:checked="settings.autoCleanup" />
        </div>

        <Separator />

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="max-containers">Max Containers</Label>
            <Input
                id="max-containers"
                v-model.number="settings.maxContainers"
                type="number"
                min="10"
            />
          </div>

          <div class="space-y-2">
            <Label for="max-images">Max Images</Label>
            <Input
                id="max-images"
                v-model.number="settings.maxImages"
                type="number"
                min="10"
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
