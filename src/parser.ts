import * as fs from 'fs';
import { Lane } from './lane/lane';
import { LaneMetadata } from './lane/lane_metadata';

const _laneRegex = new RegExp('^(private_)?lane');
const _endLaneRegex = new RegExp('^end$');

/**
 * Parses the Fastfile to search the available lanes
 * @returns a list with all the commands contained
 */
export function parseFastfile(fastfilePath: string): Lane[] {
    if (!fs.existsSync(fastfilePath)) { return []; }
    let content = fs.readFileSync(fastfilePath, { encoding: 'utf-8' });
    let commands: Lane[] = [];

    const contentLines = content.split('\n').map(l => l.trim());
    const laneIndices: number[] = [];

    let group: string[] = [];
    let inLane: boolean = false;
    let groups: string[][] = [[]];

    for (let idx = 0; idx < contentLines.length; idx++) {
        const line = contentLines[idx];
        group.push(line);
        if (_laneRegex.exec(line)) {
            inLane = true;
        } else if (_endLaneRegex.exec(line)) {
            inLane = false;
            groups.push(new Array(...group));
            group = [];
        }
    }

    groups = groups
        .map(g => g.filter(l => l.trim().length > 0))
        .filter(g => g.length > 0);

    for (const group of groups) {
        let metadataLines: string[] = [];
        for (const line of group) {
            if (_laneRegex.exec(line)) { break; }
            metadataLines.push(line);
        }

        let metadata = new LaneMetadata(metadataLines);
        let currentLane = group.filter(l => _laneRegex.exec(l))[0];
        const laneName = currentLane.split(' ')[1].replace(':', '');
        const isPrivate = currentLane.includes('private_');
        const isCommented = new RegExp('#.*(private_)?lane.*do');

        const lane = new Lane(laneName, isPrivate, metadata, isCommented.exec(currentLane) !== null);
        commands.push(lane);
    }

    return commands;
}