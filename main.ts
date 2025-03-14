import { MainSettingTab } from "settings";
// import { ExampleView, VIEW_TYPE_EXAMPLE } from "ExampleView";
import * as translations from "translations.json";
import { moment } from "obsidian";

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

interface PluginSettings {
	pluginLanguage: string;
	bibleEdition: string;
	expandBibleBookName: boolean;
	capitalizeFirstCharBibleBookName: boolean;
	addSpaceAfterBibleBookNumber: boolean;
	autoGetLine: boolean;
	autoOpenLink: boolean;
	makeBold: boolean;
	makeItalic: boolean;
	linkPrefix: string;
	linkSuffix: string;
	lastVersion: string;
}

const DEFAULT_SETTINGS: Partial<PluginSettings> = {
	pluginLanguage: "?",
	bibleEdition: "nwtsty",
	expandBibleBookName: true,
	capitalizeFirstCharBibleBookName: true,
	addSpaceAfterBibleBookNumber: true,
	autoGetLine: false,
	autoOpenLink: false,
	makeBold: false,
	makeItalic: false,
	linkPrefix: "",
	linkSuffix: "",
	lastVersion: "",
};

const translationsTyped: { [key: string]: { [key: string]: string } } =
	translations;

export default class BibleLinkerPro extends Plugin {
	settings: PluginSettings;

	//Set current plugin version
	currentPluginVersion = this.manifest.version;

	getTranslation(key: string) {
		const langBase = this.getLangBase();
		const attemptTranslating =
			typeof langBase[key] !== "undefined" ? langBase[key] : undefined;
		if (typeof attemptTranslating !== "undefined") {
			return attemptTranslating;
		}
		return key;
	}

	getLangBase(): { [key: string]: string } {
		const pluginLanguage = this.settings.pluginLanguage;
		const langBase: { [key: string]: string } =
			translationsTyped.hasOwnProperty(pluginLanguage)
				? translationsTyped[pluginLanguage]
				: {};

		return langBase;
	}

	async onload() {
		await this.loadSettings();

		console.log("Bible linker Pro V." + this.currentPluginVersion);

		if (this.settings.pluginLanguage == "?") {
			if (translationsTyped.hasOwnProperty(moment.locale())) {
				this.settings.pluginLanguage = moment.locale();
			} else {
				this.settings.pluginLanguage = "en";
			}
		}

		await this.saveSettings();

		// this.registerView(VIEW_TYPE_EXAMPLE, (leaf) => new ExampleView(leaf));

		// this.addRibbonIcon("canvas", "Activate view", () => {
		// 	this.activateView();
		// });

		const errorModal = new ErrorModal(this.app);

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
			let input;
			try {
				if (this.settings.autoGetLine) {
					if (editor.getSelection().length > 0) {
						input = editor.getSelection();
					} else {
						input = editor.getLine(editor.getCursor().line);
						editor.setLine(editor.getCursor().line, "");
					}
				} else {
					input = editor.getSelection();
				}

				input = input.trim();

				let wtLocale = wtLocaleEN;
				let bibleBooks = bibleBooksEN;

				if (this.settings.pluginLanguage == "nl") {
					wtLocale = wtLocaleNL;
					bibleBooks = bibleBooksNL;
				} else if (this.settings.pluginLanguage == "fr") {
					wtLocale = wtLocaleFR;
					bibleBooks = bibleBooksFR;
				} else if (this.settings.pluginLanguage == "pt-br") {
					wtLocale = wtLocalePtBr;
					bibleBooks = bibleBooksPtBr;
				} else if (this.settings.pluginLanguage == "de") {
					wtLocale = wtLocaleDE;
					bibleBooks = bibleBooksDE;
				} else if (this.settings.pluginLanguage == "es") {
					wtLocale = wtLocaleES;
					bibleBooks = bibleBooksES;
				} else if (this.settings.pluginLanguage == "fi") {
					wtLocale = wtLocaleFI;
					bibleBooks = bibleBooksFI;
				}

				let linkOutput = "";
				let context = "";
				let bibleBookLong;
				let bibleBookHasNumber = false;

				if ([1, 2, 3, 4, 5].includes(parseInt(input.substring(0, 1)))) {
					if (input.substring(1, 2) == " ") {
						input = input.substring(0, 1) + input.substring(2);
					}
					bibleBookHasNumber = true;
				}

				const bibleBookQuery = input.split(" ")[0].toLowerCase();
				for (let i = 0; i < bibleBooks.length; i++) {
					if (bibleBooks[i].includes(bibleBookQuery)) {
						if ((i + 1).toString().length == 1) {
							linkOutput += "0" + (i + 1);
						} else {
							linkOutput += i + 1;
						}
						bibleBookLong = bibleBooks[i][bibleBooks[i].length - 1];
						i = bibleBooks.length;
					}
				}

				let chapter = input.split(" ")[1];
				chapter = chapter.split(":")[0];
				if (chapter.length == 1) {
					linkOutput += "00" + chapter;
				} else if (chapter.length == 2) {
					linkOutput += "0" + chapter;
				} else {
					linkOutput += chapter;
				}

				context += linkOutput;

				let verse = input.split(" ")[1];
				verse = verse.split(":")[1];
				if (verse.includes("-")) {
					verse = verse.split("-")[0];
				} else if (input.includes(",")) {
					verse = verse.split(",")[0];
				}
				if (verse.length == 1) {
					linkOutput += "00" + verse;
				} else if (verse.length == 2) {
					linkOutput += "0" + verse;
				} else {
					linkOutput += verse;
				}

				let verseContinue = "";

				if (input.includes("-")) {
					verseContinue = input.split("-")[1];
				} else if (input.includes(",")) {
					verseContinue = input.split(",")[1];
					if (verseContinue.substring(0, 1) == " ") {
						verseContinue = verseContinue.substring(1);
					}
				}
				if (verseContinue != undefined && verseContinue != "") {
					linkOutput += "-" + context;
					if (verseContinue.length == 1) {
						linkOutput += "00" + verseContinue;
					} else if (verseContinue.length == 2) {
						linkOutput += "0" + verseContinue;
					} else {
						linkOutput += verseContinue;
					}
				}

				let renderOutput;

				if (this.settings.expandBibleBookName) {
					if (
						this.settings.addSpaceAfterBibleBookNumber &&
						bibleBookHasNumber
					) {
						renderOutput =
							bibleBookLong?.substring(0, 1) +
							" " +
							bibleBookLong?.slice(1) +
							" " +
							input.split(" ")[1];
						if (input.split(" ")[2]) {
							renderOutput += " " + input.split(" ")[2];
						}
					} else {
						renderOutput =
							bibleBookLong + " " + input.split(" ")[1];
						if (input.split(" ")[2]) {
							renderOutput += " " + input.split(" ")[2];
						}
					}
				} else {
					if (
						this.settings.addSpaceAfterBibleBookNumber &&
						bibleBookHasNumber
					) {
						renderOutput =
							input.substring(0, 1) + " " + input.slice(1);
					} else {
						renderOutput = input;
					}
				}

				if (this.settings.capitalizeFirstCharBibleBookName) {
					if (bibleBookHasNumber) {
						if (this.settings.addSpaceAfterBibleBookNumber) {
							renderOutput =
								renderOutput.substring(0, 2) +
								renderOutput.charAt(2).toUpperCase() +
								renderOutput.slice(3);
						} else {
							renderOutput =
								renderOutput.substring(0, 1) +
								renderOutput.charAt(1).toUpperCase() +
								renderOutput.slice(2);
						}
					} else {
						renderOutput =
							renderOutput.charAt(0).toUpperCase() +
							renderOutput.slice(1);
					}
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

				const link = `jwlibrary:///finder?srcid=jwlshare&wtlocale=${wtLocale}&prefer=lang&pub=${this.settings.bibleEdition}&bible=${linkOutput}`;
				editor.replaceSelection("[" + renderOutput + "](" + link + ")");

				if (this.settings.autoOpenLink) {
					window.open(link);
				}
			} catch (error) {
				//If an error occurs, replace text with initial input
				if (input != null) {
					editor.replaceSelection(input);
				}

				//Show error modal
				errorModal.setText(this.getTranslation("INVALID_INPUT"));
				errorModal.open();
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

		//Update notes modal
		if (this.currentPluginVersion != this.settings.lastVersion) {
			this.settings.lastVersion = this.currentPluginVersion;
			this.saveSettings();
			new UpdateNotesModal(this.app)
				.receiveVersion(this.currentPluginVersion)
				.open();
		}
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

class ErrorModal extends Modal {
	plugin: BibleLinkerPro;

	constructor(app: App) {
		super(app);
	}

	setText(text: string) {
		const { contentEl } = this;
		contentEl.createEl("p", {
			text: text,
		});
	}

	onOpen() {}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class UpdateNotesModal extends Modal {
	plugin: BibleLinkerPro;

	currentPluginVersion: string;

	constructor(app: App) {
		super(app);
	}

	receiveVersion(version: string) {
		this.currentPluginVersion = version;
		return this;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h2", {
			text:
				"🎉 New update for Bible linker Pro (" +
				this.currentPluginVersion +
				")",
		});
		contentEl.createEl("h3", { text: "What's new?" });
		contentEl.createEl("p", {
			text: "-   Fixed broken JW Libary links on Windows by @regapictures",
		});
		contentEl.createEl("p", { text: "-   Added Finnish by @amahlaka" });
		contentEl.createEl("p", {
			text: "-   Added Spanish by @Marc-Fernandez",
		});
		contentEl.createEl("p", {
			text: "-   Added setting to choose which edition of the Bible you want to use (nwt or nwtsty).",
		});
		contentEl.createEl("p", {
			text: "-   Fixed misspelled Genesis book in French by @DarkBuffalo",
		});
		contentEl.createEl("p", {
			text: "-   Fixed misspelled Daniel book in English by @emir1nemir",
		});

		const dismisButton = contentEl.createEl("button", {
			text: "Let's check it out!",
		});
		dismisButton.addEventListener("click", () => {
			this.close();
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
