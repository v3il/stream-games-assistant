<template>
    <div :title="tooltip">
        <slot :classes="indicatorClasses" />
    </div>
</template>

<script setup lang="ts">
import type { Slot } from 'vue';

const props = defineProps<{
    ok: boolean,
    tooltip: string
}>();

defineSlots<{
    default: Slot<{ classes: string }>
}>();

const indicatorClasses = computed(() => {
    return props.ok ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'
});
</script>
