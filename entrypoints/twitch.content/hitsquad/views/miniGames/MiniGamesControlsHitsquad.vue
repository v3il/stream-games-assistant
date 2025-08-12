<template>
    <MiniGamesControlsItem
        name="Giveaways"
        :isGameActive="gameService.isGameRunning"
        :isSendEnabled
        :sendButtonTooltip
        @send="gameService.sendCommand()"
        @toggle="toggle"
    >
        <template #icon="{ classes }">
            <Gift :size="16" :class="classes" />
        </template>

        <template #indicators v-if="gameService.isGameRunning">
            <MiniGamesControlsIndicators>
                <MiniGamesControlsTimer :timeout="gameService.timeUntilMessage" />
                |
                {{ gameService.remainingRounds }}/{{ gameService.totalRounds }}
            </MiniGamesControlsIndicators>
        </template>
    </MiniGamesControlsItem>
</template>

<script setup lang="ts">
import { Gift } from 'lucide-vue-next';
import { MiniGamesControlsItem, MiniGamesControlsIndicators, MiniGamesControlsTimer } from '@twitch/core';
import { InjectionTokens } from '@twitch/core/injectionTokens';
import { HitsquadGameService, HitsquadStreamStatusService } from '@twitch/hitsquad/modules';
import { HitsquadInjectionTokens } from '@twitch/hitsquad/hitsquadInjectionTokens';

const streamStatusService = inject<HitsquadStreamStatusService>(InjectionTokens.STREAM_STATUS_SERVICE)!;
const gameService = inject(HitsquadInjectionTokens.HITSQUAD_GAME_SERVICE)!;

const isSendEnabled = computed(() => streamStatusService.isMiniGamesAllowed);

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

function toggle(isEnabled: boolean) {
    if (!isEnabled) {
        return gameService.stop();
    }

    const gamesCount = prompt('Enter rounds count', `${HitsquadGameService.HITSQUAD_GAMES_PER_DAY}`);
    const numericGamesCount = Number(gamesCount);

    if (!gamesCount || Number.isNaN(numericGamesCount) || numericGamesCount <= 0) {
        return;
    }

    gameService.start(numericGamesCount);
}
</script>




<!--<MiniGamesControlsItem-->
<!--    isGameActive={gameService.isGameRunning}-->
<!--    isSendEnabled={streamStatusService.isMiniGamesAllowed}-->
<!--    Icon={Gift}-->
<!--    command={gameService.command}-->
<!--    name="Giveaways"-->
<!--    {toggle}-->
<!--    {sendCommand}-->
<!--&gt;-->
<!--    {#snippet indicators()}-->
<!--        {#if gameService.isGameRunning}-->
<!--            <MiniGamesControlsIndicators>-->
<!--                <MiniGamesControlsTimer timeout={gameService.timeUntilMessage} />-->
<!--                |-->
<!--                {gameService.remainingRounds}/{gameService.totalRounds}-->
<!--            </MiniGamesControlsIndicators>-->
<!--        {/if}-->
<!--    {/snippet}-->
<!--</MiniGamesControlsItem>-->

<!--<script lang="ts">-->
<!--import MiniGamesControlsItem from './MiniGamesControlsItem.svelte';-->
<!--import MiniGamesControlsIndicators from './MiniGamesControlsIndicators.svelte';-->
<!--import MiniGamesControlsTimer from './MiniGamesControlsTimer.svelte';-->
<!--import { Container } from 'typedi';-->
<!--import { StreamStatusService } from '@twitch/modules/stream';-->
<!--import { getContext } from 'svelte';-->
<!--import { HitsquadGameService } from '@twitch/modules/miniGames';-->
<!--import { Gift } from '@lucide/svelte';-->

<!--const streamStatusService = Container.get(StreamStatusService);-->
<!--const gameService = getContext<HitsquadGameService>('hitsquad');-->

<!--const sendCommand = () => gameService.sendCommand();-->

<!--function toggle(isEnabled: boolean) {-->
<!--    if (!isEnabled) {-->
<!--        return gameService.stop();-->
<!--    }-->

<!--    const gamesCount = prompt('Enter rounds count', `${HitsquadGameService.HITSQUAD_GAMES_PER_DAY}`);-->
<!--    const numericGamesCount = Number(gamesCount);-->

<!--    if (!gamesCount || Number.isNaN(numericGamesCount) || numericGamesCount <= 0) {-->
<!--        return;-->
<!--    }-->

<!--    gameService.start(numericGamesCount);-->
<!--}-->
<!--</script>-->
