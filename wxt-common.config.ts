import { resolve } from 'node:path';
import { UserConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';
import swc from 'vite-plugin-swc-transform';

interface IParams extends UserConfig {
    description: string;
}

// See https://wxt.dev/api/config.html
export const buildConfig = ({ description, ...rest }: IParams): UserConfig => ({
    modules: ['@wxt-dev/module-vue'],

    vite: () => ({
        plugins: [
            tailwindcss(),
            swc({
                swcOptions: {
                    jsc: {
                        target: 'es2022',
                        transform: {
                            legacyDecorator: true,
                            decoratorMetadata: true,
                            useDefineForClassFields: false,
                        },
                        parser: {
                            syntax: 'typescript',
                            decorators: true,
                        },
                    },
                },
            }),
        ],
    }),

    manifest: {
        description,
        name: 'Stream Games Assistant',
        permissions: ['storage'],
        host_permissions: [
            'https://www.twitch.tv/*',
            'https://streamelements.com/*',
            'http://localhost:5001/*',
            'https://api.jsonbin.io/*'
        ],

        web_accessible_resources: [
            {
                resources: ['twitchMainWorldInjected.js'],
                matches: ['https://www.twitch.tv/*']
            },
            {
                resources: ['logo.png'],
                matches: ['https://www.twitch.tv/*', 'https://streamelements.com/*']
            },
        ]
    },

    alias: {
        '@twitch': resolve(__dirname, './entrypoints/twitch.content'),
        '@store': resolve(__dirname, './entrypoints/store.content'),
        '@utils': resolve(__dirname, './utils'),
        '@shared': resolve(__dirname, './shared')
    },

    ...rest
});
