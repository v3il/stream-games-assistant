<template>
    <div :title="tooltip">
        <Icon size="18" :class="indicatorClass" />
    </div>
</template>

<script setup lang="ts">
interface IProps {
    Icon: Component,
    isOk: boolean,
    tooltip: string
}

const props = defineProps<IProps>();

const indicatorClass = computed(() => props.isOk ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400');
</script>
