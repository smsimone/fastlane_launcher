import * as fs from 'fs';
import { Lane } from './lane';

const _laneStarting = "lane :";
const _descriptionStarting = "desc :";
const _laneTag = '#TAG ';

/**
 * Parses the Fastfile to search the available lanes
 * @returns a list with all the commands contained
 */
export function parseFastfile(fastfilePath: string): Lane[] {
    let content = fs.readFileSync(fastfilePath, { encoding: 'utf-8' });
    let commands: Lane[] = [];

    let lastDesc: string = "";
    let lastTag: string = "";

    content.split("\n").forEach((line) => {
        if (line.includes(_laneStarting)) {
            var name = line.split(" ")[1].replace(":", "");
            commands.push(new Lane(name, line.includes("private"), lastDesc, lastTag));
            lastDesc = "";
            lastTag = "";
        } else if (line.includes(_descriptionStarting)) {
            var description = line.replace(_descriptionStarting, "").replace("\"", "").replace("\"", "");
            lastDesc += ` ${description}`;
        } else if (line.includes(_laneTag)) {
            lastTag = line.replace(_laneTag, "").replace("\"", "").replace("\"", "");
        }
    });

    return commands;
}