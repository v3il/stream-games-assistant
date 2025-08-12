<template>
    <StreamStatusItem :ok="streamStatusService.isStreamOk" :tooltip v-slot="{ classes }">
        {{streamStatusService.isStreamOk}}
        <Activity :size="18" :class="classes" />
    </StreamStatusItem>
</template>

<script setup lang="ts">
import { Activity } from 'lucide-vue-next';
import { InjectionTokens } from '../../injectionTokens';
import { StreamStatusItem } from '@twitch/core';

const streamStatusService = inject(InjectionTokens.STREAM_STATUS_SERVICE)!;

const tooltip = computed(() => streamStatusService.isStreamOk
    ? 'Stream is running'
    : 'Stream is broken. Mini-game commands are on hold'
);
</script>
