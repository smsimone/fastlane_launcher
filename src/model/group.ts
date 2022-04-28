import { languages } from "vscode";
import { Lane } from "../lane/lane";

export class Group {
    tag?: string;
    lanes: Lane[];

    constructor(tag: string | undefined, lanes?: Lane[]) {
        this.tag = tag;
        this.lanes = lanes ?? [];
    }

    addLane(lane: Lane): void {
        this.lanes.push(lane);
    }
}