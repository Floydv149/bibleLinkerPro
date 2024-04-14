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
			pluginLanguage === "en" || pluginLanguage === "nl"
				? translations[pluginLanguage]
				: {};

		return langBase;
	}

	async onload() {
		await this.loadSettings();

		console.log("Bible linker Pro V." + this.currentPluginVersion);

		if (this.settings.pluginLanguage == "?") {
			if (moment.locale() == "en" || moment.locale() == "nl") {
				this.settings.pluginLanguage = moment.locale();
			} else {
				this.settings.pluginLanguage = "en";
			}
		}

		await this.saveSettings();

		const errorModal = new ErrorModal(this.app);

		this.registerEvent(
			this.app.workspace.on(
				"editor-menu",
				(menu, editor, view: MarkdownView) => {
					menu.addItem((item) => {
						item.setTitle("Convert Bible text to JW Library link")
							.setIcon("link")
							.onClick(async () => {
								convertSelectionToLinks(editor, view);
							});
					});
				}
			)
		);

		const bibleBooksEN = [
			["ge", "gen", "genesis"],
			["ex", "exodus"],
			["le", "lev", "leviticus"],
			["nu", "num", "numbers"],
			["de", "deut", "deuteronomy"],
			["jos", "josh", "joshua"],
			["jg", "judg", "judges"],
			["ru", "ruth"],
			["1sa", "1sam", "1samuel"],
			["2sa", "2sam", "2samuel"],
			["1ki", "1kings"],
			["2ki", "2kings"],
			["1ch", "1chron", "1chronicles"],
			["2ch", "2chron", "2chronicles"],
			["ezr", "ezra"],
			["ne", "neh", "nehemiah"],
			["es", "esther"],
			["job", "job"],
			["ps", "psalms", "psalm"],
			["pr", "prov", "proverbs"],
			["ec", "eccl", "ecclesiastes"],
			["ca", "song of sol", "song of solomon"],
			["isa", "isa", "isaiah"],
			["jer", "jer", "jeremiah"],
			["la", "lam", "lamentations"],
			["eze", "ezek", "ezekiel"],
			["da", "dan", "daniël"],
			["ho", "hos", "hosea"],
			["joe", "joel"],
			["am", "amos"],
			["ob", "obad", "obadiah"],
			["jon", "jonah"],
			["mic", "mic", "micah"],
			["na", "nah", "nahum"],
			["hab", "habakkuk"],
			["zep", "zeph", "zephaniah"],
			["hag", "haggaï"],
			["zec", "zech", "zechariah"],
			["mal", "malachi"],
			["mt", "matt", "matthew"],
			["mr", "mark", "mark"],
			["lu", "luke"],
			["joh", "john"],
			["ac", "acts"],
			["ro", "rom", "romans"],
			["1co", "1cor", "1corinthians"],
			["2co", "2cor", "2corinthians"],
			["ga", "gal", "galatians"],
			["eph", "ephesians"],
			["php", "phil", "philippians"],
			["col", "kolossenzen", "colossians"],
			["1th", "1thess", "1thessalonians"],
			["2th", "2thess", "2thessalonians"],
			["1ti", "1tim", "1timothy"],
			["2ti", "2tim", "2timothy"],
			["tit", "titus"],
			["phm", "philem", "philemon"],
			["heb", "hebr", "hebrews"],
			["jas", "james"],
			["1pe", "1pet", "1peter"],
			["2pe", "2pet", "2peter"],
			["1jo", "1john"],
			["2jo", "2john"],
			["3jo", "3john"],
			["jude", "jude"],
			["re", "rev", "revelation"],
		];

		const bibleBooksNL = [
			["ge", "gen", "genesis"],
			["ex", "exodus"],
			["le", "lev", "leviticus"],
			["nu", "num", "numeri"],
			["de", "deut", "deuteronomium"],
			["joz", "jozua"],
			["re", "recht", "rechters"],
			["ru", "ruth"],
			["1sa", "1sam", "1samuël"],
			["2sa", "2sam", "2samuël"],
			["1kon", "1koningen"],
			["2kon", "2koningen"],
			["1kr", "1kronieken"],
			["2kr", "2kronieken"],
			["ezr", "ezra"],
			["ne", "nehemiah"],
			["es", "esther"],
			["job", "job"],
			["ps", "psalmen", "psalm"],
			["sp", "spr", "spreuken"],
			["pr", "pred", "prediker"],
			["hgl", "hooglied"],
			["jes", "jesaja"],
			["jer", "jeremia"],
			["klg", "klaagl", "klaagliederen"],
			["ez", "ezech", "ezechiël"],
			["da", "dan", "daniël"],
			["ho", "hos", "hosea"],
			["joë", "joël"],
			["am", "amos"],
			["ob", "obad", "obadja"],
			["jon", "jona"],
			["mi", "micha"],
			["na", "nah", "nahum"],
			["hab", "habakuk"],
			["ze", "zef", "zefanja"],
			["hag", "haggaï"],
			["za", "zach", "zacharia"],
			["mal", "maleachi"],
			["mt", "matth", "mattheüs"],
			["mr", "mark", "markus"],
			["lu", "luk", "lukas"],
			["jo", "joh", "johannes"],
			["han", "hand", "handelingen"],
			["ro", "rom", "romeinen"],
			["1kor", "1korinthiërs"],
			["2kor", "2korinthiërs"],
			["ga", "gal", "galaten"],
			["ef", "efeziërs"],
			["fil", "filippenzen"],
			["kol", "kolossenzen"],
			["1th", "1thess", "1thessalonicenzen"],
			["2th", "2thess", "2thessalonicenzen"],
			["1ti", "1tim", "1timotheüs"],
			["2ti", "2tim", "2timotheüs"],
			["tit", "titus"],
			["flm", "filem", "filemon"],
			["heb", "hebr", "hebreeën"],
			["jak", "jakobus"],
			["1pe", "1petr", "1petrus"],
			["2pe", "2petr", "2petrus"],
			["1jo", "1joh", "1johannes"],
			["2jo", "2joh", "2johannes"],
			["3jo", "3joh", "3johannes"],
			["ju", "jud", "judas"],
			["opb", "openb", "openbaring"],
		];

		const getCorrectBibleBooksLanguage = () => {
			let bibleBooks = bibleBooksEN;

			if (this.settings.pluginLanguage == "nl") {
				bibleBooks = bibleBooksNL;
			}

			return bibleBooks;
		};

		const convertSelectionToLinks = (
			editor: Editor,
			view: MarkdownView
		) => {
			let selectionInput;
			let finalOutput = "";
			let lastEndIndex = 0;
			const bibleBooks = getCorrectBibleBooksLanguage();

			if (this.settings.autoGetLine) {
				if (editor.getSelection().length > 0) {
					selectionInput = editor.getSelection();
				} else {
					selectionInput = editor.getLine(editor.getCursor().line);
					editor.setLine(editor.getCursor().line, "");
				}
			} else {
				selectionInput = editor.getSelection();
			}

			selectionInput = selectionInput.trim();

			console.log("Selection input: " + selectionInput);

			for (
				let charI = 0;
				charI < selectionInput.length;
				charI +=
					selectionInput.substring(charI).split(" ")[0].length + 1
			) {
				console.log(
					"part to check:" +
						selectionInput.substring(charI).split(" ")[0]
				);

				// console.log("loop1: " + charI);
				//Find bible text start index
				for (let i = 0; i < bibleBooks.length; i++) {
					// console.log("loop2: " + i);
					for (let j = 0; j < bibleBooks[i].length; j++) {
						// console.log("loop3: " + j);

						let searchString = selectionInput.substring(charI);
						let hasPrefixNumber = false;

						if (selectionInput.substring(charI, charI + 1) == "(") {
							searchString = selectionInput.substring(charI + 1);
							console.log("cor:" + searchString);
							charI++;
						}

						if (
							["1 ", "2 ", "3 "].includes(
								selectionInput.substring(charI - 2, charI)
							)
						) {
							console.log("has prefix number");
							searchString =
								selectionInput.substring(charI - 2, charI - 1) +
								selectionInput.substring(charI);
							console.log(
								"adjusted searchString: " + searchString
							);
							selectionInput =
								selectionInput.substring(0, charI - 2) +
								selectionInput.substring(charI - 2, charI - 1) +
								selectionInput.substring(charI);
							console.log(
								"adjusted selectionInput: " + selectionInput
							);
							charI--;
							hasPrefixNumber = true;
						} else {
							console.log("sBefore: " + searchString);
							searchString = selectionInput.substring(charI);
							console.log("sAfter: " + searchString);
						}

						const foundStartIndex =
							searchString.split(" ")[0].toLowerCase() ==
							bibleBooks[i][j];

						console.log(
							"text:" + searchString.split(" ")[0].toLowerCase()
						);
						console.log("bible:" + bibleBooks[i][j]);

						console.log("foundStartIndex: " + foundStartIndex);

						if (foundStartIndex) {
							console.log("passed 1st check");
							const startIndex = charI;
							// charI - (hasPrefixNumber ? 1 : 0);

							console.log(searchString.substring(charI));

							let searchEndIndex = startIndex;

							if (
								selectionInput.substring(
									startIndex +
										selectionInput
											.substring(startIndex)
											.split(" ")[0].length,
									startIndex +
										selectionInput
											.substring(startIndex)
											.split(" ")[0].length +
										1
								) == " " &&
								[
									"0",
									"1",
									"2",
									"3",
									"4",
									"5",
									"6",
									"7",
									"8",
									"9",
									" ",
									",",
									":",
									"-",
								].includes(
									selectionInput.substring(
										startIndex +
											selectionInput
												.substring(startIndex)
												.split(" ")[0].length +
											1,
										startIndex +
											selectionInput
												.substring(startIndex)
												.split(" ")[0].length +
											2
									)
								)
							) {
								console.log("passed 2nd check");
								// Find bible text end index
								for (
									let k =
										startIndex +
										selectionInput
											.substring(startIndex)
											.split(" ")[hasPrefixNumber ? 2 : 0]
											.length +
										1;
									k < selectionInput.length;
									k++
								) {
									if (
										![
											"0",
											"1",
											"2",
											"3",
											"4",
											"5",
											"6",
											"7",
											"8",
											"9",
											" ",
											",",
											":",
											"-",
										].includes(
											selectionInput.substring(k, k + 1)
										)
									) {
										searchEndIndex = k;
										k = selectionInput.length;
									} else {
										searchEndIndex = k + 1;
									}
								}

								const endIndex = searchEndIndex;

								console.log(
									"Found bible text: " +
										selectionInput.substring(
											startIndex,
											endIndex
										)
								);

								console.log(
									"to be converted text:" +
										selectionInput.substring(
											startIndex,
											endIndex
										)
								);

								const linkOutput =
									convertBibleTextToJWLibraryLink(
										selectionInput.substring(
											startIndex,
											endIndex
										)
									);

								finalOutput +=
									selectionInput.substring(
										lastEndIndex,
										startIndex
									) + linkOutput;

								lastEndIndex = endIndex;

								//Continue from end index
								charI = endIndex;
							}
						}
					}
				}
			}

			finalOutput += selectionInput.substring(lastEndIndex);

			editor.replaceSelection(finalOutput);
		};

		const convertBibleTextToJWLibraryLink = (input: string) => {
			try {
				const bibleBooks = getCorrectBibleBooksLanguage();
				let linkOutput = "";
				let context = "";
				let bibleBookLong;
				let bibleBookHasNumber = false;

				console.log(input);

				if ([1, 2, 3].includes(parseInt(input.substring(0, 1)))) {
					if (input.substring(1, 2) == " ") {
						input = input.substring(0, 1) + input.substring(2);
					}
					bibleBookHasNumber = true;
				}

				const bibleBookQuery = input.split(" ")[0].toLowerCase();
				for (let i = 0; i < bibleBooks.length; i++) {
					if (bibleBooks[i].includes(bibleBookQuery)) {
						if (i.toString().length == 1) {
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

				console.log("Render output: " + renderOutput);

				// editor.replaceSelection(
				// 	"[" +
				// 		renderOutput +
				// 		"](jwlibrary:///finder?bible=" +
				// 		linkOutput +
				// 		")"
				// );

				if (this.settings.autoOpenLink) {
					window.open("jwlibrary:///finder?bible=" + linkOutput);
				}

				return (
					"[" +
					renderOutput +
					"](jwlibrary:///finder?bible=" +
					linkOutput +
					")"
				);
			} catch (error) {
				//If an error occurs, replace text with initial input
				// if (input != null) {
				// 	editor.replaceSelection(input);
				// }

				//Show error modal
				errorModal.setText(this.getTranslation("INVALID_INPUT"));
				errorModal.open();

				return "";
			}
		};

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "convert-Bible-texts-to-JW-Library-links",
			name: "Convert Bible texts to JW Library links",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				convertSelectionToLinks(editor, view);
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MainSettingTab(this.app, this));

		//Update notes modal
		if (this.currentPluginVersion != this.settings.lastVersion) {
			this.settings.lastVersion = this.currentPluginVersion;
			this.saveSettings();
			new UpdateNotesModal(this.app).open();
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

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h2", {
			text: "New update to Bible linker Pro",
		});
		contentEl.createEl("h3", { text: "What's new?" });
		contentEl.createEl("p", {
			text: "-   Fixed a bug that converted 'Psalms' to 'Psalms'.",
		});

		const dismisButton = contentEl.createEl("button", {
			text: "Dismiss",
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
