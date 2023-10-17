import {
	// App,
	Editor,
	MarkdownView,
	// Modal,
	// Notice,
	Plugin,
	// PluginSettingTab,
	// Setting,
} from "obsidian";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon(
		// 	"globe",
		// 	"Sample Plugin",
		// 	(evt: MouseEvent) => {
		// 		// Called when the user clicks the icon.
		// 		new Notice("Go to jw.org!");
		// 	}
		// );
		// Perform additional things with the ribbon
		// ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText("Status Bar Text");

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: "open-sample-modal-simple",
		// 	name: "Functie",
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	},
		// });

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "sample-editor-command",
			name: "Sample editor command",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());

				const input = editor.getSelection();
				const bibleBooks = [
					"ge",
					"ex",
					"le",
					"nu",
					"de",
					"joz",
					"re",
					"ru",
					"1sa",
					"2sa",
					"1kon",
					"2kon",
					"1kr",
					"2kr",
					"ezr",
					"ne",
					"es",
					"job",
					"ps",
					"sp",
					"pr",
					"hgl",
					"jes",
					"jer",
					"klg",
					"ez",
					"da",
					"ho",
					"joë",
					"am",
					"ob",
					"jon",
					"mi",
					"na",
					"hab",
					"ze",
					"hag",
					"za",
					"mal",
					"mt",
					"mr",
					"lu",
					"jo",
					"han",
					"ro",
					"1kor",
					"2kor",
					"ga",
					"ef",
					"fil",
					"kol",
					"1th",
					"2th",
					"1ti",
					"2ti",
					"tit",
					"flm",
					"heb",
					"jak",
					"1pe",
					"2pe",
					"1jo",
					"2jo",
					"3 jo",
					"ju",
					"opb",
				];

				let output = "";
				let context = "";

				const bibleBookQuery = input.split(" ")[0].toLowerCase();
				console.log(bibleBookQuery);
				for (let i = 0; i < bibleBooks.length; i++) {
					if (bibleBookQuery === bibleBooks[i]) {
						if (i.toString().length == 1) {
							output += "0" + (i = 1);
						} else {
							output += i + 1;
						}
						i = bibleBooks.length;
					}
				}

				let chapter = input.split(" ")[1];
				chapter = chapter.split(":")[0];
				if (chapter.length == 1) {
					output += "00" + chapter;
				} else if (chapter.length == 2) {
					output += "0" + chapter;
				} else {
					output += chapter;
				}

				context += output;

				let verse = input.split(" ")[1];
				verse = verse.split(":")[1];
				verse = verse.split("-")[0];
				if (verse.length == 1) {
					output += "00" + verse;
				} else if (verse.length == 2) {
					output += "0" + verse;
				} else {
					output += verse;
				}

				const verseContinue = input.split("-")[1];
				if (verseContinue != undefined) {
					output += "-" + context;
					if (verseContinue.length == 1) {
						output += "00" + verseContinue;
					} else if (verseContinue.length == 2) {
						output += "0" + verseContinue;
					} else {
						output += verseContinue;
					}
				}

				editor.replaceSelection(
					"[" + input + "](jwlibrary:///finder?bible=" + output + ")"
				);
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: "open-sample-modal-complex",
		// 	name: "Open sample modal (complex)",
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView =
		// 			this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	},
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// 	console.log("click", evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		const { contentEl } = this;
// 		contentEl.setText("Woah!");
// 	}

// 	onClose() {
// 		const { contentEl } = this;
// 		contentEl.empty();
// 	}
// }

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const { containerEl } = this;

// 		containerEl.empty();

// 		new Setting(containerEl)
// 			.setName("Setting #1")
// 			.setDesc("It's a secret")
// 			.addText((text) =>
// 				text
// 					.setPlaceholder("Enter your secret")
// 					.setValue(this.plugin.settings.mySetting)
// 					.onChange(async (value) => {
// 						this.plugin.settings.mySetting = value;
// 						await this.plugin.saveSettings();
// 					})
// 			);
// 	}
// }
