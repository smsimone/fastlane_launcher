import * as vscode from 'vscode';
import { Config } from '../config';
import { Lane } from './lane';

export class LaneProvider implements vscode.TreeDataProvider<Lane>{
    lanes: Lane[];
    config: Config;

    tags: String[];

    constructor(lanes: Lane[], config: Config) {
        this.lanes = lanes;
        this.config = config;
        this.tags = [];
        lanes.forEach((lane) => {
            if (lane.tag !== undefined) {
                this.tags.push(lane.tag);
            }
        });
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
            },

        };
    }

    getChildren(ta?: Lane): vscode.ProviderResult<Lane[]> {
        return this.lanes;
    }

}

