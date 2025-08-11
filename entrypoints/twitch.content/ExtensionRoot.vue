<template>
    <div class="max-w-[600px] rounded-xl ml-auto mr-auto fixed z-9999999 bg-[#f7f7f8] dark:bg-[#18181b] border sga-extension-root" :class="classes">
        <component :is="WidgetComponent" v-if="true" />
<!--        <AuthView v-else />-->
    </div>

<!--    <DebugMode v-if="authFacade.isAuthenticated" />-->
</template>

<script setup lang="ts">
// import { Container } from 'typedi';
// import { AuthFacade } from '@shared/modules';
// import AuthView from './AuthView.svelte';
// import { DebugMode } from './debugMode';

import { AsyncHitsquadWidget } from './hitsquad';
// import { AsyncStaggerrillaWidget } from './staggerrilla';

// const authFacade = Container.get(AuthFacade);

const props = defineProps<{
    channelName: string;
}>();

const isDarkTheme = ref(false);

const classes = computed(() => ({
    dark: isDarkTheme.value
}));

const WidgetComponent = computed(() => {
    return /*props.channelName === 'staggerrilla' && false ? AsyncStaggerrillaWidget :*/ AsyncHitsquadWidget;
});

watchClassOnElement(document.documentElement, 'tw-root--theme-dark', (isDark) => {
    isDarkTheme.value = isDark;
});
</script>

<style>
.sga-extension-root {
    right: calc(34rem + 20px);
    left: 70px;
    bottom: 16px;
    border-color: #bf94ff;
    box-shadow: 0 0 6px #bf94ff, 0 0 12px #757e8a66;
}

@media (max-width: 920px) {
    .sga-extension-root {
        right: 20px !important;
    }
}
</style>
