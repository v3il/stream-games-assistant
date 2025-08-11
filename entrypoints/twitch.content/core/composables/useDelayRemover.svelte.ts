import { Timing } from '@shared/consts';
import { InjectionTokens } from '../../injectionTokens';

export const useDelayRemover = () => {
    let intervalId: number;

    // const settingsFacade = Container.get(SettingsFacade);
    const playerService = inject(InjectionTokens.TWITCH_PLAYER_SERVICE)!;

    // if (settingsFacade.settings.decreaseStreamDelay) {
        init();
    // }

    // const unsubscribe = settingsFacade.onSettingChanged('decreaseStreamDelay', (isEnabled) => {
    //     isEnabled ? init() : destroy();
    // });

    function init() {
        playerService.decreaseVideoDelay();

        intervalId = window.setInterval(() => {
            playerService.decreaseVideoDelay();
        }, 3 * Timing.MINUTE);
    }

    function destroy() {
        clearInterval(intervalId);
    }

    onUnmounted(() => {
        destroy();
        // unsubscribe();
    });
};
