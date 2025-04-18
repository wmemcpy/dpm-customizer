// ==UserScript==
// @name         DPM.LOL Custom Settings UI
// @namespace    https://github.com/wmemcpy/dpm-customizer
// @version      3.1.0
// @description  Customize colors and layout of dpm.lol via a UI panel. Settings persist. Styles only apply if saved.
// @author       wmemcpy
// @match        https://dpm.lol/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dpm.lol
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @homepageURL  https://github.com/wmemcpy/dpm-customizer
// @supportURL   https://github.com/wmemcpy/dpm-customizer/issues
// @updateURL    https://github.com/wmemcpy/dpm-customizer/main/dpm-customizer.user.js
// @downloadURL  https://github.com/wmemcpy/dpm-customizer/main/dpm-customizer.user.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultSettings = {
        bgMain: '#131619',
        bgHeader: '#0D0F10',
        bgWidget: '#1A1D21',
        bgWidgetHover: '#363A3D',
        bgActiveTab: '#2A2E34',
        bgButton: '#1A1D21',
        bgButtonHover: '#363A3D',
        textPrimary: '#FFFFFF',
        textSecondary: '#E8E9E9',
        textTertiary: '#9B9C9E',
        accentPrimary: '#7989EC',
        accentSecondary: '#A1E4F9',
        accentTertiary: '#FFDC75',
        winrateUp: '#DBF7CD',
        winrateDown: '#f7665e',
        borderPrimary: 'rgba(255, 255, 255, 0.1)',
        borderSecondary: '#363A3D',

        fontSizeBase: '14px',
        borderRadiusBase: '0.5rem',
        widgetPadding: '16px',
        widgetGap: '40px',
        headerHeight: '50px',
    };

    let currentSettings = { ...defaultSettings };
    const storageKey = 'dpmLolCustomSettingsV3';
    const styleElementId = 'dpm-lol-custom-styles';
    const panelElementId = 'dpm-lol-settings-panel';
    const triggerElementId = 'dpm-lol-settings-trigger';
    let stylesInjectedOnLoad = false;

    function hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
    }

    function injectOrUpdateStyles(cssContent) {
        let styleElement = document.getElementById(styleElementId);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleElementId;
            styleElement.type = 'text/css';
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = cssContent;
    }

    function removeStyles() {
        let styleElement = document.getElementById(styleElementId);
        if (styleElement) {
            styleElement.textContent = '';
        }
    }

    function loadSettings() {
        const savedSettingsJson = GM_getValue(storageKey, null);
        if (savedSettingsJson) {
            try {
                const savedSettings = JSON.parse(savedSettingsJson);
                currentSettings = { ...defaultSettings, ...savedSettings };
                console.log("Loaded and applying saved settings:", currentSettings);
                applySettingsInternal(currentSettings);
                stylesInjectedOnLoad = true;
            } catch (e) {
                console.error("Error parsing saved settings, using defaults (no styles applied).", e);
                currentSettings = { ...defaultSettings };
                stylesInjectedOnLoad = false;
            }
        } else {
            console.log("No saved settings found, using default site styles.");
            currentSettings = { ...defaultSettings };
            stylesInjectedOnLoad = false;
        }
    }

     function saveSettings() {
         const panel = document.getElementById(panelElementId);
         if (!panel) {
             console.error("Save button clicked but panel not found.");
             return;
         }
         const settingsToSave = {};
         Object.keys(defaultSettings).forEach(key => {
             const input = panel.querySelector(`[data-setting-key="${key}"]`);
             if (input) {
                settingsToSave[key] = input.value;
             } else {
                 settingsToSave[key] = currentSettings[key];
             }
         });

         currentSettings = settingsToSave;
         GM_setValue(storageKey, JSON.stringify(currentSettings));
         console.log("Settings saved:", currentSettings);
         applySettingsInternal(currentSettings);
         stylesInjectedOnLoad = true;
     }

     function applySettingsInternal(settingsToApply) {
         injectOrUpdateStyles(createCssTemplate(settingsToApply));
         console.log("Applied settings:", settingsToApply);
     }

     function applySettingsFromUI() {
         const panel = document.getElementById(panelElementId);
         if (!panel) return;

         const settingsToApply = {};
          Object.keys(defaultSettings).forEach(key => {
              const input = panel.querySelector(`[data-setting-key="${key}"]`);
              if (input) {
                settingsToApply[key] = input.value;
              } else {
                  settingsToApply[key] = currentSettings[key];
              }
          });

          currentSettings = settingsToApply;
          applySettingsInternal(settingsToApply);
          stylesInjectedOnLoad = true;
     }

    function resetSettings() {
        console.log("Resetting settings to default.");
        GM_deleteValue(storageKey);
        currentSettings = { ...defaultSettings };
        const panel = document.getElementById(panelElementId);
        if (panel) {
             Object.keys(defaultSettings).forEach(key => {
                 const input = panel.querySelector(`[data-setting-key="${key}"]`);
                 if (input) {
                     input.value = defaultSettings[key];
                 }
             });
        }
        removeStyles();
        stylesInjectedOnLoad = false;
    }

    const createCssTemplate = (settings) => `
        :root {
            --custom-bg-main: ${settings.bgMain};
            --custom-bg-header: ${settings.bgHeader};
            --custom-bg-widget: ${settings.bgWidget};
            --custom-bg-widget-hover: ${settings.bgWidgetHover};
            --custom-bg-active-tab: ${settings.bgActiveTab};
            --custom-bg-button: ${settings.bgButton};
            --custom-bg-button-hover: ${settings.bgButtonHover};
            --custom-text-primary: ${settings.textPrimary};
            --custom-text-secondary: ${settings.textSecondary};
            --custom-text-tertiary: ${settings.textTertiary};
            --custom-accent-primary: ${settings.accentPrimary};
            --custom-accent-secondary: ${settings.accentSecondary};
            --custom-accent-tertiary: ${settings.accentTertiary};
            --custom-winrate-up: ${settings.winrateUp};
            --custom-winrate-down: ${settings.winrateDown};
            --custom-border-primary: ${settings.borderPrimary};
            --custom-border-secondary: ${settings.borderSecondary};
            --custom-font-size-base: ${settings.fontSizeBase};
            --custom-border-radius-base: ${settings.borderRadiusBase};
            --custom-widget-padding: ${settings.widgetPadding};
            --custom-widget-gap: ${settings.widgetGap};
            --custom-header-height: ${settings.headerHeight};
            --custom-accent-primary-rgb: ${hexToRgb(settings.accentPrimary)};
            --custom-accent-secondary-rgb: ${hexToRgb(settings.accentSecondary)};
            --custom-accent-tertiary-rgb: ${hexToRgb(settings.accentTertiary)};
            --custom-bg-widget-rgb: ${hexToRgb(settings.bgWidget)};
            --custom-winrate-down-rgb: ${hexToRgb(settings.winrateDown)};
        }

        body, body.bg-black-700 { background-color: var(--custom-bg-main) !important; color: var(--custom-text-secondary) !important; font-size: var(--custom-font-size-base) !important; }
        .rounded, .rounded-lg, .rounded-xl, .rounded-md, .rounded-sm, .rounded-full, button, input, [role="tab"], [role="dialog"], [role="menu"], .overflow-hidden.rounded-xl, .overflow-hidden.rounded-md { border-radius: var(--custom-border-radius-base) !important; }
        .border-black-0\\/10, .border-black-300\\/10, .border-border { border-color: var(--custom-border-primary) !important; }
        .border-black-500, .border-input { border-color: var(--custom-border-secondary) !important; }
        header.bg-black-800 { background-color: var(--custom-bg-header) !important; border-bottom: 1px solid var(--custom-border-secondary) !important; height: var(--custom-header-height) !important; min-height: var(--custom-header-height) !important; }
        header hr.border-black-0\\/10 { border-color: var(--custom-border-primary) !important; }
        footer.border-black-0 { border-top-color: var(--custom-border-primary) !important; }
        .max-w-7xl.pb-64 { gap: var(--custom-widget-gap) !important; }
        .bg-black-600\\/40.rounded-xl { background-color: rgba(var(--custom-bg-widget-rgb), 0.4) !important; padding: var(--custom-widget-padding) !important; border-color: var(--custom-border-primary) !important; }
        .bg-black-600, .bg-background, .bg-card { background-color: var(--custom-bg-widget) !important; }
        .bg-black-600\\/50, .bg-black-600\\/60, .bg-black-600\\/80 { background-color: rgba(var(--custom-bg-widget-rgb), 0.6) !important; }
        .bg-black-500, .hover\\:bg-black-500:hover, .active\\:bg-black-600:active, .hover\\:bg-accent:hover, .focus\\:bg-accent:focus, .data-\\[state\\=open\\]\\:bg-accent\\/50[data-state="open"] { background-color: var(--custom-bg-widget-hover) !important; }
        .data-\\[state\\=open\\]\\:hover\\:bg-accent[data-state="open"]:hover, .data-\\[state\\=open\\]\\:focus\\:bg-accent[data-state="open"]:focus { background-color: var(--custom-bg-active-tab) !important; }
        .bg-black-700 { background-color: var(--custom-bg-main) !important; }
        .bg-black-800, .hover\\:bg-black-800:hover { background-color: var(--custom-bg-header) !important; }
        .bg-black-600.text-black-200 { background-color: var(--custom-bg-button) !important; color: var(--custom-text-secondary) !important; border-color: var(--custom-border-secondary) !important;}
        .hover\\:bg-black-500:hover { background-color: var(--custom-bg-button-hover) !important; }
        .active\\:bg-black-400:active { background-color: var(--custom-bg-widget-hover) !important; filter: brightness(0.9); }
        .bg-blue-300\\/10 { background-color: rgba(var(--custom-accent-primary-rgb), 0.08) !important; }
        .border-blue-300\\/20 { border-color: rgba(var(--custom-accent-primary-rgb), 0.15) !important; }
        .shadow-\\[0_0px_20px_0px_rgba\\(121\\2c_137\\2c_236\\2c_0\\.25\\)\\] { box-shadow: 0 0px 15px 0px rgba(var(--custom-accent-primary-rgb), 0.15) !important; }
        .bg-black-600.border-black-500 { background-color: var(--custom-bg-button) !important; border-color: var(--custom-border-secondary) !important; }
        .shadow-\\[0_0px_10px_0px_rgba\\(121\\2c_137\\2c_236\\2c_0\\.10\\)\\] { box-shadow: 0 0px 8px 0px rgba(var(--custom-accent-primary-rgb), 0.05) !important; }
        .data-\\[state\\=active\\]\\:bg-black-800\\/60[data-state="active"], .data-\\[state\\=active\\]\\:bg-black-800[data-state="active"] { background-color: var(--custom-bg-active-tab) !important; }
        .data-\\[state\\=active\\]\\:text-black-0[data-state="active"] { color: var(--custom-text-primary) !important; }
        .text-yellow-400, .text-yellow-400\\/90 { color: var(--custom-accent-tertiary) !important; }
        .text-lime-300 { color: var(--custom-winrate-up) !important; }
        .text-\\[\\#f7665e\\], .text-\\[\\#f7665e\\]\\/80 { color: var(--custom-winrate-down) !important; }
        .text-cyan-400 { color: var(--custom-rank-challenger, var(--custom-accent-secondary)) !important; } /* Fallback for Challenger color */
        .bg-yellow-400\\/60 { background-color: rgba(var(--custom-accent-tertiary-rgb), 0.6) !important; }
        .bg-purple-300\\/60 { background-color: rgba(var(--custom-accent-primary-rgb), 0.6) !important; }
        .bg-cyan-500\\/60 { background-color: rgba(var(--custom-accent-secondary-rgb), 0.6) !important; }
        .bg-red-600\\/60 { background-color: rgba(var(--custom-winrate-down-rgb), 0.6) !important;}
        .text-purple-300, .text-blue-400 { color: var(--custom-accent-primary) !important; }
        .bg-purple-300, .bg-blue-400 { background-color: var(--custom-accent-primary) !important; }
        .shadow-\\[0_0px_12px_0px_rgba\\(222\\2c_204\\2c_251\\2c_0\\.1\\)\\] { box-shadow: 0 0px 10px 0px rgba(var(--custom-accent-primary-rgb), 0.1) !important; }
        .hover\\:bg-purple-200\\/5:hover { background-color: rgba(var(--custom-accent-primary-rgb), 0.03) !important; }
        .hover\\:bg-purple-200\\/10:hover { background-color: rgba(var(--custom-accent-primary-rgb), 0.06) !important; }
        #nprogress .bar { background: var(--custom-accent-primary) !important; }
        #nprogress .peg { box-shadow: 0 0 10px var(--custom-accent-primary), 0 0 5px var(--custom-accent-primary) !important; }
        .ring-blue-500\\/80 { --tw-ring-color: rgba(var(--custom-accent-primary-rgb), 0.8) !important; }
        .text-cyan-300 { color: var(--custom-accent-secondary) !important; opacity: 0.9; }
        .bg-cyan-300 { background-color: var(--custom-accent-secondary) !important; }
        .shadow-\\[0_0px_12px_0px_rgba\\(161\\2c_228\\2c_249\\2c_0\\.12\\)\\] { box-shadow: 0 0px 10px 0px rgba(var(--custom-accent-secondary-rgb), 0.12) !important; }
        .ring-cyan-400\\/40 { --tw-ring-color: rgba(var(--custom-accent-secondary-rgb), 0.4) !important; }
        .bg-yellow-300 { background-color: var(--custom-accent-tertiary) !important; }
        .shadow-\\[0_0px_12px_0px_rgba\\(255\\2c_235\\2c_173\\2c_0\\.2\\)\\] { box-shadow: 0 0px 10px 0px rgba(var(--custom-accent-tertiary-rgb), 0.2) !important; }
        .bg-orange-600 { background-color: var(--custom-accent-primary) !important; }
        .text-black-100, .text-accent-foreground { color: var(--custom-text-primary) !important; }
        .text-black-200 { color: var(--custom-text-secondary) !important; }
        .text-black-300, .text-muted-foreground { color: var(--custom-text-tertiary) !important; }
        .text-black-400 { color: var(--custom-text-tertiary) !important; opacity: 0.8; }
        .text-black-0 { color: var(--custom-text-primary) !important; }
        img[alt="AstronautGnar"] { display: none !important; }
        #root > div > main { background-color: transparent !important; }
    `;

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = panelElementId;
        panel.style.display = 'none';

        const createInput = (key, type = 'color') => {
            let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            let inputType = type;
            let value = currentSettings[key] || defaultSettings[key];
            let step = type === 'number' ? '1' : '';
            let unit = '';

             if (type === 'dimension') {
                 inputType = 'text';
                 const match = /(\d+(\.\d+)?)\s*([a-zA-Z%]+)?/.exec(value);
                 if (match && match[3]) unit = ` (${match[3]})`;
                 else if (match && !match[3]) unit = ' (px assumed)';
                 else unit = ' (e.g., 16px, 0.5rem)';
                  label += unit;
             }

            return `
                 <div class="dpm-setting-row" data-type="${type}">
                     <label for="dpm-setting-${key}">${label}:</label>
                     <input type="${inputType}" id="dpm-setting-${key}" data-setting-key="${key}" value="${value}" ${step ? `step="${step}"` : ''}>
                 </div>
             `;
        };

        const groups = {
            "Colors: Backgrounds": ['bgMain', 'bgHeader', 'bgWidget', 'bgWidgetHover', 'bgActiveTab', 'bgButton', 'bgButtonHover'],
            "Colors: Text": ['textPrimary', 'textSecondary', 'textTertiary'],
            "Colors: Accents": ['accentPrimary', 'accentSecondary', 'accentTertiary'],
            "Colors: Highlights": ['winrateUp', 'winrateDown'],
            "Colors: Borders": ['borderPrimary', 'borderSecondary'],
            "Layout & Dimensions": [
                { key: 'fontSizeBase', type: 'dimension' },
                { key: 'borderRadiusBase', type: 'dimension' },
                { key: 'widgetPadding', type: 'dimension' },
                { key: 'widgetGap', type: 'dimension' },
                { key: 'headerHeight', type: 'dimension' }
            ]
        };

        let inputsHtml = '<p class="dpm-warning">Warning: Changing dimension values might break the site layout. Save changes to persist them across page loads.</p>';

        Object.entries(groups).forEach(([groupName, keys]) => {
            inputsHtml += `<div class="dpm-setting-group"><h3>${groupName}</h3>`;
            keys.forEach(item => {
                if (typeof item === 'string') inputsHtml += createInput(item, 'color');
                else inputsHtml += createInput(item.key, item.type);
            });
            inputsHtml += `</div>`;
        });


        panel.innerHTML = `
            <h2>DPM.LOL Settings</h2>
            <div class="dpm-settings-inputs">
                ${inputsHtml}
            </div>
            <div class="dpm-settings-buttons">
                <button id="dpm-apply-settings">Apply</button>
                <button id="dpm-save-settings">Save</button>
                <button id="dpm-reset-settings">Reset & Remove Saved</button>
                <button id="dpm-close-panel">Close</button>
            </div>
        `;

        document.body.appendChild(panel);

        document.getElementById('dpm-apply-settings').addEventListener('click', applySettingsFromUI);
        document.getElementById('dpm-save-settings').addEventListener('click', saveSettings);
        document.getElementById('dpm-reset-settings').addEventListener('click', resetSettings);
        document.getElementById('dpm-close-panel').addEventListener('click', () => {
            panel.style.display = 'none';
        });
    }

    function createTriggerButton() {
        const trigger = document.createElement('button');
        trigger.id = triggerElementId;
        trigger.textContent = '⚙️';
        trigger.title = 'Customize DPM.LOL Settings';
        document.body.appendChild(trigger);

        trigger.addEventListener('click', () => {
            const panel = document.getElementById(panelElementId);
            if (panel) {
                const isHidden = panel.style.display === 'none';
                panel.style.display = isHidden ? 'block' : 'none';
                 if (isHidden) {
                     Object.keys(currentSettings).forEach(key => {
                         const input = panel.querySelector(`[data-setting-key="${key}"]`);
                         if (input) input.value = currentSettings[key];
                     });
                 }
            }
        });
    }

    function addPanelStyles() {
        GM_addStyle(`
            #${panelElementId} { position: fixed; top: 60px; right: 15px; background-color: #2d313a; color: #e1e4ea; border: 1px solid #555; border-radius: 8px; padding: 15px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.4); max-height: 85vh; overflow-y: auto; font-family: sans-serif; font-size: 13px; width: 320px; }
            #${panelElementId} h2 { margin-top: 0; margin-bottom: 15px; font-size: 16px; border-bottom: 1px solid #555; padding-bottom: 8px; color: #fff; }
            #${panelElementId} h3 { margin-top: 12px; margin-bottom: 8px; font-size: 14px; color: #ccc; border-bottom: 1px dashed #666; padding-bottom: 4px; }
            .dpm-setting-group { margin-bottom: 15px; }
            .dpm-setting-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 10px; }
            .dpm-setting-row label { flex-shrink: 0; white-space: nowrap; font-size: 12px; }
            .dpm-setting-row[data-type="color"] input { width: 50px; height: 25px; border: 1px solid #777; padding: 1px 2px; border-radius: 4px; cursor: pointer; background-color: #555; }
            .dpm-setting-row[data-type="dimension"] input { width: 70px; height: 25px; border: 1px solid #777; padding: 2px 5px; border-radius: 4px; background-color: #40465a; color: inherit; font-size: 12px; }
            .dpm-setting-row input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
            .dpm-setting-row input[type="color"]::-webkit-color-swatch { border: none; border-radius: 3px; }
            .dpm-warning { font-size: 11px; color: #ffddaa; background-color: rgba(255, 150, 0, 0.1); border: 1px solid rgba(255, 150, 0, 0.2); padding: 5px; border-radius: 4px; margin-bottom: 10px; }
            .dpm-settings-buttons { display: flex; flex-wrap: wrap; justify-content: space-around; margin-top: 20px; padding-top: 10px; border-top: 1px solid #555; gap: 8px; }
            .dpm-settings-buttons button { background-color: #4a506a; color: #e1e4ea; border: 1px solid #6a708a; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; flex-grow: 1; min-width: 80px; text-align: center; }
            .dpm-settings-buttons button:hover { background-color: #5a607a; }
            .dpm-settings-buttons button#dpm-reset-settings { background-color: #8a4a4a; border-color: #a05a5a; }
            .dpm-settings-buttons button#dpm-reset-settings:hover { background-color: #a05a5a; }
            .dpm-settings-buttons button#dpm-save-settings { background-color: #4a8a4a; border-color: #5a9a5a; }
            .dpm-settings-buttons button#dpm-save-settings:hover { background-color: #5aa05a; }
            #${triggerElementId} { position: fixed; bottom: 20px; right: 20px; background-color: rgba(42, 46, 58, 0.8); color: #e1e4ea; border: 1px solid #555; border-radius: 50%; width: 40px; height: 40px; font-size: 20px; line-height: 40px; text-align: center; cursor: pointer; z-index: 9998; box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: background-color 0.2s ease; }
            #${triggerElementId}:hover { background-color: rgba(64, 70, 90, 0.9); }
        `);
    }

    loadSettings();
    addPanelStyles();
    createSettingsPanel();
    createTriggerButton();

})();