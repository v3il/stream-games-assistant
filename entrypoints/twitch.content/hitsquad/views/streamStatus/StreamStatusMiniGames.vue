<template>
    <StreamStatusItem :ok="streamStatusService.isBotWorking" :tooltip v-slot="{ classes }">
        <Bot :size="18" :class="classes" />
    </StreamStatusItem>
</template>

<script setup lang="ts">
import { Bot } from 'lucide-vue-next';
import { StreamStatusItem } from '@twitch/core';
import { InjectionTokens } from '@twitch/core/injectionTokens';
import { HitsquadStreamStatusService } from '../../modules';

const streamStatusService = inject<HitsquadStreamStatusService>(InjectionTokens.STREAM_STATUS_SERVICE)!;

const tooltip = computed(() => streamStatusService.isBotWorking
    ? 'Mini-games bot is running'
    : 'Mini-games bot is not running. Mini-game commands are on hold'
);
</script>
