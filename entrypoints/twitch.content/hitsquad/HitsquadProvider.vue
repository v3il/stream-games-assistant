<template>
    <slot />
</template>

<script setup lang="ts">
import { Container } from 'typedi';
import { LocalSettingsService } from '@shared/services';
import { HitsquadInjectionTokens, type IHitsquadLocalSettings, localSettingsServiceToken } from './hitsquadInjectionTokens';
import {
    ChestGameService,
    HitsquadChatObserver,
    HitsquadGameService,
    HitsquadStreamStatusService,
    LootGameService
} from './modules';
import { channelName, InjectionTokens } from '../core';

const localSettingsKey = `sga-local-settings.${channelName}`;

const localSettingsService = new LocalSettingsService<IHitsquadLocalSettings>(localSettingsKey, {
    hitsquadRounds: 0,
    lootGame: false,
    chestGame: false
});

Container.set(localSettingsServiceToken, localSettingsService);

const chestGameService = Container.get(ChestGameService);
const hitsquadGameService = Container.get(HitsquadGameService);
const lootGameService = Container.get(LootGameService);

const startGameServices = () => {
    // hitsquadGameService.init();
    // lootGameService.init();
    chestGameService.init();
};

startGameServices();

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

provide(InjectionTokens.CHAT_OBSERVER, Container.get(HitsquadChatObserver));
provide(InjectionTokens.STREAM_STATUS_SERVICE, Container.get(HitsquadStreamStatusService));
provide(HitsquadInjectionTokens.CHEST_GAME_SERVICE, chestGameService);
provide(HitsquadInjectionTokens.LOOT_GAME_SERVICE, lootGameService);
provide(HitsquadInjectionTokens.HITSQUAD_GAME_SERVICE, hitsquadGameService);
</script>
