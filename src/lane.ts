import * as vscode from 'vscode';
import { Config } from './config';

export class Lane implements vscode.QuickPickItem {
    label: string;
    description?: string | undefined;
    detail?: string | undefined;
    picked?: boolean | undefined;
    alwaysShow?: boolean | undefined;
    tag?: string | undefined;

    constructor(label: string, description?: string, tag?: string) {
        this.label = label;
        this.description = description;
        this.tag = tag;
    }
}


export class LaneProvider implements vscode.TreeDataProvider<Lane>{
    lanes: Lane[];
    config: Config;

    constructor(lanes: Lane[], config: Config) {
        this.lanes = lanes;
        this.config = config;
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
                arguments: [`${this.config.fastlaneCommand} ${element.label}`],
            }
        };
    }

    getChildren(element?: Lane): vscode.ProviderResult<Lane[]> {
        return this.lanes;
    }

}