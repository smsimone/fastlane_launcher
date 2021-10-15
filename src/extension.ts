import * as fs from 'fs';
import * as vscode from 'vscode';
import { Config } from './config';
import { LaneGroupProvider, LaneProvider } from './lane';
import { LocalStorageService } from './localStorage';
import { parseFastfile } from './parser';
import { StringQuickPick } from './stringQuickPick';

export async function activate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage("Fastlane launcher has been activated");

	let storageManager = new LocalStorageService(context.workspaceState);

	let config: Config = new Config(storageManager);



	vscode.workspace.onDidChangeConfiguration(event => {
		let affected = event.affectsConfiguration("fastlane-launcher");
		if (affected) {
			console.log("Should reload configuration");
			config = new Config(storageManager);
		}

		if (!config.fastfilePath) {
			getFastfilePath(config);
		} else {
			populateView(config);
		}
	});

	/**
	 * If the saved document is the Fasftile, it will be reloaded
	 */
	vscode.workspace.onDidSaveTextDocument(event => { if (event.fileName.includes('Fastfile')) { populateView(config); } });

	if (!config.fastfilePath) {
		getFastfilePath(config);
	} else {
		populateView(config);
	}


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
			items.forEach((item) => { executeShellCommand(`${config.fastlaneCommand} ${item.label}`, `Lane: ${item.label}`); });
			quickPick.dispose();
		});
	}));

	/**
	* Allows the use to change fastfile's path 
	*/
	context.subscriptions.push(vscode.commands.registerCommand('fastlane-launcher.changeFastfilePath', () => { getFastfilePath(config); }));

	/**
	 * Executes a custom command passed in @param args in the integrated terminal
	 */
	context.subscriptions.push(vscode.commands.registerCommand('fastlane-launcher.executeShell', (args: string) => { executeShellCommand(args, `Lane: ${args.split(" ")[1]}`); }));
}

// this method is called when your extension is deactivated
export function deactivate() {
	vscode.window.showWarningMessage("Fastlane launcher has been deactivated");
}

/**
 * Creates a shell and executes the selected lane
 */
function executeShellCommand(command: string, shellName: string = 'Fastlane launcher') {
	let terminal = vscode.window.createTerminal({ name: shellName });
	terminal.show();
	terminal.sendText(command);
}

/**
 * Sets the `config.fastFilePath` to a new value
 * @param config 
 */
async function getFastfilePath(config: Config) {

	let fastfilePath: string = '';

	let path: string | undefined;

	const uris = await vscode.workspace.findFiles('**/Fastfile', null);

	console.log(`[FASTLANE-LAUNCHER] Found uris: ${uris}`);

	if (uris.length > 1) {
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
	}


	if (uris.length === 1) {
		fastfilePath = uris[0].path;
		console.log(`Found fastfile at ${path}`);
	} else {
		console.log('[FASTLANE-LAUNCHER] Requesting the path to the user');
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
	}

	config.fastfilePath = fastfilePath;

	populateView(config);
}

/**
 * Populates the activity bar view with available lanes
 * @param config 
 */
function populateView(config: Config) {
	try {
		const lanes = parseFastfile(config.fastfilePath);
		let provider = new LaneGroupProvider(lanes, config);

		vscode.window.createTreeView('available_commands', {
			treeDataProvider: provider
		});
	} catch (e) {
		console.error(`Got error while creating tree view: ${e}`);
		vscode.window.showErrorMessage("Got error while parsing Fastfile");
	}
}