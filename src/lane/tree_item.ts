import * as vscode from 'vscode';

export class TreeItem extends vscode.TreeItem {
    children: TreeItem[] | undefined;

    constructor(label: string, description?: string | undefined, children?: TreeItem[], command?: string) {
        super(
            label,
            children === undefined ? vscode.TreeItemCollapsibleState.None :
                vscode.TreeItemCollapsibleState.Expanded,
        );
        this.children = children;
        this.description = description;
        if (command !== undefined) {
            this.command = {
                title: "Execute",
                command: "fastlane-launcher.executeShell",
                arguments: [command],
            };
        }
    }
}