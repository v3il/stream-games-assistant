import { Timing } from '@shared/consts';
import { UnsubscribeTrigger } from '@shared/EventEmitter';
import { random } from 'lodash';
import { MessageSender, MiniGameBaseService } from '@twitch/core/modules';
import { Inject, Service } from 'typedi';
import { HitsquadStreamStatusService } from '../stream';
import { type HitsquadLocalSettingsService, localSettingsServiceToken } from '../../hitsquadInjectionTokens';

@Service()
export class ChestGameService extends MiniGameBaseService {
    readonly command = '!chest';

    private timeoutId!: number;
    private unsubscribe!: UnsubscribeTrigger;

    isGamePhase = false;
    isGameEnabled = false;
    isRoundRunning = false;

    constructor(
        @Inject(localSettingsServiceToken) private readonly localSettingsService: HitsquadLocalSettingsService,
        @Inject() private readonly streamStatusService: HitsquadStreamStatusService,
        @Inject() messageSender: MessageSender
    ) {
        super({ messageSender });
    }

    init() {
        this.isGameEnabled = this.localSettingsService.settings.chestGame;
        this.isGamePhase = this.streamStatusService.isChestGame;

        this.unsubscribe = this.streamStatusService.events.on('chest', (isGamePhase?: boolean) => {
            this.isGamePhase = !!isGamePhase;

            if (this.shouldHandleGame) {
                this.scheduleRound();
            }
        });
    }

    start() {
        this.isGameEnabled = true;
        this.saveState();
    }

    stop() {
        this.isRoundRunning = false;
        this.isGameEnabled = false;

        this.saveState();
        clearTimeout(this.timeoutId);
    }

    destroy() {
        this.stop();
        this.unsubscribe?.();
    }

    protected get shouldHandleGame() {
        return this.isGameEnabled && this.isGamePhase;
    }

    protected buildCommand() {
        return `${this.command}${random(1, 8)}`;
    }

    protected saveState() {
        this.localSettingsService.updateSettings({
            chestGame: this.isGameEnabled
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

        this.timeUntilMessage = Date.now() + delay;
        this.isRoundRunning = true;

        this.timeoutId = window.setTimeout(async () => {
            await this.processRound();
            this.isRoundRunning = false;
        }, delay);
    }
}
