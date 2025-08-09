import { LocalSettingsService } from '@shared/services';

export interface ITwitchLocalSettings {
    hitsquadRounds: number;
    chestGame: boolean;
    lootGame: boolean;
}

export const localSettingsService = new LocalSettingsService<ITwitchLocalSettings>({
    hitsquadRounds: 0,
    lootGame: false,
    chestGame: false
});
