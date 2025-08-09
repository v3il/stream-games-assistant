import { Container } from 'typedi';
import { TwitchUIService } from '../../TwitchUIService';
import { ColorService } from '@shared/services';
import { Timing } from '@shared/consts';
import type { ICheckPoint } from './ICheckPoint';
import { blackScreenChecks } from './blackScreenChecks';
import { OffscreenStreamRenderer } from '../OffscreenStreamRenderer';

export class StreamStatusService {
    private readonly offscreenStreamRenderer!: OffscreenStreamRenderer;
    private readonly twitchUIService!: TwitchUIService;
    private readonly colorService!: ColorService;

    private timeoutId!: number;
    private streamReloadTimeoutId!: number;

    isStreamOk = true;

    constructor() {
        this.offscreenStreamRenderer = Container.get(OffscreenStreamRenderer);
        this.twitchUIService = Container.get(TwitchUIService);
        this.colorService = Container.get(ColorService);

        this.checkStreamStatus();

        this.timeoutId = window.setInterval(() => {
            this.checkStreamStatus();
        }, 3 * Timing.SECOND);
    }

    get isMiniGamesAllowed() {
        return this.isStreamOk;
    }

    checkStreamStatus() {
        const { activeVideoEl } = this.twitchUIService;

        if (!activeVideoEl || activeVideoEl.paused || activeVideoEl.ended || this.isBlackScreen()) {
            this.isStreamOk = false;

            if (!this.streamReloadTimeoutId) {
                this.streamReloadTimeoutId = window.setTimeout(() => {
                    window.location.reload();
                }, Timing.MINUTE);
            }

            logDev('Video is broken');
            return;
        }

        clearTimeout(this.streamReloadTimeoutId);
        this.streamReloadTimeoutId = 0;

        this.isStreamOk = true;
    }

    private checkPoints(points: ICheckPoint[]): number {
        const checksResults = points.map(({ xPercent, yPercent, color }) => {
            const pixelHexColor = this.offscreenStreamRenderer.getColorAtPointPercent(xPercent, yPercent);

            return this.colorService.getColorsSimilarity(color, pixelHexColor);
        });

        const matchedChecks = checksResults.filter((similarity) => similarity >= 0.85);

        return matchedChecks.length;
    }

    private isBlackScreen() {
        const matchedChecks = this.checkPoints(blackScreenChecks);

        return (matchedChecks / blackScreenChecks.length) >= 0.85;
    }
}
