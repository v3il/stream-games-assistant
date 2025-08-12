import 'reflect-metadata';
import './twitch.css';
import ExtensionRoot from './ExtensionRoot.vue';
import { Container } from 'typedi';
import { MessageSender, TwitchUIService, TwitchPlayerService } from '@twitch/core/modules';
import { isDev } from '@shared/consts';
import { type App, createApp } from 'vue';
import { InjectionTokens, isSupportedChannel } from './core';
// import { AuthFacade } from '@shared/modules';

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

    if (isSupportedChannel) {
        twitchUIService.whenStreamReady(() => {
            app = createApp(ExtensionRoot);

            app.provide(InjectionTokens.TWITCH_UI_SERVICE, twitchUIService);
            app.provide(InjectionTokens.TWITCH_PLAYER_SERVICE, Container.get(TwitchPlayerService));
            app.provide(InjectionTokens.MESSAGE_SENDER, Container.get(MessageSender));
            // app.provide(InjectionTokens.AUTH_FACADE, authFacade);

            app.mount(createRootElement());
        });
    }

    window.addEventListener('sga:urlChanged', () => {
        if (app) {
            app.unmount();
            app = null;
        }

        if (isSupportedChannel) {
            location.reload();
        }
    });
};
