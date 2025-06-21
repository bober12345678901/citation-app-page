// theme.js - WITH CUSTOM ALERT SYSTEM (FIXED VARIABLE NAMES)

// Global reference to the modal elements
let _customModalOverlay;
let _customModalTitle;
let _customModalMessage;
let _customModalOkBtn;
let _customModalCancelBtn;
let _resolveCustomConfirm; // To store the resolve function for custom confirm

document.addEventListener('DOMContentLoaded', () => {
    // Tailwind CSS Configuration MUST be inside DOMContentLoaded if CDN is in head
    if (typeof tailwind !== 'undefined' && tailwind.config) {
        tailwind.config = {
            darkMode: 'class', // Enable dark mode by toggling a 'dark' class on the html element
        };
    }

    const themeSelector = document.getElementById('themeSelector');
    const customColorsContainer = document.getElementById('customColorsContainer');
    const customBgColorInput = document.getElementById('customBgColor');
    const customTextColorInput = document.getElementById('customTextColor');
    const customAccentColorInput = document.getElementById('customAccentColor');
    const body = document.body;

    const themePresets = {
        light: { bg: '#f3f4f6', text: '#1f2937', accent: '#3b82f6', boxBg: '#ffffff', border: '#d1d5db', inputBg: '#ffffff', inputText: '#1f2937', buttonText: '#ffffff', buttonPrimaryHover: '#2563eb', buttonSecondary: '#6b7280', buttonSecondaryHover: '#4b5563', buttonDanger: '#dc2626', buttonDangerHover: '#b91c1c' },
        dark: { bg: '#111827', text: '#f9fafb', accent: '#2563eb', boxBg: '#1f2937', border: '#374151', inputBg: '#374151', inputText: '#f9fafb', buttonText: '#ffffff', buttonPrimaryHover: '#1e40af', buttonSecondary: '#4b5563', buttonSecondaryHover: '#374151', buttonDanger: '#b91c1c', buttonDangerHover: '#991b1b' },
        sunset: { bg: '#ffe4e6', text: '#4b1e2f', accent: '#fb7185', boxBg: '#fef2f2', border: '#fecdd3', inputBg: '#fff7f7', inputText: '#4b1e2f', buttonText: '#ffffff', buttonPrimaryHover: '#e11d48', buttonSecondary: '#fca5a5', buttonSecondaryHover: '#ef4444', buttonDanger: '#be123c', buttonDangerHover: '#9f1239' },
        ocean: { bg: '#e0f2fe', text: '#0c4a6e', accent: '#0284c7', boxBg: '#ecf8ff', border: '#7dd3fc', inputBg: '#f0f9ff', inputText: '#0c4a6e', buttonText: '#ffffff', buttonPrimaryHover: '#0369a1', buttonSecondary: '#38bdf8', buttonSecondaryHover: '#0ea5e9', buttonDanger: '#ef4444', buttonDangerHover: '#dc2626' },
        forest: { bg: '#ecfdf5', text: '#064e3b', accent: '#10b981', boxBg: '#f0fdf4', border: '#6ee7b7', inputBg: '#f0fdf4', inputText: '#064e3b', buttonText: '#ffffff', buttonPrimaryHover: '#059669', buttonSecondary: '#34d399', buttonSecondaryHover: '#10b981', buttonDanger: '#ef4444', buttonDangerHover: '#dc2626' },
        midnight: { bg: '#0f172a', text: '#e2e8f0', accent: '#7c3aed', boxBg: '#1e293b', border: '#475569', inputBg: '#334155', inputText: '#e2e8f0', buttonText: '#ffffff', buttonPrimaryHover: '#6d28d9', buttonSecondary: '#64748b', buttonSecondaryHover: '#475569', buttonDanger: '#dc2626', buttonDangerHover: '#b91c1c' },
        dracula: { bg: '#282a36', text: '#f8f8f2', accent: '#bd93f9', boxBg: '#44475a', border: '#6272a4', inputBg: '#50fa7b', inputText: '#f8f8f2', buttonText: '#ffffff', buttonPrimaryHover: '#ff79c6', buttonSecondary: '#6272a4', buttonSecondaryHover: '#44475a', buttonDanger: '#ff5555', buttonDangerHover: '#ff3333' },
        cyberpunk: { bg: '#0d0f1b', text: '#fefefe', accent: '#ff007c', boxBg: '#1a1d2e', border: '#00ffff', inputBg: '#2a2e4a', inputText: '#fefefe', buttonText: '#ffffff', buttonPrimaryHover: '#ff00ff', buttonSecondary: '#00ff00', buttonSecondaryHover: '#00cc00', buttonDanger: '#fe4a4a', buttonDangerHover: '#e73030' },
        custom: null // Will be loaded from sessionStorage or default
    };

    function applyTheme(themeName) {
        let theme = themePresets[themeName];
        // Ensure base classes are always present for layout/styling
        body.className = `min-h-screen theme-app-container theme-${themeName} flex items-center justify-center`; 

        if (themeName === 'custom') {
            const customColors = JSON.parse(sessionStorage.getItem('customThemeColors')) || {
                bg: '#f3f4f6', text: '#1f2937', accent: '#3b82f6', boxBg: '#ffffff', border: '#d1d5db', inputBg: '#ffffff', inputText: '#1f2937', buttonText: '#ffffff', buttonPrimaryHover: '#2563eb', buttonSecondary: '#6b7280', buttonSecondaryHover: '#4b5563', buttonDanger: '#dc2626', buttonDangerHover: '#b91c1c'
            };
            theme = customColors;
            if (customBgColorInput) customBgColorInput.value = customColors.bg;
            if (customTextColorInput) customTextColorInput.value = customColors.text;
            if (customAccentColorInput) customAccentColorInput.value = customColors.accent;
            if (customColorsContainer) customColorsContainer.classList.remove('hidden');
        } else {
            if (customColorsContainer) customColorsContainer.classList.add('hidden');
        }

        if (theme) {
            document.documentElement.style.setProperty('--bg-color', theme.bg);
            document.documentElement.style.setProperty('--text-color', theme.text);
            document.documentElement.style.setProperty('--accent-color', theme.accent);
            document.documentElement.style.setProperty('--box-bg-color', theme.boxBg);
            document.documentElement.style.setProperty('--border-color', theme.border);
            document.documentElement.style.setProperty('--input-bg-color', theme.inputBg);
            document.documentElement.style.setProperty('--input-text-color', theme.inputText);
            document.documentElement.style.setProperty('--button-text-color', theme.buttonText);
            document.documentElement.style.setProperty('--button-primary-bg', theme.accent);
            document.documentElement.style.setProperty('--button-primary-hover-bg', theme.buttonPrimaryHover);
            document.documentElement.style.setProperty('--button-secondary-bg', theme.buttonSecondary);
            document.documentElement.style.setProperty('--button-secondary-hover-bg', theme.buttonSecondaryHover);
            document.documentElement.style.setProperty('--button-danger-bg', theme.buttonDanger);
            document.documentElement.style.setProperty('--button-danger-hover-bg', theme.buttonDangerHover);

            // Special handling for dark mode class on HTML element
            if (themeName === 'dark' || themeName === 'midnight' || themeName === 'dracula' || themeName === 'cyberpunk') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }

        sessionStorage.setItem('selectedTheme', themeName); 
    }

    function saveCustomColors() {
        const customColors = {
            bg: customBgColorInput.value,
            text: customTextColorInput.value,
            accent: customAccentColorInput.value,
            // Simple derivations for other elements, can be expanded with more inputs
            boxBg: customBgColorInput.value,
            border: customAccentColorInput.value,
            inputBg: customBgColorInput.value,
            inputText: customTextColorInput.value,
            buttonText: customTextColorInput.value,
            buttonPrimaryHover: customAccentColorInput.value,
            buttonSecondary: customTextColorInput.value,
            buttonSecondaryHover: customAccentColorInput.value,
            buttonDanger: '#dc2626', 
            buttonDangerHover: '#b91c1c'
        };
        sessionStorage.setItem('customThemeColors', JSON.stringify(customColors)); 
        applyTheme('custom'); 
    }

    // Event Listeners for theme selection (if elements exist)
    if (themeSelector) {
        themeSelector.addEventListener('change', (event) => {
            applyTheme(event.target.value);
        });
    }

    if (customBgColorInput) customBgColorInput.addEventListener('input', saveCustomColors);
    if (customTextColorInput) customTextColorInput.addEventListener('input', saveCustomColors);
    if (customAccentColorInput) customAccentColorInput.addEventListener('input', saveCustomColors);


    // Load saved theme on page load (if themeSelector is present)
    const savedTheme = sessionStorage.getItem('selectedTheme') || 'light'; 
    if (themeSelector) {
        themeSelector.value = savedTheme;
    }
    applyTheme(savedTheme);


    // --- CUSTOM ALERT SYSTEM ---
    // Initialize modal elements once the DOM is ready and the HTML is present
    // These assignments MUST happen after the modal HTML is added to the page.
    _customModalOverlay = document.getElementById('customModalOverlay');
    _customModalTitle = document.getElementById('customModalTitle');
    _customModalMessage = document.getElementById('customModalMessage');
    _customModalOkBtn = document.getElementById('customModalOkBtn');
    _customModalCancelBtn = document.getElementById('customModalCancelBtn');

    // Attach event listeners to modal buttons
    if (_customModalOkBtn) {
        _customModalOkBtn.addEventListener('click', () => {
            _customModalOverlay.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
            if (_resolveCustomConfirm) { // Only resolve if it's a confirm (null for alerts)
                _resolveCustomConfirm(true); 
                _resolveCustomConfirm = null; // Clear resolver
            }
        });
    }

    if (_customModalCancelBtn) {
        _customModalCancelBtn.addEventListener('click', () => {
            _customModalOverlay.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
            if (_resolveCustomConfirm) { // Only resolve if it's a confirm
                _resolveCustomConfirm(false); 
                _resolveCustomConfirm = null; // Clear resolver
            }
        });
    }

    /**
     * Replaces native alert() with a custom modal popup.
     * @param {string} message The message to display.
     * @param {string} [type="info"] Optional type for styling ('success', 'error', 'warning', 'info').
     * @param {string} [title] Optional title for the modal. Defaults based on type.
     * @returns {Promise<void>} A promise that resolves when OK is clicked.
     */
    window.showCustomAlert = function(message, type = 'info', title = null) {
        return new Promise(resolve => {
            // Check if modal elements are available. If not, fallback to native alert.
            if (!_customModalOverlay || !_customModalTitle || !_customModalMessage || !_customModalOkBtn) { 
                alert(message);
                resolve();
                return;
            }

            _customModalTitle.textContent = ''; // Clear previous title content
            _customModalMessage.textContent = message;

            // Clear previous type classes from the title
            _customModalTitle.classList.remove('success', 'error', 'warning', 'info');

            // Set type and title
            let effectiveTitle = title;
            if (!effectiveTitle) { // Set default title if not provided
                if (type === 'success') effectiveTitle = 'Success!';
                else if (type === 'error') effectiveTitle = 'Error!';
                else if (type === 'warning') effectiveTitle = 'Warning!';
                else effectiveTitle = 'Information';
            }
            _customModalTitle.textContent = effectiveTitle;
            _customModalTitle.classList.add(type); // Add type class for styling

            _customModalCancelBtn.classList.add('hidden'); // Hide cancel button for alerts
            _customModalOkBtn.classList.remove('hidden'); // Ensure OK button is visible
            _customModalOkBtn.textContent = 'OK'; // Set OK button text

            _customModalOverlay.classList.remove('hidden'); // Show the overlay
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
            _customModalOkBtn.focus(); // Focus OK button for usability

            // The click listener for _customModalOkBtn is set once in DOMContentLoaded
            // and simply hides the modal and resolves _resolveCustomConfirm (if it's a confirm).
            // For alerts, we need to ensure the specific alert's promise is resolved.
            // A simpler way for alerts is to directly resolve when OK is clicked.
            // We use onclick here to overwrite previous handlers for alerts.
            _customModalOkBtn.onclick = () => {
                _customModalOverlay.classList.add('hidden');
                document.body.style.overflow = '';
                _customModalOkBtn.onclick = null; // Clear this specific handler
                resolve(); // Resolve the promise for this showCustomAlert call
            };
        });
    };

    /**
     * Replaces native confirm() with a custom modal popup.
     * @param {string} message The message to display.
     * @param {string} [title="Confirm Action"] The title of the modal.
     * @returns {Promise<boolean>} A promise that resolves to true if OK is clicked, false if Cancel.
     */
    window.showCustomConfirm = function(message, title = "Confirm Action") {
        return new Promise((resolve) => {
            if (!_customModalOverlay || !_customModalTitle || !_customModalMessage || !_customModalOkBtn || !_customModalCancelBtn) {
                resolve(confirm(message)); // Fallback to native if modal elements not found
                return;
            }
            _resolveCustomConfirm = resolve; // Store the resolve function for button handlers

            _customModalTitle.textContent = title;
            _customModalMessage.textContent = message;
            _customModalTitle.classList.remove('success', 'error', 'warning', 'info'); // Clear type classes
            _customModalTitle.classList.add('info'); // Default confirm to info styling

            _customModalCancelBtn.classList.remove('hidden'); // Show cancel button for confirms
            _customModalOkBtn.classList.remove('hidden'); // Ensure OK button is visible
            _customModalOkBtn.textContent = 'OK'; // Set OK button text

            _customModalOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
            _customModalOkBtn.focus(); // Focus OK button

            // The click listeners for _customModalOkBtn and _customModalCancelBtn are set once in DOMContentLoaded
            // and handle resolving _resolveCustomConfirm.
        });
    };
});