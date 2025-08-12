import { TwitchUIService } from '../../TwitchUIService';
import { ColorService } from '@shared/services';
import { Timing } from '@shared/consts';
import type { ICheckPoint } from './ICheckPoint';
import { blackScreenChecks } from './blackScreenChecks';
import { OffscreenStreamRenderer } from '../OffscreenStreamRenderer';

interface IStreamStatusServiceOptions<S extends IStreamStatusServiceState> {
    offscreenStreamRenderer: OffscreenStreamRenderer;
    twitchUIService: TwitchUIService;
    colorService: ColorService;
    initialState: S;
}

export interface IStreamStatusServiceState {
    isStreamOk: boolean;
}

export class StreamStatusService<S extends IStreamStatusServiceState> {
    private readonly offscreenStreamRenderer!: OffscreenStreamRenderer;
    private readonly twitchUIService!: TwitchUIService;
    private readonly colorService!: ColorService;

    private timeoutId!: number;
    private streamReloadTimeoutId!: number;

    protected state: S;

    constructor(options: IStreamStatusServiceOptions<S>) {
        this.offscreenStreamRenderer = options.offscreenStreamRenderer;
        this.twitchUIService = options.twitchUIService;
        this.colorService = options.colorService;

        this.state = reactive(options.initialState) as S;

        this.checkStreamStatus();

        this.timeoutId = window.setInterval(() => {
            this.checkStreamStatus();
        }, 3 * Timing.SECOND);
    }

    get isStreamOk() {
        return this.state.isStreamOk;
    }

    get isMiniGamesAllowed() {
        return this.isStreamOk;
    }

    checkStreamStatus() {
        const { activeVideoEl } = this.twitchUIService;

        if (!activeVideoEl || activeVideoEl.paused || activeVideoEl.ended || this.isBlackScreen()) {
            this.state.isStreamOk = false;

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

        this.state.isStreamOk = true;
    }

    protected checkPoints(points: ICheckPoint[]): number {
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
