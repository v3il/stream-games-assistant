export class LocalSettingsService<T extends object> {
    private storage = window.localStorage;

    private _settings!: T;

    constructor(private readonly key: string, private readonly defaultSettings: T) {
        this.loadSettings();

        console.error(this.key, this.settings)
    }

    get settings(): T {
        return this._settings;
    }

    private loadSettings(): void {
        this._settings = this.loadFromStorage() ?? this.defaultSettings;
    }

    updateSettings(newSettings: Partial<T>): void {
        this._settings = { ...this._settings, ...newSettings };
        this.saveSettings();
    }

    private loadFromStorage(): T | null {
        const json = this.storage.getItem(this.key);

        if (!json) {
            return null;
        }

        try {
            return JSON.parse(json) as T;
        } catch (error) {
            return null;
        }
    }

    private saveSettings(): void {
        const json = JSON.stringify(this._settings);
        this.storage.setItem(this.key, json);
    }
}
