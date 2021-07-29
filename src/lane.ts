import * as vscode from 'vscode';

export class Lane implements vscode.QuickPickItem {
    label: string;
    description?: string | undefined;
    detail?: string | undefined;
    picked?: boolean | undefined;
    alwaysShow?: boolean | undefined;

    constructor(label: string, description?: string) {
        this.label = label;
        this.description = description;
    }
}