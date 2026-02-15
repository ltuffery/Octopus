<!-- src/pages/404-minimal.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-vue-next';

const router = useRouter();
</script>

<template>
  <div class="flex items-center justify-center p-6">
    <div class="text-center space-y-6 max-w-md">
      <!-- Large 404 -->
      <div class="space-y-2">
        <h1 class="text-[10rem] font-bold leading-none bg-gradient-to-br from-primary to-primary/40 bg-clip-text text-transparent">
          404
        </h1>
        <h2 class="text-2xl font-semibold">Page Not Found</h2>
        <p class="text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-center gap-3">
        <Button
            @click="router.back()"
            variant="outline"
            size="lg"
        >
          <ArrowLeft class="h-4 w-4 mr-2" />
          Go Back
        </Button>
        <Button
            @click="router.push('/')"
            size="lg"
        >
          <Home class="h-4 w-4 mr-2" />
          Home
        </Button>
      </div>
    </div>
  </div>
</template>
