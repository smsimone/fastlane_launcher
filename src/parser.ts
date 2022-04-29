import * as fs from 'fs';
import { Lane } from './lane/lane';
import { LaneMetadata } from './lane/lane_metadata';

const _laneStarting = "lane :";
const _descriptionStarting = "desc :";
const _laneTag = '#TAG ';
const _laneAlias = "#ALIAS ";

const _metadataStart = '# metadata_start';
const _metadataEnd = '# metadata_end';

/**
 * Parses the Fastfile to search the available lanes
 * @returns a list with all the commands contained
 */
export function parseFastfile(fastfilePath: string): Lane[] {
    let content = fs.readFileSync(fastfilePath, { encoding: 'utf-8' });
    let commands: Lane[] = [];

    let lastDesc: string = "";
    let lastTag: string | undefined;
    let lastAlias: string | undefined;


    const contentLines = content.split('\n');

    const regex = new RegExp('^(private_)?lane');
    const endRegex = new RegExp('^end$');

    const laneIndices: number[] = [];

    for (let i = 0; i < contentLines.length; i++) { if (regex.exec(contentLines[i])) { laneIndices.push(i); } }

    for (let currentIndex of laneIndices) {
        let metadataLines: string[] = [];

        for (let j = currentIndex; j > 0; j--) {
            if (endRegex.exec(contentLines[j])) { break; }
            metadataLines.push(contentLines[j]);
        }

        let metadata = new LaneMetadata(metadataLines);
        const currentLane = contentLines[currentIndex];

        const laneName = currentLane.split(' ')[1].replace(':', '');
        const isPrivate = currentLane.includes('private_');
        const isCommented = new RegExp('#.*(private_)?lane.*do');

        const lane = new Lane(laneName, isPrivate, metadata, isCommented.exec(currentLane) !== null);
        commands.push(lane);

    }

    return commands;
}