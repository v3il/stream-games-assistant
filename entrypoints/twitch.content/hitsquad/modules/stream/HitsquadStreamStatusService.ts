import { Inject, Service } from 'typedi';
import { EventEmitter } from '@shared/EventEmitter';
import { rightAntiCheatChecks, leftAntiCheatChecks, chestGameChecks, brunoChestGameChecks, lootGameChecks } from './checks';
import { OffscreenStreamRenderer, StreamStatusService, IStreamStatusServiceState, TwitchUIService } from '@twitch/core/modules';
import { hitsquadConfig } from '../../hitsquadConfig';
import { HitsquadChatObserver } from '../chat';
import { ColorService } from '@shared/services';

interface IHitsquadStreamStatusServiceState extends IStreamStatusServiceState {
    isLootGame: boolean;
    isAntiCheat: boolean;
    isChestGame: boolean;
    isBotWorking: boolean;
}

@Service()
export class HitsquadStreamStatusService extends StreamStatusService<IHitsquadStreamStatusServiceState> {
    private lastRewardTimestamp: number = Date.now();

    readonly events = new EventEmitter<{
        loot: boolean,
        chest: boolean,
        antiCheat: boolean,
    }>();

    constructor(
        @Inject() offscreenStreamRenderer: OffscreenStreamRenderer,
        @Inject() twitchUIService: TwitchUIService,
        @Inject() colorService: ColorService,
        @Inject() private readonly chatObserver: HitsquadChatObserver
    ) {
        super({
            offscreenStreamRenderer,
            twitchUIService,
            colorService,
            initialState: {
                isStreamOk: true,
                isLootGame: false,
                isAntiCheat: false,
                isChestGame: false,
                isBotWorking: true,
            }
        });

        this.listenEvents();
    }

    get isLootGame(): boolean {
        return this.state.isLootGame;
    }

    get isChestGame(): boolean {
        return this.state.isChestGame;
    }

    get isBotWorking(): boolean {
        return this.state.isBotWorking;
    }

    get isAntiCheat(): boolean {
        return this.state.isAntiCheat;
    }

    get isMiniGamesAllowed() {
        return super.isMiniGamesAllowed && this.isBotWorking && !this.isAntiCheat;
    }

    checkStreamStatus() {
        super.checkStreamStatus();

        this.state.isBotWorking = (Date.now() - this.lastRewardTimestamp) < hitsquadConfig.miniGamesBotDowntime;

        this.checkAntiCheat();

        if (this.isAntiCheat) {
            return;
        }

        this.checkLootGame();
        this.checkChestGame();
    }

    private listenEvents() {
        this.chatObserver.observeChat(({ isReward }) => {
            if (isReward) {
                this.lastRewardTimestamp = Date.now();
            }
        });
    }

    private checkAntiCheat(silent: boolean = false) {
        const previousStatus = this.isAntiCheat;

        const points = ['hitsquadbruno', 'hitsquadvito'].includes(hitsquadConfig.twitchChannelName)
            ? leftAntiCheatChecks
            : rightAntiCheatChecks;

        const matchedChecks = this.checkPoints(points);

        this.state.isAntiCheat = (matchedChecks / points.length) >= 0.5;

        if (previousStatus !== this.isAntiCheat && !silent) {
            this.events.emit('antiCheat', this.isAntiCheat);
        }
    }

    private checkLootGame(silent: boolean = false) {
        const previousStatus = this.state.isLootGame;

        this.state.isLootGame = lootGameChecks.some((checks) => {
            const matchedChecks = this.checkPoints(checks);
            return (matchedChecks / checks.length) >= 0.85;
        });

        if (previousStatus !== this.state.isLootGame && !silent) {
            this.events.emit('loot', this.state.isLootGame);
        }
    }

    private checkChestGame(silent: boolean = false) {
        const previousStatus = this.state.isChestGame;
        const points = hitsquadConfig.twitchChannelName === 'hitsquadbruno' ? brunoChestGameChecks : chestGameChecks;
        const matchedChecks = this.checkPoints(points);

        this.state.isChestGame = (matchedChecks / points.length) >= 0.85;

        if (previousStatus !== this.state.isChestGame && !silent) {
            this.events.emit('chest', this.state.isChestGame);
        }
    }
}
