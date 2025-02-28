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
					["sp", "spreuken"],
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

				const bibleBooksFR = [
					["ge", "gen", "genèse"],
					["ex", "exode"],
					["lv", "lev", "lévitique"],
					["nb", "nomb", "nombres"],
					["dt", "deut", "deuteronome"],
					["jos", "jos", "josué"],
					["jg", "juges"],
					["ru", "ruth"],
					["1s", "1sam", "1samuel"],
					["2s", "2sam", "2samuel"],
					["1r", "1rois"],
					["2r", "2rois"],
					["1ch", "1chron", "1chroniques"],
					["2ch", "2chron", "2chroniques"],
					["esd", "esdras"],
					["ne", "neh", "néhémie"],
					["est", "esther"],
					["jb", "job"],
					["ps", "psaumes"],
					["pr", "prov", "proverbes"],
					["ec", "eccl", "ecclésiaste"],
					["ct", "chant de S", "Chant de Salomon"],
					["is", "isïe"],
					["jr", "jer", "jérémie"],
					["la", "lam", "lamentations"],
					["ez", "ezech", "ézechiel"],
					["da", "dan", "daniel"],
					["os", "osée"],
					["jl", "joël"],
					["am", "amos"],
					["ab", "abd", "abdias"],
					["jon", "jonas"],
					["mi", "mich", "michée"],
					["na", "nah", "nahum"],
					["hab", "habacuc"],
					["sph", "soph", "sophonie"],
					["ag", "agg", "aggée"],
					["za", "zach", "zacharie"],
					["ml", "mal", "malachie"],
					["mt", "mat", "matthieu"],
					["mc", "marc"],
					["lc", "luc"],
					["jean", "jean"],
					["ac", "actes"],
					["rm", "rom", "romains"],
					["1co", "1cor", "1corinthiens"],
					["2co", "2cor", "2corinthiens"],
					["ga", "gal", "galate"],
					["eph", "éphesiens"],
					["php", "phil", "philippiens"],
					["col", "colossiens"],
					["1th", "1thess", "1thessaloniciens"],
					["2th", "2thess", "2thessaloniciens"],
					["1tm", "1tim", "1timothée"],
					["2tm", "2tim", "2timothée"],
					["tt", "tite"],
					["phm", "philem", "philemon"],
					["he", "heb", "hébreux"],
					["jc", "jacq", "jacques"],
					["1p", "1pierre"],
					["2p", "2pierre"],
					["1j", "1jean"],
					["2j", "2jean"],
					["3j", "3jean"],
					["jude", "jude"],
					["re", "rev", "révélation"],
				];

				const bibleBooksPtBr = [
					["gên", "gênesis"],
					["êx", "êxo", "êxodo"],
					["le", "lev", "levítico"],
					["n", "núm", "números"],
					["de", "deu", "deuteronômio"],
					["jos", "josué"],
					["jz", "juí", "juízes"],
					["ru", "rute"],
					["1sa", "1sam", "1samuel"],
					["2sa", "2sam", "2samuel"],
					["1rs", "1reis"],
					["2rs", "2reis"],
					["1cr", "1crô", "1crônicas"],
					["2cr", "2crô", "2crônicas"],
					["esd", "esd", "esdras"],
					["ne", "nee", "neemias"],
					["est", "ester"],
					["jó"],
					["sal", "salmos"],
					["pr", "pro", "provérbios"],
					["ec", "ecl", "eclesiastes"],
					["cân", "cântico de salomão"],
					["is", "isa", "isaías"],
					["je", "jer", "jeremias"],
					["la", "lam", "lamentações"],
					["ez", "eze", "ezequiel"],
					["da", "dan", "daniel"],
					["os", "ose", "oseias"],
					["jl", "joel"],
					["am", "amós"],
					["ob", "obd", "obadias"],
					["jon", "jonas"],
					["miq", "miq", "miqueias"],
					["na", "naum"],
					["hab", "habacuque"],
					["sof", "sofonias"],
					["ag", "ageu"],
					["za", "zac", "zacarias"],
					["mal", "malaquias"],
					["mt", "mat", "mateus"],
					["mr", "mar", "marcos"],
					["lu", "luc", "lucas"],
					["jo", "joão"],
					["at", "atos"],
					["ro", "rom", "romanos"],
					["1co", "1cor", "1coríntios"],
					["2co", "2cor", "2coríntios"],
					["gál", "gálatas"],
					["ef", "efé", "efésios"],
					["fil", "filipenses"],
					["col", "colossenses"],
					["1te", "1tes", "1tessalonicenses"],
					["2te", "2tes", "2tessalonicenses"],
					["1ti", "1tim", "1timóteo"],
					["2ti", "2tim", "2timóteo"],
					["tit", "tito"],
					["flm", "filêm", "filêmon"],
					["he", "heb", "hebreus"],
					["tg", "tia", "tiago"],
					["1pe", "1ped", "1pedro"],
					["2pe", "2ped", "2pedro"],
					["1jo", "1joão"],
					["2jo", "2joão"],
					["3jo", "3joão"],
					["ju", "judas"],
					["ap", "apo", "apocalipse"],
				];

				const bibleBooksDE = [
					["1mo", "1mose"],
					["2mo", "2mose"],
					["3mo", "3mose"],
					["4mo", "4mose"],
					["5mo", "5mose"],
					["jos", "josua"],
					["ri", "richter"],
					["ru", "ruth"],
					["1sam", "1samuel"],
					["2sam", "2samuel"],
					["1kö", "1könige"],
					["2kö", "2könige"],
					["1chr", "1chronika"],
					["2chr", "2chronika"],
					["es", "esra"],
					["neh", "nehemia"],
					["esth", "esther"],
					["hi", "hiob"],
					["ps", "psalmen"],
					["spr", "sprüche"],
					["pred", "prediger"],
					["hoh", "hohes lied"],
					["jes", "jesaja"],
					["jer", "jeremia"],
					["klag", "klagelieder"],
					["hes", "hesekiel"],
					["dan", "daniel"],
					["hos", "hosea"],
					["joe", "joel"],
					["am", "amos"],
					["ob", "obadja"],
					["jon", "jona"],
					["mi", "micha"],
					["nah", "nahum"],
					["hab", "habakuk"],
					["zeph", "zephanja"],
					["hag", "haggai"],
					["sach", "sacharja"],
					["mal", "maleachi"],
					["mat", "matthäus"],
					["mar", "markus"],
					["luk", "lukas"],
					["joh", "johannes"],
					["apg", "apostelgeschichte"],
					["röm", "römer"],
					["1kor", "1korinther"],
					["2kor", "2korinther"],
					["gal", "galater"],
					["eph", "epheser"],
					["phil", "philipper"],
					["kol", "kolosser"],
					["1thes", "1thessalonicher"],
					["2thes", "2thessalonicher"],
					["1tim", "1timotheus"],
					["2tim", "2timotheus"],
					["tit", "titus"],
					["phi", "philem", "philemon"],
					["heb", "hebräer"],
					["jak", "jakobus"],
					["1pet", "1petrus"],
					["2pet", "2petrus"],
					["1joh", "1johannes"],
					["2joh", "2johannes"],
					["3joh", "3johannes"],
					["jud", "judas"],
					["offb", "offenbarung"],
				];

				let bibleBooks = bibleBooksEN;

				if (this.settings.pluginLanguage == "nl") {
					bibleBooks = bibleBooksNL;
				} else if (this.settings.pluginLanguage == "fr") {
					bibleBooks = bibleBooksFR;
				} else if (this.settings.pluginLanguage == "pt-br") {
					bibleBooks = bibleBooksPtBr;
				} else if (this.settings.pluginLanguage == "de") {
					bibleBooks = bibleBooksDE;
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

				const link = `jwlibrary:///finder?srcid=jwlshare&wtlocale=O&prefer=lang&pub=nwtsty&bible=${linkOutput}`;
				editor.replaceSelection(
					"[" +
						renderOutput +
						"](" +
						link +
						")"
				);

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
			text: "-   Added German By @Juilio",
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
