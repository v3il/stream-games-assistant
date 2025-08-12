<template>
    <MiniGamesControlsItem
        name="Chest"
        :isGameActive="gameService.isGameEnabled"
        :isSendEnabled
        :sendButtonTooltip
        @send="gameService.sendCommand()"
        @toggle="gameService.toggle()"
    >
        <template #icon="{ classes }">
            <Boxes :size="16" :class="classes" />
        </template>

        <template #indicators v-if="gameService.isRoundRunning">
            <MiniGamesControlsIndicators>
                <MiniGamesControlsTimer :timeout="gameService.timeUntilMessage" />
            </MiniGamesControlsIndicators>
        </template>
    </MiniGamesControlsItem>
</template>

<script setup lang="ts">
import { Boxes } from 'lucide-vue-next';
import { MiniGamesControlsItem, MiniGamesControlsIndicators, MiniGamesControlsTimer } from '@twitch/core';
import { InjectionTokens } from '@twitch/core/injectionTokens';
import { HitsquadStreamStatusService } from '@twitch/hitsquad/modules';
import { HitsquadInjectionTokens } from '@twitch/hitsquad/hitsquadInjectionTokens';

const streamStatusService = inject<HitsquadStreamStatusService>(InjectionTokens.STREAM_STATUS_SERVICE)!;
const gameService = inject(HitsquadInjectionTokens.CHEST_GAME_SERVICE)!;

const isSendEnabled = computed(() => streamStatusService.isMiniGamesAllowed && gameService.isGamePhase || true);

const sendButtonTooltip = computed(() => {
    const disabledMiniGamesNote = 'Mini-game commands are disabled';

    if (streamStatusService.isAntiCheat) {
        return `Anti-cheat is active. ${disabledMiniGamesNote}`;
    }

    if (!streamStatusService.isStreamOk) {
        return `Stream is broken. ${disabledMiniGamesNote}`;
    }

    if (!streamStatusService.isBotWorking) {
        return `Mini-games bot is not working. ${disabledMiniGamesNote}`;
    }

    if (isSendEnabled.value) {
        return `Send ${gameService.command}`;
    }

    return 'Mini-game is not active';
});
</script>
