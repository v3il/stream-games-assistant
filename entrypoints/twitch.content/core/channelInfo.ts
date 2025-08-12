export const channelName = location.pathname.slice(1);

export const isHitsquadChannel = [
    'hitsquadgodfather',
    'hitsquadbruno',
    'hitsquadvito',
    'hitsquadcarlo'
].includes(channelName);

export const isStaggerrillaChannel = channelName === 'staggerrilla';
export const isSupportedChannel = isHitsquadChannel || isStaggerrillaChannel;
