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
		containerEl.createEl("h1", { text: "Bible linker Pro - Settings" });
		containerEl.createEl("h2", { text: "Processing" });

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

		containerEl.createEl("h2", { text: "Styling" });

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
	}
}