<template>
    <StreamStatusItem Icon={Activity} isOk={streamStatusService.isStreamOk} {tooltip} />
</template>

<script setup lang="ts">
import StreamStatusItem from './StreamStatusItem.svelte';
import { Container } from 'typedi';
import { StreamStatusService } from '@twitch/core/modules';

const streamStatusService = Container.get<StreamStatusService>(StreamStatusService);

const tooltip = computed(() => streamStatusService.isStreamOk
    ? 'Stream is running'
    : 'Stream is broken. Mini-game commands are on hold'
);
</script>
