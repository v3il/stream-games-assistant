import { debounce } from 'lodash';
import { InjectionTokens } from '../injectionTokens';

export const useDaCoinzCollector = () => {
    let observer: MutationObserver | null = null;
    // const settingsFacade = Container.get(SettingsFacade);
    const twitchUIService = inject(InjectionTokens.TWITCH_UI_SERVICE)!;
    const chatInputContainerEl = twitchUIService.chatButtonsContainerEl! as HTMLElement;

    const claimChannelPoints = debounce(() => {
        const claimButtonEl = chatInputContainerEl.querySelector<HTMLButtonElement>('[aria-label="Claim Bonus"]');

        if (claimButtonEl) {
            claimButtonEl.click();
        }
    }, 2000);

    // if (settingsFacade.settings.collectDaCoinz) {
        init();
    // }

    // const unsubscribe = settingsFacade.onSettingChanged('collectDaCoinz', (isEnabled) => {
    //     isEnabled ? init() : destroy();
    // });

    function createObserver() {
        return new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    claimChannelPoints();
                }
            });
        });
    }

    function init() {
        observer = createObserver();
        observer.observe(chatInputContainerEl, { childList: true, subtree: true });
        claimChannelPoints();
    }

    function destroy() {
        observer?.disconnect();
    }

    onUnmounted(() => {
        destroy();
        // unsubscribe();
    });
};
