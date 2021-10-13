import { DH_CHECK_P_NOT_SAFE_PRIME } from 'constants';
import * as vscode from 'vscode';
import { Config } from './config';
import { Group } from './model/group';

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

export class LaneGroupProvider implements vscode.TreeDataProvider<TreeItem>{
    lanes: Lane[];
    config: Config;

    groups: Group[] = [];

    data: TreeItem[] = [];

    constructor(lanes: Lane[], config: Config) {
        this.lanes = lanes;
        this.config = config;
        this.lanes.forEach((lane) => {
            const tag = lane.tag;
            let group: Group | undefined = this.groups.find((group) => group.tag === tag);
            if (group === undefined) {
                group = new Group(tag);
                this.groups.push(group);
            }
            group.addLane(lane);
        });

        this.groups.forEach((g) => {
            let description: string;
            if (g.tag === undefined || g.tag.trim() === '') {
                description = 'No tag';
            } else {
                description = g.tag;
            }
            this.data.push(new TreeItem(description, '', g.lanes.map((l) => new TreeItem(l.label, l.description))));
        });

        console.log(`Got ${this.data.length} groups`);
    }

    onDidChangeTreeData?: vscode.Event<void | TreeItem | null | undefined> | undefined;
    getTreeItem(element: TreeItem): TreeItem | Thenable<TreeItem> {
        return element;
    }

    getChildren(element?: TreeItem): vscode.ProviderResult<TreeItem[]> {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }
}


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
            }
        };
    }

    getChildren(ta?: Lane): vscode.ProviderResult<Lane[]> {
        return this.lanes;
    }

}


class TreeItem extends vscode.TreeItem {
    children: TreeItem[] | undefined;

    constructor(label: string, description?: string | undefined, children?: TreeItem[]) {
        super(
            label,
            children === undefined ? vscode.TreeItemCollapsibleState.None :
                vscode.TreeItemCollapsibleState.Expanded
        );
        this.children = children;
        this.description = description;
    }
}