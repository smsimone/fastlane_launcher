import * as fs from 'fs';
import * as vscode from 'vscode';
import { Config } from './config';
import { LaneProvider } from './lane';
import { LocalStorageService } from './localStorage';
import { parseFastfile } from './parser';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	let storageManager = new LocalStorageService(context.workspaceState);

	let config = new Config(storageManager);

	getFastfilePath(config);

	/**
	 * The command that allows the user to pick a lane
	 */
	context.subscriptions.push(vscode.commands.registerCommand('fastlane-launcher.showCommands', () => {
		let commands = parseFastfile(config.fastfilePath);
		var quickPick = vscode.window.createQuickPick();
		quickPick.items = commands;
		quickPick.show();
		quickPick.onDidAccept(() => {
			var items = quickPick.selectedItems;
			items.forEach((item) => { executeShellCommand(`fastlane ${item.label}`, `Lane: ${item.label}`); });
			quickPick.dispose();
		});
	}));

	/**
	* Allows the use to change fastfile's path 
	*/
	context.subscriptions.push(vscode.commands.registerCommand('fastlane-launcher.changeFastfilePath', () => {
		getFastfilePath(config);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('fastlane-launcher.executeShell', (args: string) => {
		executeShellCommand(args, `Lane: ${args.split(" ")[1]}`);
	}));
}

// this method is called when your extension is deactivated
export function deactivate() { }

/**
 * Creates a shell and executes the selected lane
 */
function executeShellCommand(command: string, shellName: string = 'Fastlane launcher') {
	let terminal = vscode.window.createTerminal({
		name: shellName,
	});
	terminal.show();
	console.log(`Running command ${command}`);
	terminal.sendText(command);
}

/**
 * Sets the `config.fastFilePath` to a new value
 * @param config 
 */
async function getFastfilePath(config: Config) {
	let fastfilePath = config.fastfilePath;

	if (fastfilePath) {
		populateView(config);
		return;
	}

	let path: string | undefined;
	while (!path) {
		path = await vscode.window.showInputBox({
			title: 'Input the path to Fastfile',
		});
		if (path && fs.existsSync(path!) && fs.statSync(path!).isFile()) {
			config.fastfilePath = path!;
			fastfilePath = path!;
		} else {
			vscode.window.showErrorMessage("The path you've inserted is not valid");
			path = undefined;
		}
	}
	config.fastfilePath = fastfilePath;
	populateView(config);
}

/**
 * Populates the activity bar view with available lanes
 * @param config 
 */
function populateView(config: Config) {
	let provider = new LaneProvider(parseFastfile(config.fastfilePath));

	vscode.window.createTreeView('available_commands', {
		treeDataProvider: provider
	});

}