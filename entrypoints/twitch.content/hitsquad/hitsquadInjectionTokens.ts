import { Token } from 'typedi';
import { LocalSettingsService } from '@shared/services';
import type { InjectionKey } from 'vue';
import { ChestGameService, HitsquadGameService, LootGameService } from './modules';

export type HitsquadLocalSettingsService = LocalSettingsService<IHitsquadLocalSettings>;

export interface IHitsquadLocalSettings {
    hitsquadRounds: number;
    chestGame: boolean;
    lootGame: boolean;
}

export const localSettingsServiceToken = new Token<HitsquadLocalSettingsService>;

export const HitsquadInjectionTokens = {
    CHEST_GAME_SERVICE: Symbol('ChestGameService') as InjectionKey<ChestGameService>,
    LOOT_GAME_SERVICE: Symbol('LootGameService') as InjectionKey<LootGameService>,
    HITSQUAD_GAME_SERVICE: Symbol('HitsquadGameService') as InjectionKey<HitsquadGameService>
} as const;
