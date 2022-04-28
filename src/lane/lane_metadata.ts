/**
 * Class that contains the metadata for a lane
 */
export class LaneMetadata {

    private _metadataLines: string[];

    constructor() { this._metadataLines = []; }

    /**
     * @param line the line of metadata to add
     */
    public addNewLine(line: string): void { this._metadataLines.push(line); }
}