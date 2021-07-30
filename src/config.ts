import * as vscode from 'vscode';
import * as fs from 'fs';
import { LocalStorageService } from './localStorage';
import { runInThisContext } from 'vm';
export class Config {
    private _fastfilePath: string | undefined;
    private _configFileName: string = 'fastlane_config.json';

    private _storageManager: LocalStorageService;

    constructor(storageManager: LocalStorageService) {
        this._storageManager = storageManager;
        this._restore();
    }

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
        this._storageManager.setValue<string>("fastfilePath", this._fastfilePath!);
        console.log("Saved fatfilepath");
    }
    /**
     * Recovers the old value from cache
     */
    _restore() {
        this._fastfilePath = this._storageManager.getValue<string | undefined>("fastfilePath");
        console.log(`restored fastfilepath: ${this._fastfilePath}`);
    }
}