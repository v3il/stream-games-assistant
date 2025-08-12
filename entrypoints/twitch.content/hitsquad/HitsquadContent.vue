<template>
    <div class="flex justify-between items-center py-[10px] px-[16px] w-full rounded-xl">
        <MiniGamesControls />
        <StreamStatus />
    </div>
</template>

<script setup lang="ts">
import { useDaCoinzCollector, useDelayRemover, useMentionsHighlighter } from '@twitch/core/composables';
import { StreamStatus, MiniGamesControls } from './views';

useDelayRemover();
useDaCoinzCollector();
useMentionsHighlighter();
</script>
