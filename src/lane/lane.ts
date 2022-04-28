import * as vscode from 'vscode';

export class Lane implements vscode.QuickPickItem {
    label: string;
    description?: string | undefined;
    detail?: string | undefined;
    picked?: boolean | undefined;
    alwaysShow?: boolean | undefined;
    tag?: string | undefined;
    alias?: string | undefined;
    privateLane: boolean;

    constructor(label: string, privateLane: boolean, description?: string, tag?: string, alias?: string) {
        this.label = label;
        this.description = description;
        this.tag = tag;
        this.privateLane = privateLane;
        this.alias = alias;
    }

    public getLabel(): string { return this.alias ?? this.label; }
}