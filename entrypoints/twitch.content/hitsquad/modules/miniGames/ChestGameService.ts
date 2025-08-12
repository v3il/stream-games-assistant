import { Timing } from '@shared/consts';
import { UnsubscribeTrigger } from '@shared/EventEmitter';
import { random } from 'lodash';
import { MessageSender, MiniGameBaseService, IMiniGameBaseServiceState } from '@twitch/core/modules';
import { Inject, Service } from 'typedi';
import { HitsquadStreamStatusService } from '../stream';
import { type HitsquadLocalSettingsService, localSettingsServiceToken } from '../../hitsquadInjectionTokens';

interface IChestGameState extends IMiniGameBaseServiceState {
    isGamePhase: boolean;
    isGameEnabled: boolean;
    isRoundRunning: boolean;
}

@Service()
export class ChestGameService extends MiniGameBaseService<IChestGameState> {
    readonly command = '!chest';

    private timeoutId!: number;
    private unsubscribe!: UnsubscribeTrigger;

    constructor(
        @Inject(localSettingsServiceToken) private readonly localSettingsService: HitsquadLocalSettingsService,
        @Inject() private readonly streamStatusService: HitsquadStreamStatusService,
        @Inject() messageSender: MessageSender
    ) {
        super({
            messageSender,
            initialState: {
                timeUntilMessage: 0,
                isGamePhase: false,
                isGameEnabled: false,
                isRoundRunning: false
            }
        });
    }

    get isGamePhase() {
        return this.state.isGamePhase;
    }

    get isGameEnabled() {
        return this.state.isGameEnabled;
    }

    get isRoundRunning() {
        return this.state.isRoundRunning;
    }

    init() {
        this.state.isGameEnabled = this.localSettingsService.settings.chestGame;
        this.state.isGamePhase = this.streamStatusService.isChestGame;

        this.unsubscribe = this.streamStatusService.events.on('chest', (isGamePhase?: boolean) => {
            this.state.isGamePhase = !!isGamePhase;

            if (this.shouldHandleGame) {
                this.scheduleRound();
            }
        });
    }

    start() {
        this.state.isGameEnabled = true;
        this.saveState();
    }

    stop() {
        this.state.isRoundRunning = false;
        this.state.isGameEnabled = false;

        this.saveState();
        clearTimeout(this.timeoutId);
    }

    toggle() {
        this.isGameEnabled ? this.stop() : this.start();
    }

    destroy() {
        this.stop();
        this.unsubscribe?.();
    }

    protected get shouldHandleGame() {
        return this.isGameEnabled && this.isGamePhase;
    }

    protected get isBotWorking(): boolean {
        return this.streamStatusService.isBotWorking;
    }

    protected buildCommand() {
        return `${this.command}${random(1, 8)}`;
    }

    protected saveState() {
        this.localSettingsService.updateSettings({
            chestGame: this.state.isGameEnabled
        });
    }

    protected getDelay() {
        return random(30 * Timing.SECOND, 4 * Timing.MINUTE);
    }

    protected completeRound() {
        this.sendCommand();
    }

    protected scheduleRound() {
        const delay = this.getDelay();

        this.state.timeUntilMessage = Date.now() + delay;
        this.state.isRoundRunning = true;

        this.timeoutId = window.setTimeout(async () => {
            await this.processRound();
            this.state.isRoundRunning = false;
        }, delay);
    }
}
