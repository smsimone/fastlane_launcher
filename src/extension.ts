import * as fs from 'fs';
import * as vscode from 'vscode';
import { Config } from './config';
import { parseFastfile } from './parser';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	let config = new Config();

	let fastfilePath = config.fastfilePath;
	if (fastfilePath.length === 0) {
		console.log("No Fastfile path defined");
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
	}

	let commands = parseFastfile(fastfilePath);

	/**
	 * The command that allows the user to pick a lane
	 */
	context.subscriptions.push(vscode.commands.registerCommand('fastlane-launcher.showCommands', () => {
		var quickPick = vscode.window.createQuickPick();
		quickPick.items = commands;
		quickPick.show();
		quickPick.onDidAccept(() => {
			var items = quickPick.selectedItems;
			items.forEach((item) => { console.log(`Picked ${item.label}`); });
			quickPick.dispose();
		});
	}));

}

// this method is called when your extension is deactivated
export function deactivate() { }
