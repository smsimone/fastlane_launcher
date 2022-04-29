import * as vscode from 'vscode';
import { LaneMetadata } from './lane_metadata';

export class Lane implements vscode.QuickPickItem {
    /**
     * The default name of the lane
     */
    readonly _label: string;

    /**
     * Flag that indicates if a lane is private or not
     */
    readonly isPrivate: boolean;

    /**
     * Flag that indicates if a lane was commented or not
     */
    readonly isCommented: boolean;

    /**
     * Metadata of the current lane
     */
    readonly _metadata: LaneMetadata;

    constructor(label: string, privateLane: boolean, metadata: LaneMetadata, isCommented: boolean = false) {
        this._label = label;
        this.isPrivate = privateLane;
        this._metadata = metadata;
        this.isCommented = isCommented;
    }

    public get label(): string { return this._metadata.alias ?? this._label; }

    public get tag(): string | undefined { return this._metadata.tag; }

    public get description(): string | undefined { return this._metadata.description; }
}