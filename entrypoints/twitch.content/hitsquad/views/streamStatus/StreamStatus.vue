<template>
    <div class="flex items-center gap-[16px]">
        <StreamStatusMiniGames />
        <StreamStatusVideoPlayer />
        <StreamStatusAntiCheat />
    </div>
</template>

<script setup lang="ts">
import StreamStatusMiniGames from './StreamStatusMiniGames.vue';
import StreamStatusAntiCheat from './StreamStatusAntiCheat.vue';
import { StreamStatusVideoPlayer } from '@twitch/core';
</script>
