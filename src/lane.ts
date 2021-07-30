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
        return {
            id: element.label,
            label: element.label,
            description: element.description,
            command: {
                title: "Execute",
                command: "fastlane-launcher.executeShell",
                arguments: [`fastlane ${element.label}`],
            }
        };
    }

    getChildren(element?: Lane): vscode.ProviderResult<Lane[]> {
        return this.lanes;
    }

}