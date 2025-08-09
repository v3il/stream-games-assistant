export const isDev = import.meta.env.MODE === 'development';

export const FUNCTION_DOMAIN = isDev
    ? 'http://localhost:5001'
    : 'https://twitchauth-hyzmjwwhoq-uc.a.run.app';

export const FUNCTION_URL = isDev
    ? `${FUNCTION_DOMAIN}/hgf-helper/us-central1/twitchAuth`
    : FUNCTION_DOMAIN;

export const AUTH_URL = `${FUNCTION_URL}/auth`;

export enum Timing {
    SECOND = 1000,
    MINUTE = 60 * 1000
}

export enum StreamElementsSortOffersBy {
    DEFAULT = 'order',
    CREATED_AT = '-createdAt',
    SUBSCRIBERS_ONLY = '-subscriberOnly',
    COST = '-cost'
}
