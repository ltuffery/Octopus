<!-- src/components/dashboard/CreateSiteDialog.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import type { CreateSitePayload, Framework } from '@/composables/useSites';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Loader2, Github, Gitlab, Folder } from 'lucide-vue-next';

interface Props {
  isCreating: boolean;
}

interface Emits {
  (e: 'create', payload: CreateSitePayload): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const open = ref(false);
const form = ref<CreateSitePayload>({
  name: '',
  source: 'github',
  sourceUrl: '',
  framework: 'nextjs',
  branch: 'main',
  domain: '',
  databases: [],
  envVars: {},
});

const frameworks: { value: Framework; label: string; icon: string }[] = [
  { value: 'nextjs', label: 'Next.js', icon: '⚡' },
  { value: 'nuxt', label: 'Nuxt', icon: '💚' },
  { value: 'vue', label: 'Vue', icon: '🟢' },
  { value: 'react', label: 'React', icon: '⚛️' },
  { value: 'php', label: 'PHP', icon: '🐘' },
  { value: 'static', label: 'Static HTML', icon: '📄' },
  { value: 'custom', label: 'Custom', icon: '🔧' },
];

const handleCreate = () => {
  emit('create', form.value);
  open.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = {
    name: '',
    source: 'github',
    sourceUrl: '',
    framework: 'nextjs',
    branch: 'main',
    domain: '',
    databases: [],
    envVars: {},
  };
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot>
        <Button size="lg">
          <Plus class="h-5 w-5 mr-2" />
          New Site
        </Button>
      </slot>
    </DialogTrigger>

    <DialogContent class="max-w-2xl max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>Create New Site</DialogTitle>
        <DialogDescription>
          Deploy a new site from GitHub, GitLab, or local directory
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="max-h-[calc(90vh-200px)]">
        <div class="space-y-6 pr-6">
          <!-- Site Name -->
          <div class="space-y-2">
            <Label for="name">Site Name *</Label>
            <Input
                id="name"
                v-model="form.name"
                placeholder="my-awesome-site"
            />
          </div>

          <!-- Source -->
          <div class="space-y-2">
            <Label>Source *</Label>
            <Select v-model="form.source">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="github">
                  <div class="flex items-center gap-2">
                    <Github class="h-4 w-4" />
                    GitHub
                  </div>
                </SelectItem>
                <SelectItem value="gitlab">
                  <div class="flex items-center gap-2">
                    <Gitlab class="h-4 w-4" />
                    GitLab
                  </div>
                </SelectItem>
                <SelectItem value="local">
                  <div class="flex items-center gap-2">
                    <Folder class="h-4 w-4" />
                    Local Directory
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Source URL/Path -->
          <div v-if="form.source !== 'local'" class="space-y-2">
            <Label for="sourceUrl">Repository URL *</Label>
            <Input
                id="sourceUrl"
                v-model="form.sourceUrl"
                placeholder="https://github.com/user/repo"
            />
          </div>
          <div v-else class="space-y-2">
            <Label for="localPath">Local Path *</Label>
            <Input
                id="localPath"
                v-model="form.localPath"
                placeholder="/var/www/my-site"
            />
          </div>

          <!-- Framework -->
          <div class="space-y-2">
            <Label>Framework *</Label>
            <Select v-model="form.framework">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                    v-for="fw in frameworks"
                    :key="fw.value"
                    :value="fw.value"
                >
                  <div class="flex items-center gap-2">
                    <span>{{ fw.icon }}</span>
                    <span>{{ fw.label }}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Branch -->
          <div v-if="form.source !== 'local'" class="space-y-2">
            <Label for="branch">Branch</Label>
            <Input
                id="branch"
                v-model="form.branch"
                placeholder="main"
            />
          </div>

          <!-- Domain -->
          <div class="space-y-2">
            <Label for="domain">Custom Domain (optional)</Label>
            <Input
                id="domain"
                v-model="form.domain"
                placeholder="mysite.com"
            />
          </div>

          <!-- Build Command -->
          <div class="space-y-2">
            <Label for="buildCommand">Build Command (optional)</Label>
            <Input
                id="buildCommand"
                v-model="form.buildCommand"
                placeholder="npm run build"
            />
          </div>

          <!-- Start Command -->
          <div class="space-y-2">
            <Label for="startCommand">Start Command (optional)</Label>
            <Input
                id="startCommand"
                v-model="form.startCommand"
                placeholder="npm start"
            />
          </div>
        </div>
      </ScrollArea>

      <div class="flex justify-end gap-2 mt-4">
        <Button
            variant="outline"
            @click="open = false"
        >
          Cancel
        </Button>
        <Button
            @click="handleCreate"
            :disabled="!form.name || isCreating"
        >
          <Loader2 v-if="isCreating" class="h-4 w-4 mr-2 animate-spin" />
          {{ isCreating ? 'Creating...' : 'Create Site' }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
