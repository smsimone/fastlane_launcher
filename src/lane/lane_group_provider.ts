import * as vscode from 'vscode';
import { Config } from '../config';
import { Lane } from './lane';
import { Group } from '../model/group';
import { TreeItem } from './tree_item';


export class LaneGroupProvider implements vscode.TreeDataProvider<TreeItem>{
    lanes: Lane[];
    config: Config;

    groups: Group[] = [];

    data: TreeItem[] = [];

    constructor(lanes: Lane[], config: Config) {
        this.config = config;

        this.lanes = lanes.filter(l => !l.isCommented).filter((lane) => {
            if (config.showPrivateLanes) { return true; }
            else { return !lane.isPrivate; }
        });

        this.lanes.forEach((lane) => {
            if (lane.isPrivate) {
                let group: Group | undefined = this.groups.find((group) => group.tag === config.privateLaneGroupName);
                if (group === undefined) {
                    group = new Group(config.privateLaneGroupName);
                    this.groups.push(group);
                }
                group.addLane(lane);
            } else {
                const tag = lane.tag;
                let group: Group | undefined = this.groups.find((group) => group.tag === tag);
                if (group === undefined) {
                    group = new Group(tag);
                    this.groups.push(group);
                }
                group.addLane(lane);
            }
        });

        this.groups.forEach((g) => {
            let description: string;
            if (g.tag === undefined || g.tag.trim() === '') {
                description = 'No tag';
            } else {
                description = g.tag;
            }
            this.data.push(new TreeItem(description, '', g.lanes.map((l) => new TreeItem(l.label, l.description, undefined, `${this.config.fastlaneCommand} ${l.command}`))));
        });
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

