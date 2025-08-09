import { EventEmitter } from '@shared/EventEmitter';
import { Container, Service } from 'typedi';
import { config } from '@twitch/config';
import { ChatObserver, IChatMessage } from '@twitch/core/modules';

export interface IHitsquadMessage extends IChatMessage {
    isSystemMessage: boolean;
    isReward: boolean;
}

@Service()
export class HitsquadChatObserver {
    private readonly chatObserver!: ChatObserver;

    readonly events = EventEmitter.create<{
        message: IHitsquadMessage;
    }>();

    constructor() {
        this.chatObserver = Container.get(ChatObserver);

        this.chatObserver.observeChat((chatMessage: IChatMessage) => {
            const isSystemMessage = chatMessage.userName === config.twitchAdminName;
            const isReward = isSystemMessage && this.isRewardMessage(chatMessage.message);

            this.events.emit('message', {
                ...chatMessage,
                isSystemMessage,
                isReward
            });
        });
    }

    observeChat(callback: (message: IHitsquadMessage) => void) {
        return this.events.on('message', (message) => callback(message!));
    }

    private isRewardMessage(message: string): boolean {
        return /has been sent \d+ clams!/i.test(message);
    }
}
