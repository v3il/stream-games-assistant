import { Container, Service } from 'typedi';
import { EventHandler } from '@shared/EventEmitter';
import { GlobalSettingsKeys, ISettings, ISettingsEvents } from '../types';
import { FirebaseApiService } from '../FirebaseApiService';
import { SettingsService } from './SettingsService.svelte';
import { StorageService } from '../StorageService';
import { RequestSender } from '../RequestSender';

@Service()
export class SettingsFacade {
    private settingsService!: SettingsService;

    private container = Container.of('settings');

    constructor() {
        this.initProviders();
    }

    get settings() {
        return this.settingsService.settings;
    }

    setSettings(settings: ISettings) {
        return this.settingsService.setSettings(settings);
    }

    updateSettings(settings: Partial<ISettings>) {
        return this.settingsService.updateSettings(settings);
    }

    onSettingChanged<
        K extends GlobalSettingsKeys
    >(key: K, callback: EventHandler<ISettingsEvents[`setting-changed:${K}`]>) {
        return this.settingsService.events.on(`setting-changed:${key}`, callback);
    }

    private initProviders() {
        this.container.set({ id: RequestSender, value: Container.get(RequestSender) });
        this.container.set({ id: StorageService, value: Container.get(StorageService) });
        this.container.set({ id: SettingsService, type: SettingsService });
        this.container.set({ id: FirebaseApiService, value: Container.get(FirebaseApiService) });

        this.settingsService = this.container.get(SettingsService);
    }
}
