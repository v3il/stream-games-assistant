import { Timing } from '@shared/consts';
import { random } from 'lodash';
import { IMiniGameBaseServiceState, MessageSender, MiniGameBaseService } from '@twitch/core/modules';
import { Inject, Service } from 'typedi';
import { type HitsquadLocalSettingsService, localSettingsServiceToken } from '../../hitsquadInjectionTokens';
import { hitsquadConfig } from '../../hitsquadConfig';

interface IHitsquadGameState extends IMiniGameBaseServiceState {
    remainingRounds: number;
    totalRounds: number;
    isGameRunning: boolean;
}

@Service()
export class HitsquadGameService extends MiniGameBaseService<IHitsquadGameState> {
    readonly command = '!hitsquad';
    static readonly HITSQUAD_GAMES_PER_DAY = 2400;
    static readonly HITSQUAD_GAMES_ON_SCREEN = 12;

    private timeoutId!: number;

    constructor(
        @Inject(localSettingsServiceToken) private readonly localSettingsService: HitsquadLocalSettingsService,
        @Inject() messageSender: MessageSender
    ) {
        super({
            messageSender,
            initialState: {
                timeUntilMessage: 0,
                remainingRounds: 0,
                totalRounds: 0,
                isGameRunning: false
            }
        });
    }

    get isGameRunning() {
        return this.state.isGameRunning;
    }

    get remainingRounds() {
        return this.state.remainingRounds;
    }

    get totalRounds() {
        return this.state.totalRounds;
    }

    init() {
        this.state.remainingRounds = this.localSettingsService.settings.hitsquadRounds;

        if (this.shouldHandleGame) {
            this.start(this.state.remainingRounds);
        }
    }

    start(rounds: number) {
        this.state.remainingRounds = rounds;
        this.state.totalRounds = rounds;

        this.saveState();
        this.scheduleRound();
    }

    stop() {
        this.state.remainingRounds = 0;
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
            hitsquadRounds: this.state.remainingRounds
        });
    }

    protected get shouldHandleGame(): boolean {
        return this.state.isGameRunning && this.state.remainingRounds > 0;
    }

    protected getDelay() {
        return random(30 * Timing.SECOND, 2 * Timing.MINUTE) + hitsquadConfig.hitsquadGameBaseTimeout;
    }

    protected scheduleRound() {
        const delay = this.getDelay();

        this.state.timeUntilMessage = Date.now() + delay;

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
        this.state.remainingRounds -= HitsquadGameService.HITSQUAD_GAMES_ON_SCREEN;
        this.saveState();
    }
}
