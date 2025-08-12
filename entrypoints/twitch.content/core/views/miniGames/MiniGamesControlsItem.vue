<template>
    <div class="relative flex items-center justify-center rounded-lg">
        <button
            class="inline-flex items-center justify-center h-[36px] w-[36px] dark:hover:bg-[#27272a]/40 border border-[#3232399e]/70 dark:border-[#3f3f46]/30 rounded-l-lg p-[8px] transition-all duration-200 group ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed dark:hover:text-accent-foreground"
            :title="name"
            @click="$emit('toggle', !isGameActive)"
        >
            <slot name="icon" :classes="toggleIconClasses" />
        </button>

        <div :title="sendButtonTooltip">
            <button
                class="inline-flex items-center justify-center h-[36px] w-[36px] dark:hover:bg-[#27272a]/40 border border-[#3232399e]/70 border-l-0 dark:border-[#3f3f46]/30 rounded-r-lg p-[8px] transition-all duration-200 group ring-offset-background disabled:cursor-not-allowed dark:hover:text-accent-foreground"
                tabindex="-1"
                :disabled="!isSendEnabled"
                @click="$emit('send')"
            >
                <Send :size="14" :class="sendIconClasses" />
            </button>
        </div>

        <slot name="indicators" v-if="$slots.indicators" />
    </div>
</template>

<script setup lang="ts">
// import type { Component, Snippet } from 'svelte';
import { Send } from 'lucide-vue-next';
import type { Slot } from 'vue';
// import { Container } from 'typedi';
// import { StreamStatusService } from '@twitch/modules/stream';

interface IProps {
    isSendEnabled: boolean;
    isGameActive: boolean;
    name: string;
    sendButtonTooltip: string;
}

const props = defineProps<IProps>();

defineSlots<{
    icon: Slot<{ classes: string }>;
    indicators?: [];
}>();

defineEmits<{
    toggle: [boolean];
    send: [];
}>()

// const streamStatusService = Container.get(StreamStatusService);

const toggleIconClasses = computed(() => {
    return props.isGameActive ? 'text-[#8456FF] dark:text-[#9b87f5] group-hover:text-[#9b87f5]' : 'text-[#53535f] dark:text-gray-400';
});

const sendIconClasses = computed(() => {
    return props.isSendEnabled ? 'text-green-700 dark:text-green-500 group-hover:text-green-600' : 'text-[#53535f]';
});

// const sendButtonTooltip = computed(() => {
//     const disabledMiniGamesNote = 'Mini-game commands are disabled';
//
//     if (streamStatusService.isAntiCheat) {
//         return `Anti-cheat is active. ${disabledMiniGamesNote}`;
//     }
//
//     if (!streamStatusService.isStreamOk) {
//         return `Stream is broken. ${disabledMiniGamesNote}`;
//     }
//
//     if (!streamStatusService.isBotWorking) {
//         return `Mini-games bot is not working. ${disabledMiniGamesNote}`;
//     }
//
//     if (props.isSendEnabled) {
//         return `Send ${props.command}`;
//     }
//
//     return 'Mini-game is not active';
// });
</script>
