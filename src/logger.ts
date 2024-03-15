import * as vscode from 'vscode';

enum Level {
    info = "ℹ️",
    warning = "⚠️",
    error = "⛔️"
}

class Logger {
    readonly _logger: vscode.OutputChannel;

    readonly _headings = {
    };

    constructor() {
        this._logger = vscode.window.createOutputChannel("fastlane_launcher");
    }

    private format(level: Level, message: string): string {
        return `${level}: ${message}`;
    }

    info(message: string) {
        this._logger.appendLine(this.format(Level.info, message));
    }

    warn(message: string) {
        this._logger.appendLine(this.format(Level.warning, message));
    }

    error(message: string) {
        this._logger.appendLine(this.format(Level.error, message));
    }
}

const logger = new Logger();
export default logger;