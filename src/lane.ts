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


export class LaneProvider implements vscode.TreeDataProvider<Lane>{
    lanes: Lane[];

    constructor(lanes: Lane[]) {
        this.lanes = lanes;
    }


    onDidChangeTreeData?: vscode.Event<void | Lane | null | undefined> | undefined;
    getTreeItem(element: Lane): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: Lane): vscode.ProviderResult<Lane[]> {
        return this.lanes;
    }

}