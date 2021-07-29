import * as fs from 'fs';
import { Lane } from './lane';

const _laneStarting = "lane :";

/**
 * Parses the Fastfile to search the available lanes
 * @returns a list with all the commands contained
 */
export function parseFastfile(fastfilePath: string): Lane[] {
    let content = fs.readFileSync(fastfilePath, { encoding: 'utf-8' });
    let commands: Lane[] = [];
    content.split("\n").forEach((line) => {
        if (line.includes(_laneStarting)) {
            var name = line.split(" ")[1].replace(":", "");
            commands.push(new Lane(name));
        }
    });

    return commands;
}