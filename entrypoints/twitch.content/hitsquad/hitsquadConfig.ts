import { Timing } from '@shared/consts';

interface IHitsquadConfig {
    twitchChannelName: string;
    miniGamesBotDowntime: number;
    hitsquadGameBaseTimeout: number;
    twitchAdminName: string;
    delayRemoverInterval: number;
}

const twitchChannelName = location.pathname.slice(1);

export const isMiniGamesChannel = () => [
    'hitsquadgodfather',
    'hitsquadbruno',
    'hitsquadvito',
    'hitsquadcarlo',
    'staggerrilla'
].includes(twitchChannelName);

export const hitsquadConfig: IHitsquadConfig = {
    twitchChannelName,
    twitchAdminName: twitchChannelName,
    miniGamesBotDowntime: 10 * Timing.MINUTE,
    hitsquadGameBaseTimeout: 5 * Timing.MINUTE,
    // delayRemoverInterval: 3 * Timing.MINUTE
} as const;
