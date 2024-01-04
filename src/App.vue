<script setup lang='ts'>
import { createDefaultApp } from "@/core/sceneManager";
</script>

<template>
  <canvas :ref="el => createDefaultApp(el as HTMLCanvasElement)" />
</template>
