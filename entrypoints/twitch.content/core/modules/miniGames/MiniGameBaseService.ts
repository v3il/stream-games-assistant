import { MessageSender } from '../chat';
import { random } from 'lodash';
import { Timing } from '@shared/consts';

interface IMiniGameBaseServiceOptions<S extends IMiniGameBaseServiceState> {
    messageSender: MessageSender;
    initialState: S;
}

export interface IMiniGameBaseServiceState {
    timeUntilMessage: number;
}

export abstract class MiniGameBaseService<S extends IMiniGameBaseServiceState> {
    abstract readonly command: string;

    protected readonly messageSender: MessageSender;

    protected state: S;

    constructor({ messageSender, initialState }: IMiniGameBaseServiceOptions<S>) {
        this.messageSender = messageSender;
        this.state = reactive(initialState) as S;
    }

    get timeUntilMessage() {
        return this.state.timeUntilMessage;
    }

    sendCommand() {
        this.messageSender.sendMessage(this.buildCommand());
    }

    abstract init(): void;
    abstract stop(): void;
    abstract destroy(): void;

    protected get shouldHandleGame() {
        return false;
    }

    protected get isMiniGamesBotWorking() {
        return true;
    }

    protected get isMiniGamesAllowed() {
        return true;
    }

    protected abstract completeRound(): void;
    protected abstract buildCommand(): string;
    protected abstract getDelay(): number;
    protected abstract saveState(): void;
    protected abstract scheduleRound(): void;

    protected async processRound() {
        if (!this.isMiniGamesBotWorking) {
            return;
        }

        while (!this.isMiniGamesAllowed) {
            const delay = random(10 * Timing.SECOND, 30 * Timing.SECOND);

            this.state.timeUntilMessage = Date.now() + delay;

            while (Date.now() < this.timeUntilMessage) {
                if (!this.shouldHandleGame) {
                    return;
                }

                await wait(Timing.SECOND);
            }
        }

        if (!this.shouldHandleGame) {
            return;
        }

        this.completeRound();
    }
}
