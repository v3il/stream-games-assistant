import { EventEmitter } from '@shared/EventEmitter';
import { Container, Service } from 'typedi';
import { TwitchUIService } from '@twitch/modules';

export interface IChatMessage {
    messageWrapperEl: HTMLElement;
    userName: string;
    message: string;
    hasMyMention: boolean;
}

@Service()
export class ChatObserver {
    private readonly twitchUIService!: TwitchUIService;

    readonly events;
    private observer;

    constructor() {
        this.twitchUIService = Container.get(TwitchUIService);

        this.events = EventEmitter.create<{
            message: IChatMessage;
        }>();

        this.observer = this.createObserver();
        this.observer.observe(this.twitchUIService.chatScrollableAreaEl!, { childList: true });
    }

    observeChat(callback: (message: IChatMessage) => void) {
        return this.events.on('message', (message) => callback(message!));
    }

    private createObserver() {
        return new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((addedElement) => {
                    this.processAddedElement(addedElement as HTMLElement);
                });
            });
        });
    }

    private processAddedElement(addedElement: HTMLElement) {
        const messageWrapperEl = addedElement.querySelector?.<HTMLElement>('.chat-line__message');

        if (!messageWrapperEl) {
            return;
        }

        const userNameEl = messageWrapperEl.querySelector('[data-a-target="chat-message-username"]');
        const messageEl = messageWrapperEl.querySelector('[data-a-target="chat-message-text"]');

        if (!(userNameEl && messageEl)) {
            return;
        }

        const mentionEl = messageWrapperEl.querySelector('[data-a-target="chat-message-mention"]');

        const userName = userNameEl.textContent!.toLowerCase();
        const message = messageEl!.textContent!.toLowerCase().trim();
        const hasMyMention = mentionEl?.textContent?.toLowerCase().trim() === this.twitchUIService.twitchUserName;

        this.events.emit('message', {
            messageWrapperEl,
            userName,
            hasMyMention,
            message
        });
    }
}
