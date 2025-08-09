import 'reflect-metadata';
import './twitch.css';
import ExtensionRoot from './ExtensionRoot.vue';
import { Container } from 'typedi';
import { TwitchUIService } from '@twitch/core/modules';
// import { AuthFacade } from '@shared/modules';
import { isDev } from '@shared/consts';
import { type App, createApp } from 'vue';

function getChannelName() {
    return location.pathname.slice(1);
}

function isSupportedChannel() {
    return [
        'hitsquadgodfather',
        'hitsquadbruno',
        'hitsquadvito',
        'hitsquadcarlo',
        'staggerrilla'
    ].includes(getChannelName());
}

function createRootElement() {
    const rootEl = document.createElement('div');

    rootEl.id = 'sga-root';
    document.body.appendChild(rootEl);

    return rootEl;
}

export const main = async () => {
    let app: App | null = null;

    const twitchUIService = Container.get(TwitchUIService);
    // const authFacade = Container.get(AuthFacade);

    // await authFacade
    //     .auth()
    //     .catch((error) => logError('Error during authentication:', error));

    log(`Running in ${isDev ? 'dev' : 'prod'} mode`);

    if (isSupportedChannel()) {
        twitchUIService.whenStreamReady(() => {
            app = createApp(ExtensionRoot, {
                channelName: getChannelName()
            });

            app.mount(createRootElement());
        });
    }

    window.addEventListener('sga:urlChanged', () => {
        if (app) {
            app.unmount();
            app = null;
        }

        if (isSupportedChannel()) {
            location.reload();
        }
    });
};
