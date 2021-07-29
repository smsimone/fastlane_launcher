export class Config {
    private _fastfilePath: string | undefined;

    public get fastfilePath(): string {
        return this._fastfilePath || "";
    }

    public set fastfilePath(value: string) {
        this._fastfilePath = value;
        this._saveCache();
    }
    /**
     * Saves the value inserted
     */
    _saveCache() {

    }
    /**
     * Recovers the old value from cache
     */
    _restore() {

    }
}