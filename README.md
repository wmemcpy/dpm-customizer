# DPM.LOL Custom Settings UI

A Tampermonkey/Greasemonkey userscript to customize the appearance (colors, dimensions) of the League of Legends statistics website [dpm.lol](https://dpm.lol/).

It adds a settings panel allowing you to visually change various style properties and save them persistently in your browser. Custom styles are **only applied if you explicitly save settings**, otherwise the site uses its default appearance.

## Features

*   **Color Customization:** Modify backgrounds, text colors, accent colors, highlights (winrate up/down), and border colors.
*   **Layout Customization:** Adjust base font size, border radius, padding within widgets, gap between widgets, and header height.
*   **UI Panel:** An easy-to-use panel (triggered by a ⚙️ button) with color pickers and text inputs for customization.
*   **Persistence:** Your saved settings are stored locally using `GM_setValue`/`GM_getValue` and automatically applied on page load.
*   **Apply vs. Save:** Preview changes with "Apply" before making them permanent with "Save".
*   **Default Behavior:** The script **does not modify the site's appearance** unless you have saved custom settings via the panel.
*   **Reset:** Easily revert to the script's defaults and remove your saved settings.

## Installation

1.  **Install a Userscript Manager:** You need a browser extension like:
    *   [Tampermonkey](https://www.tampermonkey.net/) (Recommended: Chrome, Firefox, Edge, Opera, Safari)
    *   [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (Firefox)
    *   Violentmonkey
2.  **Install the Script:** Click on the **Raw** link for the `dpm-customizer.user.js` file below (or click the installation link if provided):
    *   [**Install Script**](https://raw.githubusercontent.com/YourUsername/YourRepositoryName/main/dpm-customizer.user.js) <!-- Update this link! -->
3.  Your userscript manager should automatically open a new tab asking for confirmation to install the script. Click **Install**.
4.  Navigate to [dpm.lol](https://dpm.lol/). The script is now active.

## Usage

1.  **Open the Panel:** Look for a floating gear icon (⚙️) in the bottom-right corner of the dpm.lol page. Click it to open the settings panel.
2.  **Adjust Settings:** Use the color pickers and text inputs to change the desired values.
    *   For dimensions, remember to include units (e.g., `16px`, `0.75rem`, `80%`).
3.  **Apply Changes:** Click the **"Apply"** button to see your changes immediately *without* saving them permanently.
4.  **Save Changes:** Click the **"Save"** button to store your current settings. These settings will now load automatically whenever you visit dpm.lol.
5.  **Reset:** Click the **"Reset & Remove Saved"** button to revert the site to its default appearance and delete your saved custom settings. You will need to reload the page or click "Apply" again after resetting if you wish to apply the *script's* default settings (rather than the *website's* defaults).
6.  **Close Panel:** Click the **"Close"** button or the gear icon (⚙️) again to hide the panel.

## Important Notes

*   **Layout Breakage:** Modifying dimension values (padding, gap, height, font size, border radius) can potentially break the website's layout. Use these settings with caution. Resetting is always an option.
*   **Website Updates:** If dpm.lol significantly changes its HTML structure or CSS class names, this script might stop working correctly and may need updating. Feel free to report issues if this happens.

## License

This script is released under the [MIT License](LICENSE).