<template>
    <StreamStatusItem :ok="!streamStatusService.isAntiCheat" :tooltip v-slot="{ classes }">
        <ShieldAlert :size="18" :class="classes" />
    </StreamStatusItem>
</template>

<script setup lang="ts">
import { ShieldAlert } from 'lucide-vue-next';
import { StreamStatusItem } from '@twitch/core';
import { InjectionTokens } from '@twitch/core/injectionTokens';
import { HitsquadStreamStatusService } from '../../modules';

const streamStatusService = inject<HitsquadStreamStatusService>(InjectionTokens.STREAM_STATUS_SERVICE)!;

const tooltip = computed(() => streamStatusService.isAntiCheat
    ? 'Anti-cheat is active. Mini-game commands are on hold'
    : 'Anti-cheat is inactive'
);
</script>
