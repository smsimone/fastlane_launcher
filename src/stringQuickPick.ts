import * as vscode from 'vscode';

export class StringQuickPick implements vscode.QuickPickItem {
    label: string;
    description?: string | undefined;
    detail?: string | undefined;
    picked?: boolean | undefined;
    alwaysShow?: boolean | undefined;

    constructor(label: string) {
        this.label = label;
    }

}