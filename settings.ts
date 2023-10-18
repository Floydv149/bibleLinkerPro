import MyPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class MainSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h1", { text: "Bible linker Pro " });
		containerEl.createEl("h3", { text: "ℹ️ About" });
		containerEl.createEl("p", { text: "Created with ❤️ by Floydv149" });
		containerEl.createEl("a", {
			text: "Documentation",
			href: "https://github.com/Floydv149/bibleLinkerPro/blob/main/README.md",
		});
		containerEl.createEl("br");
		containerEl.createEl("a", {
			text: "Changelog",
			href: "https://github.com/Floydv149/bibleLinkerPro/blob/main/CHANGELOG.md",
		});

		containerEl.createEl("hr");

		containerEl.createEl("h3", { text: "⚙️ Settings" });
		containerEl.createEl("h4", { text: "🧠 Processing" });

		new Setting(containerEl)
			.setName("Expand Bible Book name")
			.setDesc("E.g. 'Ge' => 'Genesis'.")
			.addToggle((Boolean) =>
				Boolean.setValue(
					this.plugin.settings.expandBibleBookName
				).onChange(async (value) => {
					this.plugin.settings.expandBibleBookName = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Auto get current line")
			.setDesc(
				"Automatically get Bible text from current line the cursor is on."
			)
			.addToggle((Boolean) =>
				Boolean.setValue(this.plugin.settings.autoGetLine).onChange(
					async (value) => {
						this.plugin.settings.autoGetLine = value;
						await this.plugin.saveSettings();
					}
				)
			);

		containerEl.createEl("h4", { text: "🖌️ Styling" });

		new Setting(containerEl)
			.setName("Render the link output bold")
			.setDesc("Shows the output link with bold font-weight.")
			.addToggle((Boolean) =>
				Boolean.setValue(this.plugin.settings.makeBold).onChange(
					async (value) => {
						this.plugin.settings.makeBold = value;
						await this.plugin.saveSettings();
					}
				)
			);

		new Setting(containerEl)
			.setName("Render the link output italic")
			.setDesc("Shows the output link with italic font.")
			.addToggle((Boolean) =>
				Boolean.setValue(this.plugin.settings.makeItalic).onChange(
					async (value) => {
						this.plugin.settings.makeItalic = value;
						await this.plugin.saveSettings();
					}
				)
			);

		new Setting(containerEl)
			.setName("Link prefix")
			.setDesc("Prefix of the link, e.g. '- '.")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.linkPrefix)
					.onChange(async (value) => {
						this.plugin.settings.linkPrefix = value;
						await this.plugin.saveSettings();
					})
					.setPlaceholder("Prefix here!")
			);

		new Setting(containerEl)
			.setName("Link suffix")
			.setDesc("Prefix of the link, e.g. '!!!'.")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.linkSuffix)
					.onChange(async (value) => {
						this.plugin.settings.linkSuffix = value;
						await this.plugin.saveSettings();
					})
					.setPlaceholder("Suffix here!")
			);
	}
}
