import * as fs from 'fs';
import { Lane } from './lane/lane';
import { LaneMetadata } from './lane/lane_metadata';

/**
 * Parses the Fastfile to search the available lanes
 * @returns a list with all the commands contained
 */
export function parseFastfile(fastfilePath: string): Lane[] {
    if (!fs.existsSync(fastfilePath)) { return []; }
    let content = fs.readFileSync(fastfilePath, { encoding: 'utf-8' });

    const contentLines = content.split('\n').map(l => l.trim());

    const lanes = content.match(/^(private_)?lane(.|\n)*?^end/gm);
    if (!lanes) { throw Error(`No lanes found`); }

    return lanes.map(lane => {
        const laneHeader = lane.split("\n")[0].trim();
        const startIdx = contentLines.indexOf(laneHeader.trim());
        let idx = startIdx;
        let line: string;
        let metadataLines: string[] = [];
        do {
            line = contentLines[idx];
            if (!line) { break; }
            metadataLines.push(line);
            idx--;
        } while (!line.trim().match(/^end$/) || idx !== 0);


        let metadata = new LaneMetadata(metadataLines);
        let laneName = laneHeader.match(/^(private_)?lane :(?<NAME>.*) do/)!.groups!['NAME'];
        const isPrivate = laneHeader.includes('private_');
        const isCommented = new RegExp('#.*(private_)?lane.*do');

        return new Lane(laneName, isPrivate, metadata, isCommented.exec(laneHeader) !== null);
    });
}