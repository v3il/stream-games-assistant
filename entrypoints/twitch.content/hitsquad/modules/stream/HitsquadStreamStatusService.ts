import { Inject, Service } from 'typedi';
import { EventEmitter } from '@shared/EventEmitter';
import { rightAntiCheatChecks, leftAntiCheatChecks, chestGameChecks, brunoChestGameChecks, lootGameChecks } from './checks';
import { OffscreenStreamRenderer, StreamStatusService, TwitchUIService } from '@twitch/core/modules';
import { hitsquadConfig } from '../../hitsquadConfig';
import { HitsquadChatObserver } from '@twitch/hitsquad/modules/chat';
import { ColorService } from '@shared/services';

@Service()
export class HitsquadStreamStatusService extends StreamStatusService {
    private lastRewardTimestamp: number = Date.now();

    isLootGame = false;
    isAntiCheat = false;
    isChestGame = false;
    isBotWorking = true;
    isStreamOk = true;

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
            colorService
        });

        this.listenEvents();
    }

    get isMiniGamesAllowed() {
        return this.isBotWorking && !this.isAntiCheat && this.isStreamOk;
    }

    checkStreamStatus() {
        super.checkStreamStatus();

        this.isBotWorking = (Date.now() - this.lastRewardTimestamp) < hitsquadConfig.miniGamesBotDowntime;

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

        this.isAntiCheat = (matchedChecks / points.length) >= 0.5;

        if (previousStatus !== this.isAntiCheat && !silent) {
            this.events.emit('antiCheat', this.isAntiCheat);
        }
    }

    private checkLootGame(silent: boolean = false) {
        const previousStatus = this.isLootGame;

        this.isLootGame = lootGameChecks.some((checks) => {
            const matchedChecks = this.checkPoints(checks);
            return (matchedChecks / checks.length) >= 0.85;
        });

        if (previousStatus !== this.isLootGame && !silent) {
            this.events.emit('loot', this.isLootGame);
        }
    }

    private checkChestGame(silent: boolean = false) {
        const previousStatus = this.isChestGame;
        const points = hitsquadConfig.twitchChannelName === 'hitsquadbruno' ? brunoChestGameChecks : chestGameChecks;
        const matchedChecks = this.checkPoints(points);

        this.isChestGame = (matchedChecks / points.length) >= 0.85;

        if (previousStatus !== this.isChestGame && !silent) {
            this.events.emit('chest', this.isChestGame);
        }
    }
}
