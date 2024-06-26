import { LaneParam } from "./lane_param";

const _aliasName = '#ALIAS';
const _tagName = '#TAG';
const _descName = 'desc :';
const _paramTag = '#PARAM';

/**
 * Class that contains the metadata for a lane
 */
export class LaneMetadata {

    /**
     * Contains the tag of the lane
     */
    readonly tag: string | undefined;
    readonly alias: string | undefined;
    readonly description: string | undefined;
    readonly params: LaneParam[];

    constructor(lines: string[]) {
        this.tag = this._getTag(lines);
        this.alias = this._getAlias(lines);
        this.description = this._getDescription(lines);
        this.params = this._getParams(lines);
    }

    /**
     * @returns The tag of the lane
     */
    _getTag(lines: string[]): string | undefined {
        const found = lines.filter(l => l.includes(_tagName)).map(l => l.replace(_tagName, '').trim());
        if (found.length === 0) { return undefined; }
        return found[0];
    }

    /**
     * @returns The tag of the lane
     */
    _getAlias(lines: string[]): string | undefined {
        const found = lines.filter(l => l.includes(_aliasName)).map(l => l.replace(_aliasName, '').trim());
        if (found.length === 0) { return undefined; }
        return found[0];
    }

    /**
     * @returns The tag of the lane
     */
    _getDescription(lines: string[]): string | undefined {
        return lines.filter(l => l.includes(_descName)).map(l => l.replace(_descName, '')).join(' ');
    }

    _getParams(lines: string[]): LaneParam[] {
        return lines.filter(l => l.includes(_paramTag)).map(l => {
            try {
                return LaneParam.parseFromLine(l);
            } catch (error) {
                console.error("Failed to parse param line: " + error);
                return null;
            }
        }).filter(x => x !== null) as LaneParam[];
    }
}