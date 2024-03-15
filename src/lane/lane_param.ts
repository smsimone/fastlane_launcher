
const regex = new RegExp("#PARAM \{(?<NAME>[a-z_-]*)\} *?(\((?<DEFAULT>.*)\))? *?(?<COMMENT>.*)?$");

export class LaneParam {

    readonly _name: string;
    readonly _defaultValue: string | undefined;
    readonly _comment: string | undefined;

    constructor(name: string, defaultValue: string | undefined, comment: string | undefined) {
        this._name = name;
        this._defaultValue = defaultValue;
        this._comment = comment;
    }

    /**
     * Parses a LaneParam for it's formatted string. Throws an error if the string is invalid
     * @param line the formatted line to parse
     * @returns a new LaneParam object
     */
    static parseFromLine(line: string): LaneParam {
        const match = line.match(/#PARAM \{(?<NAME>[a-zA-Z0-9_-]*)\}( )?(\((?<DEFAULT>.*)\))??( )?(?<COMMENT>.*)?/);
        if (!match) { throw new Error("Invalid param line"); }
        const groups = match.groups;
        if (!groups) { throw Error("Missing groups"); }
        const name = groups['NAME'];
        const defaultValue = groups['DEFAULT'];
        const comment = groups['COMMENT'];
        return new LaneParam(name, defaultValue, comment);
    }
}