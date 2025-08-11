<template>
    <div class="flex justify-between items-center py-[10px] px-[16px] w-full rounded-xl">
        <!--    <MiniGamesControls />-->
        <!--    <StreamStatus />-->
    </div>
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
import { useDaCoinzCollector, useDelayRemover, useMentionsHighlighter } from '@twitch/core/composables';
import { InjectionTokens } from '@twitch/injectionTokens';

const localSettingsService = new LocalSettingsService<IHitsquadLocalSettings>({
    hitsquadRounds: 0,
    lootGame: false,
    chestGame: false
});

Container.set(localSettingsServiceToken, localSettingsService);

provide(InjectionTokens.CHAT_OBSERVER, Container.get(HitsquadChatObserver));
provide(InjectionTokens.STREAM_STATUS_SERVICE, Container.get(HitsquadStreamStatusService));
provide(HitsquadInjectionTokens.CHEST_GAME_SERVICE, Container.get(ChestGameService));
provide(HitsquadInjectionTokens.LOOT_GAME_SERVICE, Container.get(LootGameService));
provide(HitsquadInjectionTokens.HITSQUAD_GAME_SERVICE, Container.get(HitsquadGameService));

useDelayRemover();
useDaCoinzCollector();
useMentionsHighlighter();
</script>
