import { LocalStorageService } from './localStorage';
import * as vscode from 'vscode';
export class Config {
    private _fastfilePath: string | undefined;
    private _fastlaneCommand: string;
    private _showPrivateLanes: boolean;
    private _privateLaneGroupName: string;

    private _storageManager: LocalStorageService;

    constructor(storageManager: LocalStorageService) {
        this._storageManager = storageManager;
        let config = vscode.workspace.getConfiguration('fastlane-launcher');
        this._fastlaneCommand = config.get<string>('fastlaneCommand')!;
        this._showPrivateLanes = config.get<boolean>('showPrivate') ?? false;
        this._privateLaneGroupName = config.get<string>('privateLaneGroupName') ?? 'Private';
        this._restore();
    }

    public get fastlaneCommand(): string {
        return this._fastlaneCommand;
    }

    public get fastfilePath(): string {
        return this._fastfilePath || "";
    }

    public get showPrivateLanes(): boolean {
        return this._showPrivateLanes;
    }

    public get privateLaneGroupName(): string {
        return this._privateLaneGroupName;
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
        //this._fastfilePath = this._storageManager.getValue<string | undefined>("fastfilePath");
        console.log(`restored fastfilepath: ${this._fastfilePath}`);
    }
}