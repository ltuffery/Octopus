<script setup lang="ts">
import {useColorMode} from "@vueuse/core";

const mode = useColorMode()

mode.store.value = 'dark'
</script>

<template>
  <router-view />
</template>
