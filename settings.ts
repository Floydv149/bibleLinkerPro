import BibleLinkerPro from "main";
import { App, PluginSettingTab, Setting } from "obsidian";
import * as translations from "translations.json";
import { moment } from "obsidian";

const translationsTyped: { [key: string]: { [key: string]: string } } =
	translations;

export class MainSettingTab extends PluginSettingTab {
	plugin: BibleLinkerPro;

	constructor(app: App, plugin: BibleLinkerPro) {
		super(app, plugin);
		this.plugin = plugin;
	}

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
		const pluginLanguage = this.plugin.settings.pluginLanguage;
		const langBase: { [key: string]: string } =
			translationsTyped.hasOwnProperty(pluginLanguage)
				? translationsTyped[pluginLanguage]
				: {};

		return langBase;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("ℹ️ " + this.getTranslation("ABOUT"))
			.setHeading();

		containerEl.createEl("p", {
			text: this.getTranslation("CREATED_WITH_LOVE") + " Floydv149",
		});
		containerEl.createEl("a", {
			text: this.getTranslation("DOCUMENTATION"),
			href: "https://github.com/Floydv149/bibleLinkerPro/blob/main/README.md",
		});
		containerEl.createEl("br");
		containerEl.createEl("a", {
			text: this.getTranslation("CHANGELOG"),
			href: "https://github.com/Floydv149/bibleLinkerPro/blob/main/CHANGELOG.MD",
		});
		containerEl.createEl("br");
		containerEl.createEl("br");

		new Setting(containerEl)
			.setName(this.getTranslation("LANGUAGE"))
			.setDesc("")
			.addDropdown((String) =>
				String.addOption("/", this.getTranslation("SYSTEM"))
					.addOption("en", "English")
					.addOption("fr", "Français")
					.addOption("nl", "Nederlands")
					.addOption("de", "Deutsch")
					.addOption("pt-br", "Português (Brasil)")
					.addOption("es", "Español")
					.addOption("fi", "Finnish")
					.addOption("ua", "Українська")
					.addOption("hu", "Magyar")
					.setValue(
						this.plugin.settings.pluginLanguage != moment.locale()
							? this.plugin.settings.pluginLanguage
							: "/"
					)
					.onChange(async (value) => {
						if (value === "/") {
							if (
								translationsTyped.hasOwnProperty(
									moment.locale()
								)
							) {
								this.plugin.settings.pluginLanguage =
									moment.locale();
							} else {
								this.plugin.settings.pluginLanguage = "en";
							}
						} else {
							this.plugin.settings.pluginLanguage = value;
							await this.plugin.saveSettings();
						}
						this.display();
					})
			);

		new Setting(containerEl)
			.setName("🧠 " + this.getTranslation("PROCESSING"))
			.setHeading();

		new Setting(containerEl)
			.setName(this.getTranslation("EXPAND_BIBLE_BOOK_NAME"))
			.setDesc(this.getTranslation("EXPAND_BIBLE_BOOK_NAME_EXAMPLE"))
			.addToggle((Boolean) =>
				Boolean.setValue(
					this.plugin.settings.expandBibleBookName
				).onChange(async (value) => {
					this.plugin.settings.expandBibleBookName = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName(this.getTranslation("AUTO_GET_CURRENT_LINE"))
			.setDesc(this.getTranslation("AUTO_GET_CURRENT_LINE_DESC"))
			.addToggle((Boolean) =>
				Boolean.setValue(this.plugin.settings.autoGetLine).onChange(
					async (value) => {
						this.plugin.settings.autoGetLine = value;
						await this.plugin.saveSettings();
					}
				)
			);

		new Setting(containerEl)
			.setName(this.getTranslation("AUTO_OPEN_LINK"))
			.setDesc(this.getTranslation("AUTO_OPEN_LINK_DESC"))
			.addToggle((Boolean) =>
				Boolean.setValue(this.plugin.settings.autoOpenLink).onChange(
					async (value) => {
						this.plugin.settings.autoOpenLink = value;
						await this.plugin.saveSettings();
					}
				)
			);

		new Setting(containerEl)
			.setName(this.getTranslation("BIBLE_EDITION"))
			.setDesc(this.getTranslation("BIBLE_EDITION_DESC"))
			.addToggle((Boolean) =>
				Boolean.setValue(
					this.plugin.settings.bibleEdition == "nwt" ? false : true
				).onChange(async (value) => {
					this.plugin.settings.bibleEdition = value
						? "nwtsty"
						: "nwt";
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("🖌️ " + this.getTranslation("STYLING"))
			.setHeading();

		new Setting(containerEl)
			.setName(this.getTranslation("CAPITALIZE_FIRST_CHARACTER"))
			.setDesc(this.getTranslation("CAPITALIZE_FIRST_CHARACTER_DESC"))
			.addToggle((Boolean) =>
				Boolean.setValue(
					this.plugin.settings.capitalizeFirstCharBibleBookName
				).onChange(async (value) => {
					this.plugin.settings.capitalizeFirstCharBibleBookName =
						value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName(this.getTranslation("ADD_SPACE_BIBLE_BOOK_NUMBER_NAME"))
			.setDesc(
				this.getTranslation("ADD_SPACE_BIBLE_BOOK_NUMBER_NAME_DESC")
			)
			.addToggle((Boolean) =>
				Boolean.setValue(
					this.plugin.settings.addSpaceAfterBibleBookNumber
				).onChange(async (value) => {
					this.plugin.settings.addSpaceAfterBibleBookNumber = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName(this.getTranslation("RENDER_LINK_OUTPUT_BOLD"))
			.setDesc(this.getTranslation("RENDER_LINK_OUTPUT_BOLD_DESC"))
			.addToggle((Boolean) =>
				Boolean.setValue(this.plugin.settings.makeBold).onChange(
					async (value) => {
						this.plugin.settings.makeBold = value;
						await this.plugin.saveSettings();
					}
				)
			);

		new Setting(containerEl)
			.setName(this.getTranslation("RENDER_LINK_OUTPUT_ITALIC"))
			.setDesc(this.getTranslation("RENDER_LINK_OUTPUT_ITALIC_DESC"))
			.addToggle((Boolean) =>
				Boolean.setValue(this.plugin.settings.makeItalic).onChange(
					async (value) => {
						this.plugin.settings.makeItalic = value;
						await this.plugin.saveSettings();
					}
				)
			);

		new Setting(containerEl)
			.setName(this.getTranslation("LINK_PREFIX"))
			.setDesc(this.getTranslation("LINK_PREFIX_DESC"))
			.addText((text) =>
				text
					.setValue(this.plugin.settings.linkPrefix)
					.onChange(async (value) => {
						this.plugin.settings.linkPrefix = value;
						await this.plugin.saveSettings();
					})
					.setPlaceholder(this.getTranslation("PREFIX_HERE"))
			)
			.addExtraButton((b) => {
				b.setIcon("rotate-ccw")
					.setTooltip(this.getTranslation("CLEAR_LINK_PREFIX"))
					.onClick(async () => {
						this.plugin.settings.linkPrefix = "";
						await this.plugin.saveSettings();
						this.display();
					});
			});

		new Setting(containerEl)
			.setName(this.getTranslation("LINK_SUFFIX"))
			.setDesc(this.getTranslation("LINK_SUFFIX_DESC"))
			.addText((text) =>
				text
					.setValue(this.plugin.settings.linkSuffix)
					.onChange(async (value) => {
						this.plugin.settings.linkSuffix = value;
						await this.plugin.saveSettings();
					})
					.setPlaceholder(this.getTranslation("SUFFIX_HERE"))
			)
			.addExtraButton((b) => {
				b.setIcon("rotate-ccw")
					.setTooltip(this.getTranslation("CLEAR_LINK_SUFFIX"))
					.onClick(async () => {
						this.plugin.settings.linkSuffix = "";
						await this.plugin.saveSettings();
						this.display();
					});
			});
	}
}
