import { UnsubscribeTrigger } from '@shared/EventEmitter';
import { InjectionTokens } from '../injectionTokens';

export const useMentionsHighlighter = () => {
    // const settingsFacade = Container.get(SettingsFacade);
    const chatObserver = inject(InjectionTokens.CHAT_OBSERVER)!;

    console.error(chatObserver)

    let destroyChatObserver: UnsubscribeTrigger | undefined;

    // if (settingsFacade.settings.highlightMentions) {
        initChatObserver();
    // }

    // const destroySettingObserver = settingsFacade.onSettingChanged('highlightMentions', (isEnabled) => {
    //     isEnabled ? initChatObserver() : destroyChatObserver?.();
    // });

    function initChatObserver() {
        destroyChatObserver = chatObserver.observeChat(({ messageWrapperEl, hasMyMention }) => {
            if (hasMyMention) {
                messageWrapperEl.style.backgroundColor = 'darkred';
            }
        });
    }

    onUnmounted(() => {
        destroyChatObserver?.();
        // destroySettingObserver();
    })
}
