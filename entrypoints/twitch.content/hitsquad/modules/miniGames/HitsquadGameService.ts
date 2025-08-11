import { Timing } from '@shared/consts';
import { random } from 'lodash';
import { MessageSender, MiniGameBaseService } from '@twitch/core/modules';
import { Inject, Service } from 'typedi';
import { type HitsquadLocalSettingsService, localSettingsServiceToken } from '../../hitsquadInjectionTokens';
import { hitsquadConfig } from '../../hitsquadConfig';

@Service()
export class HitsquadGameService extends MiniGameBaseService {
    readonly command = '!hitsquad';
    static readonly HITSQUAD_GAMES_PER_DAY = 2400;
    static readonly HITSQUAD_GAMES_ON_SCREEN = 12;

    remainingRounds = 0;
    totalRounds = 0;
    isGameRunning = this.remainingRounds > 0;

    private timeoutId!: number;

    constructor(
        @Inject(localSettingsServiceToken) private readonly localSettingsService: HitsquadLocalSettingsService,
        @Inject() messageSender: MessageSender
    ) {
        super({ messageSender });
    }

    init() {
        this.remainingRounds = this.localSettingsService.settings.hitsquadRounds;

        if (this.shouldHandleGame) {
            this.start(this.remainingRounds);
        }
    }

    start(rounds: number) {
        this.remainingRounds = rounds;
        this.totalRounds = rounds;

        this.saveState();
        this.scheduleRound();
    }

    stop() {
        this.remainingRounds = 0;
        this.saveState();

        clearTimeout(this.timeoutId);
    }

    buildCommand() {
        return this.command;
    }

    destroy() {
        this.stop();
    }

    protected saveState() {
        this.localSettingsService.updateSettings({
            hitsquadRounds: this.remainingRounds
        });
    }

    protected get shouldHandleGame(): boolean {
        return this.isGameRunning && this.remainingRounds > 0;
    }

    protected getDelay() {
        return random(30 * Timing.SECOND, 2 * Timing.MINUTE) + hitsquadConfig.hitsquadGameBaseTimeout;
    }

    protected scheduleRound() {
        const delay = this.getDelay();

        this.timeUntilMessage = Date.now() + delay;

        this.timeoutId = window.setTimeout(async () => {
            await this.processRound();

            if (this.shouldHandleGame) {
                this.scheduleRound();
            } else {
                this.stop();
            }
        }, delay);
    }

    protected completeRound() {
        this.sendCommand();
        this.remainingRounds -= HitsquadGameService.HITSQUAD_GAMES_ON_SCREEN;
        this.saveState();
    }
}
