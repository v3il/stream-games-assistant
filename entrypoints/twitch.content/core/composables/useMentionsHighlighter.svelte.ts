// import { Container } from 'typedi';
// import { SettingsFacade } from '@shared/modules';
// import { ChatObserver } from '../modules/ChatObserver';
import { UnsubscribeTrigger } from '@shared/EventEmitter';
import { onDestroy } from 'svelte';
import { InjectionTokens } from '../../injectionTokens';

export const useMentionsHighlighter = () => {
    // const settingsFacade = Container.get(SettingsFacade);
    const chatObserver = inject(InjectionTokens.CHAT_OBSERVER)!;

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

    onDestroy(() => {
        destroyChatObserver?.();
        // destroySettingObserver();
    })
}
