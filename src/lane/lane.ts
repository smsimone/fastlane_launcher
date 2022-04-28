import * as vscode from 'vscode';

export class Lane implements vscode.QuickPickItem {
    _label: string;
    description?: string | undefined;
    picked?: boolean | undefined;
    alwaysShow?: boolean | undefined;
    _tag?: string | undefined;
    _alias?: string | undefined;
    privateLane: boolean;

    constructor(label: string, privateLane: boolean, description?: string, tag?: string, alias?: string) {
        this._label = label;
        this._tag = tag;
        this._alias = alias;
        this.description = description;
        this.privateLane = privateLane;
    }

    public get label(): string { return this._alias ?? this._label; }

    public get tag(): string | undefined { return this._tag; }

}