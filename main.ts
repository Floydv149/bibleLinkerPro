import { MainSettingTab } from "settings";
// import { ExampleView, VIEW_TYPE_EXAMPLE } from "ExampleView";

import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Plugin,
	// Menu,
	// Notice,
	// WorkspaceLeaf,
} from "obsidian";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	expandBibleBookName: boolean;
	autoGetLine: boolean;
	makeBold: boolean;
	makeItalic: boolean;
	linkPrefix: string;
	linkSuffix: string;
}

const DEFAULT_SETTINGS: Partial<MyPluginSettings> = {
	expandBibleBookName: false,
	autoGetLine: false,
	makeBold: false,
	makeItalic: false,
	linkPrefix: "",
	linkSuffix: "",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// this.registerView(VIEW_TYPE_EXAMPLE, (leaf) => new ExampleView(leaf));

		// this.addRibbonIcon("dice", "Activate view", () => {
		// 	this.activateView();
		// });

		this.registerEvent(
			this.app.workspace.on(
				"editor-menu",
				(menu, editor, view: MarkdownView) => {
					menu.addItem((item) => {
						item.setTitle("Convert Bible text to JW Library link")
							.setIcon("link")
							.onClick(async () => {
								convertBibleTextToJWLibraryLink(editor, view);
							});
					});
				}
			)
		);

		const convertBibleTextToJWLibraryLink = (
			editor: Editor,
			view: MarkdownView
		) => {
			try {
				let input;

				if (this.settings.autoGetLine) {
					input = editor.getLine(editor.getCursor().line);
					editor.setLine(editor.getCursor().line, "");
				} else {
					input = editor.getSelection();
				}
				const bibleBooksShort = [
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

				const bibleBooksLong = [
					"Genesis",
					"Exodus",
					"Leviticus",
					"Numeri",
					"Deuteronomium",
					"Jozua",
					"Rechters",
					"Ruth",
					"1 Samuël",
					"2 Samuël",
					"1 Koningen",
					"2 Koningen",
					"1 Kronieken",
					"2 Kronieken",
					"Ezra",
					"Nehemia",
					"Esther",
					"Job",
					"Psalmen",
					"Spreuken",
					"Prediker",
					"Hooglied",
					"Jesaja",
					"Jeremia",
					"Klaagliederen",
					"Ezechiël",
					"Daniël",
					"Hosea",
					"Joël",
					"Amos",
					"Obadja",
					"Jona",
					"Micha",
					"Nahum",
					"Habakuk",
					"Zefanja",
					"Haggaï",
					"Zacharia",
					"Maleachi",
					"Mattheüs",
					"Markus",
					"Lukas",
					"Johannes",
					"Handelingen",
					"Romeinen",
					"1 Korinthiërs",
					"2 Korinthiërs",
					"Galaten",
					"Efeziërs",
					"Filippenzen",
					"Kolossenzen",
					"1 Thessalonicenzen",
					"2 Thessalonicenzen",
					"1 Timotheüs",
					"2 Timotheüs",
					"Titus",
					"Filemon",
					"Hebreeën",
					"Jakobus",
					"1 Petrus",
					"2 Petrus",
					"1 Johannes",
					"2 Johannes",
					"3 Johannes",
					"Judas",
					"Openbaring",
				];

				let output = "";
				let context = "";
				let bibleBookLong;

				const bibleBookQuery = input.split(" ")[0].toLowerCase();
				for (let i = 0; i < bibleBooksShort.length; i++) {
					if (bibleBookQuery === bibleBooksShort[i]) {
						if (i.toString().length == 1) {
							output += "0" + (i + 1);
						} else {
							output += i + 1;
						}
						bibleBookLong = bibleBooksLong[i];
						i = bibleBooksShort.length;
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

				let renderOutput;

				if (this.settings.expandBibleBookName) {
					renderOutput = bibleBookLong + " " + input.split(" ")[1];
				} else {
					renderOutput = input;
				}

				if (this.settings.makeBold) {
					renderOutput = "**" + renderOutput + "**";
				}
				if (this.settings.makeItalic) {
					renderOutput = "*" + renderOutput + "*";
				}

				renderOutput =
					this.settings.linkPrefix +
					renderOutput +
					this.settings.linkSuffix;

				editor.replaceSelection(
					"[" +
						renderOutput +
						"](jwlibrary:///finder?bible=" +
						output +
						")"
				);
			} catch (error) {
				new InvalidInputModal(this.app).open();
			}
		};

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "convert-Bible-text-to-JW-Library-link",
			name: "Convert Bible text to JW Library link",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				convertBibleTextToJWLibraryLink(editor, view);
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MainSettingTab(this.app, this));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	// async activateView() {
	// 	const { workspace } = this.app;

	// 	let leaf: WorkspaceLeaf | null = null;
	// 	const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);

	// 	if (leaves.length > 0) {
	// 		// A leaf with our view already exists, use that
	// 		leaf = leaves[0];
	// 	} else {
	// 		// Our view could not be found in the workspace, create a new leaf
	// 		// in the right sidebar for it
	// 		leaf = workspace.getRightLeaf(false);
	// 		await leaf.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });
	// 	}
	// 	workspace.revealLeaf(leaf);
	// }

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

class InvalidInputModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText(
			"Invalid Bible text input! Before you execute this command you need to select a valid Bible text like: '1th 1:3-8'."
		);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
