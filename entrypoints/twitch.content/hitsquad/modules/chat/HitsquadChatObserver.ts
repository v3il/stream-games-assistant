import { Service } from 'typedi';
import { ChatObserver, IChatMessage } from '@twitch/core/modules';
import { hitsquadConfig } from '../../hitsquadConfig';

export interface IHitsquadMessage extends IChatMessage {
    isSystemMessage: boolean;
    isReward: boolean;
}

@Service()
export class HitsquadChatObserver extends ChatObserver<IHitsquadMessage> {
    protected buildMessage(chatMessage: IChatMessage): IHitsquadMessage {
        const isSystemMessage = chatMessage.userName === hitsquadConfig.twitchAdminName;
        const isReward = isSystemMessage && this.isRewardMessage(chatMessage.message);

        return {
            ...chatMessage,
            isSystemMessage,
            isReward
        };
    }

    private isRewardMessage(message: string): boolean {
        return /has been sent \d+ clams!/i.test(message);
    }
}
