<template>
    {{ formattedTime }}
</template>

<script setup lang="ts">
import { Timing } from '@shared/consts';

const props = defineProps<{
    timeout: number;
}>()

const formattedTime = ref('');

const intervalId = window.setInterval(tick, Timing.SECOND);

tick();

function tick() {
    const diff = Math.max(props.timeout - Date.now(), 0);
    const minutes = Math.floor(diff / Timing.MINUTE).toString().padStart(2, '0');
    const seconds = Math.floor((diff % Timing.MINUTE) / Timing.SECOND).toString().padStart(2, '0');

    formattedTime.value = `${minutes}:${seconds}`;
}

onUnmounted(() => {
    clearInterval(intervalId);
});
</script>
