import * as fs from "fs";
import * as vscode from "vscode";
import { Config } from "./config";
import { Lane } from "./lane/lane";
import { LaneGroupProvider } from "./lane/lane_group_provider";
import { LocalStorageService } from "./localStorage";
import logger from "./logger";
import { parseFastfile } from "./parser";
import { StringQuickPick } from "./stringQuickPick";
import path = require("path");

let _lanes: Lane[] = [];
let _config: Config;

export async function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage("Fastlane launcher has been activated");

  let storageManager = new LocalStorageService(context.workspaceState);
  _config = new Config(storageManager);

  vscode.workspace.onDidChangeConfiguration((event) => {
    let affected = event.affectsConfiguration("fastlane-launcher");
    if (affected) {
      logger.info("Reloading configuration");
      _config = new Config(storageManager);
    }

    if (!_config.fastfilePath) {
      getFastfilePath({ config: _config });
    } else {
      populateView(_config);
    }
  });

  /**
   * If the saved document is the Fasftile, it will be reloaded
   */
  vscode.workspace.onDidSaveTextDocument((event) => {
    if (new RegExp("[F|f]astfile", "i").exec(event.fileName)) {
      logger.info("Reading again fastfile");
      getFastfilePath({ config: _config });
    }
  });

  vscode.workspace.onDidDeleteFiles((event) => {
    const regex = new RegExp("[F|f]astfile", "i");
    if (event.files.map(f => f.path).some(p => regex.exec(p))) {
      logger.info("Reading again fastfile");
      populateView(_config);
    }
  });

  if (!_config.fastfilePath) {
    getFastfilePath({ config: _config });
  } else {
    populateView(_config);
  }

  /**
   * The command that allows the user to pick a lane
   */
  context.subscriptions.push(
    vscode.commands.registerCommand("fastlane-launcher.showCommands", () => {
      let commands = parseFastfile(_config.fastfilePath);
      var quickPick = vscode.window.createQuickPick();
      quickPick.items = commands;
      quickPick.show();
      quickPick.onDidAccept(() => {
        quickPick.selectedItems.forEach((item) => executeShellCommand({ laneName: item.label }));
        quickPick.dispose();
      });
    })
  );

  /**
   * Allows the use to change fastfile's path
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "fastlane-launcher.changeFastfilePath",
      () => getFastfilePath({ config: _config })
    )
  );

  /**
   * Executes a custom command passed in @param args in the integrated terminal
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "fastlane-launcher.executeShell",
      (args: string) => executeShellCommand({ laneName: args })
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {
  vscode.window.showWarningMessage("Fastlane launcher has been deactivated");
}

/**
 * Creates a shell and executes the selected lane
 */
async function executeShellCommand({ laneName, shellName = "Fastlane launcher" }: { laneName: string, shellName?: string }) {
  const lane = _lanes.find(l => l._label === laneName);
  if (!lane) { throw Error(`Path "${laneName}" does not exists`); }

  const meta = lane.metadata;

  let inputVar: string[] = [];
  for await (const p of meta.params) {
    const input = await vscode.window.showInputBox({
      placeHolder: p._defaultValue,
      prompt: `Insert a value for param "${p._name}"`,
      value: p._defaultValue
    });
    inputVar.push(`${p._name}:"${input}"`);
  }
  let terminal = vscode.window.createTerminal({ name: shellName });
  terminal.show();
  terminal.sendText(`${_config.fastlaneCommand} ${laneName} ${inputVar.join(" ")}`);
}

/**
 * Sets the `config.fastFilePath` to a new value
 * @param config
 */
async function getFastfilePath({ config, refreshView = true }: { config: Config, refreshView?: boolean }) {
  let fastfilePath: string = "";

  const uris = await vscode.workspace.findFiles("**/[F|f]astfile", null);

  if (uris.length === 0) {
    vscode.window.showInformationMessage("No fastfile found in current directory");
    return;
  }


  if (uris.length > 1) {
    logger.info(`Found multiple fastfiles: ${uris}`);
    const quickPick = vscode.window.createQuickPick();
    quickPick.items = uris.map((uri) => new StringQuickPick(uri.path));
    quickPick.show();
    quickPick.canSelectMany = false;
    quickPick.onDidAccept(() => {
      const items = quickPick.selectedItems;
      config.fastfilePath = items[0].label;
      populateView(config);
      quickPick.dispose();
    });
    return;
  } else if (uris.length === 1) {
    logger.info(`Found a single fastfile at path: ${uris}`);
    fastfilePath = uris[0].path;
  } 

  const { platform } = process;

  const locale = path[platform === `win32` ? `win32` : `posix`];
  let localePath = fastfilePath.split("/").join(locale.sep).replace("^\\", "");

  if (platform === "win32" && localePath.startsWith("\\")) {
    /// Removes the leading \ in case of windows
    localePath = localePath.substring(1);
    logger.info(`Made some magic on the path to make it windows like. New path: ${localePath}`);
  }

  const fileExists = fs.existsSync(localePath);
  if (fileExists) {
    config.fastfilePath = localePath;
    if (refreshView) { populateView(config); }
  } else {
    logger.warn("Failed to access the file");
  }
}

/**
 * Populates the activity bar view with available lanes
 * @param config
 */
function populateView(config: Config) {
  try {
    _lanes = parseFastfile(config.fastfilePath);
    let provider = new LaneGroupProvider(_lanes, config);
    vscode.window.createTreeView("available_commands", {
      treeDataProvider: provider,
    });
  } catch (e) {
    logger.error(`Got error while creating tree view: ${e}`);
    if (e instanceof Error && e.stack) {
      logger.error(e.stack);
    } else {
      logger.warn("Missing error's stacktrace");
    }
    vscode.window.showErrorMessage("Got error while parsing Fastfile");
  }
}
