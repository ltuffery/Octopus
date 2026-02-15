<!-- src/components/settings/GitSettings.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, Plus, Trash2, Github, Gitlab } from 'lucide-vue-next';

interface Emits {
  (e: 'save'): void;
}

const emit = defineEmits<Emits>();

interface GitProvider {
  id: string;
  type: 'github' | 'gitlab';
  name: string;
  token: string;
  url?: string;
}

const providers = ref<GitProvider[]>([
  {
    id: '1',
    type: 'github',
    name: 'GitHub',
    token: 'ghp_xxxxxxxxxxxxxxxxxxxx',
  },
  {
    id: '2',
    type: 'gitlab',
    name: 'GitLab',
    token: 'glpat-xxxxxxxxxxxxxxxxxxxx',
    url: 'https://gitlab.com',
  },
]);

const sshKey = ref('');

const addProvider = () => {
  providers.value.push({
    id: Date.now().toString(),
    type: 'github',
    name: '',
    token: '',
  });
};

const removeProvider = (id: string) => {
  providers.value = providers.value.filter(p => p.id !== id);
};

const generateSSHKey = () => {
  // Simulate SSH key generation
  sshKey.value = `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC... generated@devops`;
};
</script>

<template>
  <div class="space-y-6">
    <!-- Git Providers -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Git Providers</CardTitle>
            <CardDescription>
              Manage GitHub and GitLab integrations
            </CardDescription>
          </div>
          <Button @click="addProvider" variant="outline" size="sm">
            <Plus class="h-4 w-4 mr-2" />
            Add Provider
          </Button>
        </div>
      </CardHeader>
      <CardContent class="space-y-6">
        <div
            v-for="(provider, index) in providers"
            :key="provider.id"
            class="space-y-4"
        >
          <div class="flex items-start gap-4">
            <div class="p-2 rounded-lg bg-muted">
              <component
                  :is="provider.type === 'github' ? Github : Gitlab"
                  class="h-5 w-5"
              />
            </div>

            <div class="flex-1 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label :for="`provider-name-${index}`">Name</Label>
                  <Input
                      :id="`provider-name-${index}`"
                      v-model="provider.name"
                      placeholder="My GitHub Account"
                  />
                </div>

                <div class="space-y-2">
                  <Label :for="`provider-type-${index}`">Type</Label>
                  <div class="flex items-center gap-2 h-10">
                    <Badge :variant="provider.type === 'github' ? 'default' : 'secondary'">
                      {{ provider.type }}
                    </Badge>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <Label :for="`provider-token-${index}`">Access Token</Label>
                <Input
                    :id="`provider-token-${index}`"
                    v-model="provider.token"
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                />
              </div>

              <div v-if="provider.type === 'gitlab'" class="space-y-2">
                <Label :for="`provider-url-${index}`">GitLab URL</Label>
                <Input
                    :id="`provider-url-${index}`"
                    v-model="provider.url"
                    placeholder="https://gitlab.com"
                />
              </div>
            </div>

            <Button
                @click="removeProvider(provider.id)"
                variant="ghost"
                size="icon"
                class="text-destructive"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>

          <Separator v-if="index < providers.length - 1" />
        </div>
      </CardContent>
    </Card>

    <!-- SSH Keys -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>SSH Keys</CardTitle>
            <CardDescription>
              Manage SSH keys for repository access
            </CardDescription>
          </div>
          <Button @click="generateSSHKey" variant="outline" size="sm">
            Generate New Key
          </Button>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="ssh-key">Public SSH Key</Label>
          <Textarea
              id="ssh-key"
              v-model="sshKey"
              rows="6"
              placeholder="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAB..."
              class="font-mono text-sm"
          />
          <p class="text-xs text-muted-foreground">
            Add this public key to your Git provider to enable SSH access
          </p>
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
