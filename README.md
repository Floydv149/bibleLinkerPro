<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://floydv.it.nf/images/BibleLinkerPro/dark.png">
    <source media="(prefers-color-scheme: light)" srcset="https://floydv.it.nf/images/BibleLinkerPro/light.png">
    <img alt="Bible linker Pro logo" src="https://floydv.it.nf/images/BibleLinkerPro/light.png">
</picture>

![Static Badge](https://img.shields.io/badge/Maintenance_status-Active-darkgreen)
![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22bible-linker-pro%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)
![GitHub package.json version](https://img.shields.io/github/package-json/v/floydv149/bibleLinkerPro)
![GitHub contributors](https://img.shields.io/github/contributors/floydv149/bibleLinkerPro)
![GitHub last commit](https://img.shields.io/github/last-commit/floydv149/bibleLinkerPro)

Bible linker Pro is a plugin for [Obsidian](https://obsidian.md/) that let's you generate links to [JW Library](https://www.jw.org/en/online-help/jw-library/) from Bible texts in your notes.

-   Convert short or long written out versions of Bible texts to links.
-   Open Bible texts directly in JW Library without altering your note.
-   Automatically get the current line.
-   Format the link output to your liking.
-   Multiple language support.
-   Choose your preferred Bible edition.

## Installation

> [!Note] Info
> You must turn off **Restricted mode** to use this plugin.

1. In Obsidian, open **Settings**.
2. Under **Community plugings**, select **Browse**.
3. Search for "Bible linker Pro" by Floydv149, and then select it.
4. Select **Install** and then **Enable**.
5. Then click **Options** and select your preferred language.

To get started using Bible linker Pro, press **Ctrl+P** (or **Cmd+P** on macOS) to open the **Command palette**, and then select **Bible linker Pro: Convert Bible text to JW Library link**.

## Example

You can type a shorthand version of a Bible text like "ge 1:1" or a long version like "genesis 1:1".
This converts to `[Genesis 1:1](jwlibrary:///finder?srcid=jwlshare&wtlocale=O&prefer=lang&pub=nwtsty&bible=01001001)`

## Settings

### Processing

While processing your text, you have some extra options:

-   Expand the Bible book name from abbreviation to full name.
-   Automaticaly get the current line when using the command.
-   Automatically open the newly generated link.
-   Choose your preferred Bible edition (nwt or nwtsty).

### Styling

The links you generate with this plugin can be styled with the following options:

-   Capitalize first character
-   Add space between Bible book number and Bible book name.
-   Render the link output bold and/or italic
-   Add link prefix and/or suffix

## Languages

This plugin supports the following languages:

-   English
-   Dutch
-   French - By @DarkBuffalo
-   Spanish - By @Marc-Fernandez
-   German - By @Juilio
-   Finnish - By @amahlaka
-   Portuguese from Brasil - By @gutembergmaciel
-   Portuguese from Portugal - By @joao-p-marques
-   Hungarian - By @MGeri97
-   Ukranian - By @gaborishka

## Changelog

[Click here to view the changelog.](https://github.com/Floydv149/bibleLinkerPro/blob/main/CHANGELOG.MD)

## Roadmap

-   Better text recognition, from a bigger selection.
-   Support to convert to WOL links.
-   More error messages
-   More languages
