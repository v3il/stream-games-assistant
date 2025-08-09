<template>
    <div class="max-w-[600px] rounded-xl ml-auto mr-auto fixed z-9999999 bg-[#f7f7f8] dark:bg-[#18181b] border sga-extension-root" :class="classes">
<!--        <TwitchWidget v-if="authFacade.isAuthenticated" />-->
<!--        <AuthView v-else />-->
        Ext
    </div>

<!--    <DebugMode v-if="authFacade.isAuthenticated" />-->
</template>

<script setup lang="ts">
// import { Container } from 'typedi';
// import { AuthFacade } from '@shared/modules';
// import AuthView from './AuthView.svelte';
// import TwitchWidget from './TwitchWidget.svelte';
// import { DebugMode } from './debugMode';
import { watchClassOnElement } from '@utils';
// import { ChestGameService, HitsquadGameService, LootGameService } from '@twitch/modules/miniGames';
// import { config } from '../config';
// import { localSettingsService } from '@twitch/modules';

// const authFacade = Container.get(AuthFacade);

const isDarkTheme = ref(false);

const classes = computed(() => ({
    dark: isDarkTheme.value
}));


// localSettingsService.loadSettings(`hgf-helper.twitch-settings-${config.twitchChannelName}`);

// const hitsquadGameService = new HitsquadGameService({ localSettingsService });
// const lootGameService = new LootGameService({ localSettingsService });
// const chestGameService = new ChestGameService({ localSettingsService });

// setContext('hitsquad', hitsquadGameService);
// setContext('loot', lootGameService);
// setContext('chest', chestGameService);

watchClassOnElement(document.documentElement, 'tw-root--theme-dark', (isDark) => {
    isDarkTheme.value = isDark;
});

// const startGameServices = () => {
//     hitsquadGameService.init();
//     lootGameService.init();
//     chestGameService.init();
// };
//
// if (authFacade.isAuthenticated) {
//     startGameServices();
// }
//
// authFacade.onLogin(() => {
//     startGameServices();
// });
//
// authFacade.onLogout(() => {
//     hitsquadGameService.destroy();
//     lootGameService.destroy();
//     chestGameService.destroy();
// });
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
