import { MiniGameBaseService, StreamStatusService } from '@twitch/core';
import { HitsquadStreamStatusService } from '@twitch/hitsquad/modules';

interface IUseHitsquadMiniGame {
    streamStatusService: HitsquadStreamStatusService;
    gameService: MiniGameBaseService
}

export const useHitsquadMiniGame = ({}: IUseHitsquadMiniGame) => {

    const isSendEnabled = $derived(streamStatusService.isMiniGamesAllowed && gameService.isGamePhase);

    const sendCommand = () => gameService.sendCommand();
    const toggle = (isEnabled: boolean) => isEnabled ? gameService.start() : gameService.stop();

}
