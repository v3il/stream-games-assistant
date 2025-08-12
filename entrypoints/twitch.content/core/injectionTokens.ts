import type { InjectionKey } from 'vue';
import {
    TwitchUIService,
    MessageSender,
    TwitchPlayerService,
    ChatObserver,
    StreamStatusService
} from './modules';
import { AuthFacade } from '@shared/modules';

export const InjectionTokens = {
    AUTH_FACADE: Symbol('AuthFacade') as InjectionKey<AuthFacade>,
    TWITCH_UI_SERVICE: Symbol('TwitchUiService') as InjectionKey<TwitchUIService>,
    TWITCH_PLAYER_SERVICE: Symbol('TwitchPlayerService') as InjectionKey<TwitchPlayerService>,
    MESSAGE_SENDER: Symbol('MessageSender') as InjectionKey<MessageSender>,
    CHAT_OBSERVER: Symbol('ChatObserver') as InjectionKey<ChatObserver>,
    STREAM_STATUS_SERVICE: Symbol('StreamStatusService') as InjectionKey<StreamStatusService>,
} as const;
