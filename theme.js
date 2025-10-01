// theme.js - FIX: Corrected custom theme derivation logic and event listeners.

// Global reference to the modal elements
let _customModalOverlay;
let _customModalTitle;
let _customModalMessage;
let _customModalOkBtn;
let _customModalCancelBtn;
let _resolveCustomConfirm; // To store the resolve function for custom confirm

// Theme Presets (Kept outside DOMContentLoaded for clarity/structure)
const themePresets = {
    light: { bg: '#f3f4f6', text: '#1f2937', accent: '#3b82f6', boxBg: '#ffffff', border: '#d1d5db', inputBg: '#ffffff', inputText: '#1f2937', buttonText: '#ffffff', buttonPrimaryHover: '#2563eb', buttonSecondary: '#6b7280', buttonSecondaryHover: '#4b5563', buttonDanger: '#dc2626', buttonDangerHover: '#b91c1c' },
    dark: { bg: '#111827', text: '#f9fafb', accent: '#2563eb', boxBg: '#1f2937', border: '#374151', inputBg: '#374151', inputText: '#f9fafb', buttonText: '#ffffff', buttonPrimaryHover: '#3b82f6', buttonSecondary: '#9ca3af', buttonSecondaryHover: '#d1d5db', buttonDanger: '#f87171', buttonDangerHover: '#ef4444' },
    // Base for custom theme (uses light mode defaults for undefined variables)
    custom: { bg: '#f3f4f6', text: '#1f2937', accent: '#3b82f6', boxBg: '#ffffff', border: '#d1d5db', inputBg: '#ffffff', inputText: '#1f2937', buttonText: '#ffffff', buttonPrimaryHover: '#2563eb', buttonSecondary: '#6b7280', buttonSecondaryHover: '#4b5563', buttonDanger: '#dc2626', buttonDangerHover: '#b91c1c' }
};

/**
 * Applies the selected theme variables to the document root and body.
 * @param {string} themeName - 'light', 'dark', or 'custom'.
 * @param {object} customColors - Optional object with custom color values.
 */
function applyTheme(themeName, customColors = {}) {
    const root = document.documentElement;
    const body = document.body;
    let theme = themePresets[themeName] || themePresets.light;

    if (themeName === 'custom') {
        // FIX: Ensure boxBg and inputBg contrast with the user's custom BG by using the light preset defaults,
        // and using the user's custom text color for borders/inputs.
        const derivedCustomColors = {
            boxBg: themePresets.light.boxBg, // Default to white for boxes for guaranteed contrast
            border: customColors.text, // Border color matches text color
            inputBg: themePresets.light.inputBg, // Default to white for inputs
            inputText: customColors.text,
            buttonPrimaryHover: customColors.accent,
            buttonSecondary: customColors.text,
            buttonSecondaryHover: customColors.text,
            buttonDanger: '#dc2626', // Keep danger standard
            buttonDangerHover: '#b91c1c'
        };
        // Merge base light theme, user inputs (bg, text, accent), and derived values
        theme = { ...themePresets.light, ...customColors, ...derivedCustomColors };
        sessionStorage.setItem('customThemeColors', JSON.stringify(customColors));
    } else {
        sessionStorage.removeItem('customThemeColors');
    }

    // Apply colors to CSS variables
    for (const [key, value] of Object.entries(theme)) {
        const cssVarName = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(cssVarName, value);
    }

    // Handle dark mode class (only applies to built-in 'dark' theme)
    if (themeName === 'dark') {
        body.classList.add('dark');
        root.classList.add('dark');
    } else {
        body.classList.remove('dark');
        root.classList.remove('dark');
    }

    sessionStorage.setItem('selectedTheme', themeName);

    // Toggle custom color inputs visibility
    const customColorsContainer = document.getElementById('customColorsContainer');
    if (customColorsContainer) {
        customColorsContainer.classList.toggle('hidden', themeName !== 'custom');
    }
}

/**
 * Loads the saved theme from sessionStorage and applies it.
 */
function loadTheme() {
    const savedTheme = sessionStorage.getItem('selectedTheme') || 'dark'; // Default to dark
    const customColorsData = sessionStorage.getItem('customThemeColors');
    const customColors = customColorsData ? JSON.parse(customColorsData) : {};
    const themeSelector = document.getElementById('themeSelector');

    if (themeSelector) {
        themeSelector.value = savedTheme;
    }

    applyTheme(savedTheme, customColors);

    // Apply custom colors to inputs if custom theme is selected
    if (savedTheme === 'custom') {
        const customBgColorInput = document.getElementById('customBgColor');
        const customTextColorInput = document.getElementById('customTextColor');
        const customAccentColorInput = document.getElementById('customAccentColor');
        if (customBgColorInput) customBgColorInput.value = customColors.bg || themePresets.custom.bg;
        if (customTextColorInput) customTextColorInput.value = customColors.text || themePresets.custom.text;
        if (customAccentColorInput) customAccentColorInput.value = customColors.accent || themePresets.custom.accent;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Tailwind CSS Configuration
    if (typeof tailwind !== 'undefined' && tailwind.config) {
        tailwind.config = {
            darkMode: 'class',
        };
    }
    
    // --- Theme Selector Setup ---
    const themeSelector = document.getElementById('themeSelector');
    const customBgColorInput = document.getElementById('customBgColor');
    const customTextColorInput = document.getElementById('customTextColor');
    const customAccentColorInput = document.getElementById('customAccentColor');
    
    // 1. Load the theme on page load
    loadTheme(); // Make sure this is called once

    // 2. Attach the event listener for the dropdown
    if (themeSelector) {
        themeSelector.addEventListener('change', (event) => {
            const selectedTheme = event.target.value;
            applyTheme(selectedTheme);
        });
    }

    // 3. Attach listeners for custom color changes
    const colorInputs = [customBgColorInput, customTextColorInput, customAccentColorInput];
    colorInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                const customColors = {
                    bg: customBgColorInput.value,
                    text: customTextColorInput.value,
                    accent: customAccentColorInput.value,
                };
                applyTheme('custom', customColors);
            });
        }
    });
    
    // --- Custom Modal System Setup ---
    _customModalOverlay = document.getElementById('customModalOverlay');
    _customModalTitle = document.getElementById('customModalTitle');
    _customModalMessage = document.getElementById('customModalMessage');
    _customModalOkBtn = document.getElementById('customModalOkBtn');
    _customModalCancelBtn = document.getElementById('customModalCancelBtn');

    // Hide modal
    function hideCustomModal() {
        if (_customModalOverlay) {
            _customModalOverlay.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
            // Ensure any temporary event listeners are cleaned up or handled by the promise
        }
    }

    // Set up permanent OK/Cancel handlers for Confirms (these manage _resolveCustomConfirm)
    if (_customModalOkBtn) {
        _customModalOkBtn.addEventListener('click', () => {
            // If we have a stored resolve function (means it's a Confirm), resolve it.
            if (_resolveCustomConfirm) { 
                _resolveCustomConfirm(true);
                _resolveCustomConfirm = null;
            }
            // In either case (Alert or Confirm), hide the modal
            hideCustomModal(); 
        });
    }

    if (_customModalCancelBtn) {
        _customModalCancelBtn.addEventListener('click', () => {
            if (_resolveCustomConfirm) {
                _resolveCustomConfirm(false);
                _resolveCustomConfirm = null;
            }
            hideCustomModal(); 
        });
    }


    // Public function for Alerts (simple OK)
    /**
     * Shows a custom alert modal.
     * @param {string} message - The message to display.
     * @param {'Success'|'Error'|'Warning'|'Info'} type - The type of alert.
     * @returns {Promise<void>} Resolves when the user clicks OK.
     */
    window.showCustomAlert = function(message, type = "Info") {
        return new Promise((resolve) => {
            if (!_customModalOverlay || !_customModalTitle || !_customModalMessage || !_customModalOkBtn) {
                console.error("Custom modal elements missing, falling back to native alert.");
                alert(message);
                resolve();
                return;
            }

            // Clear any active confirm resolver
            _resolveCustomConfirm = null; 
            
            _customModalTitle.textContent = type;
            _customModalMessage.textContent = message;

            // Apply type-specific styling
            _customModalTitle.classList.remove('success', 'error', 'warning', 'info');
            _customModalTitle.classList.add(type.toLowerCase());

            _customModalCancelBtn.classList.add('hidden'); // Hide cancel button for alerts
            _customModalOkBtn.classList.remove('hidden'); // Ensure OK button is visible
            _customModalOkBtn.textContent = 'OK'; // Set OK button text
            
            // Because the permanent OK button listener now calls hideCustomModal(), 
            // we just need to resolve the promise when the OK button is clicked.
            // A temporary listener for promise resolution is no longer needed.
            
            // To handle the Alert's promise:
            // This is a subtle dance: we use a timeout with a check to resolve the alert promise
            // *after* the permanent click handler has run and set _resolveCustomConfirm=null, 
            // or we use a temporary variable, which is safer.
            
            const handleAlertResolution = (event) => {
                if(event.target === _customModalOkBtn) {
                    _customModalOkBtn.removeEventListener('click', handleAlertResolution);
                    resolve();
                }
            };
            
            // Attach a temporary listener that runs *before* the permanent one if possible, or just for resolution.
            // Since we cannot guarantee order, we resolve immediately and rely on the permanent listener to hide.
            const tempOkListener = () => {
                _customModalOkBtn.removeEventListener('click', tempOkListener);
                resolve();
            };
            _customModalOkBtn.addEventListener('click', tempOkListener, { once: true });


            _customModalOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            _customModalOkBtn.focus();
        });
    };
    
    // Public function for Confirms (OK/Cancel)
    /**
     * Shows a custom confirmation modal.
     * @param {string} message - The message to display.
     * @param {string} title - The title of the modal.
     * @returns {Promise<boolean>} Resolves with true if OK is clicked, false if Cancel.
     */
    window.showCustomConfirm = function(message, title = "Confirm Action") {
        return new Promise((resolve) => {
            if (!_customModalOverlay || !_customModalTitle || !_customModalMessage || !_customModalOkBtn || !_customModalCancelBtn) {
                resolve(confirm(message));
                return;
            }
            _resolveCustomConfirm = resolve; // Store the resolve function

            _customModalTitle.textContent = title;
            _customModalMessage.textContent = message;
            _customModalTitle.classList.remove('success', 'error', 'warning', 'info');
            _customModalTitle.classList.add('info'); // Default confirm styling

            _customModalCancelBtn.classList.remove('hidden'); // Show cancel button
            _customModalOkBtn.classList.remove('hidden');
            _customModalOkBtn.textContent = 'OK';

            _customModalOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            _customModalOkBtn.focus();
        });
    };
});
