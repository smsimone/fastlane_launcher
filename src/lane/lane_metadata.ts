const _aliasName = '#ALIAS';
const _tagName = '#TAG';
const _descName = 'desc :';
const _paramTag = '@param';

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
    readonly params: string[];

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

    _getParams(lines: string[]): string[] {
        return lines.filter(l => l.includes(_paramTag)).map(l => {
            const regex = new RegExp('#.*@param (.*)');
            const match = regex.exec(l);
            if (match) {
                return match[1];
            }
            return undefined;
        }).filter(l => l !== undefined) as string[];
    }
}