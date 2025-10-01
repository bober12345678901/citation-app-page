// theme.js - WITH CUSTOM ALERT SYSTEM & CUSTOM DROPDOWN FIX

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

    // --- THEME DROPDOWN ELEMENTS ---
    const themeToggle = document.getElementById('themeToggle');
    const themeDropdownMenu = document.getElementById('themeDropdownMenu');
    const themeOptionsContainer = document.getElementById('themeOptions');
    const currentThemeIcon = document.getElementById('currentThemeIcon');

    const customColorsContainer = document.getElementById('customColorsContainer');
    const customBgColorInput = document.getElementById('customBgColor');
    const customTextColorInput = document.getElementById('customTextColor');
    const customAccentColorInput = document.getElementById('customAccentColor');
    const body = document.body;

    // Theme definitions (unchanged)
    const themePresets = {
        light: { name: 'Light', icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>', bg: '#f3f4f6', text: '#1f2937', accent: '#3b82f6', boxBg: '#ffffff', border: '#d1d5db', inputBg: '#ffffff', inputText: '#1f2937', buttonText: '#ffffff', buttonPrimaryHover: '#2563eb', buttonSecondary: '#6b7280', buttonSecondaryHover: '#4b5563', buttonDanger: '#dc2626', buttonDangerHover: '#b91c1c' },
        dark: { name: 'Dark', icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>', bg: '#111827', text: '#f9fafb', accent: '#2563eb', boxBg: '#1f2937', border: '#374151', inputBg: '#374151', inputText: '#f9fafb', buttonText: '#ffffff', buttonPrimaryHover: '#1e40af', buttonSecondary: '#4b5563', buttonSecondaryHover: '#374151', buttonDanger: '#b91c1c', buttonDangerHover: '#991b1b' },
        sunset: { name: 'Sunset', icon: '🌅', bg: '#ffe4e6', text: '#4b1e2f', accent: '#fb7185', boxBg: '#fef2f2', border: '#fecdd3', inputBg: '#fff7f7', inputText: '#4b1e2f', buttonText: '#ffffff', buttonPrimaryHover: '#e11d48', buttonSecondary: '#fca5a5', buttonSecondaryHover: '#ef4444', buttonDanger: '#be123c', buttonDangerHover: '#9f1239' },
        ocean: { name: 'Ocean', icon: '🌊', bg: '#e0f2fe', text: '#0c4a6e', accent: '#0284c7', boxBg: '#ecf8ff', border: '#7dd3fc', inputBg: '#f0f9ff', inputText: '#0c4a6e', buttonText: '#ffffff', buttonPrimaryHover: '#0369a1', buttonSecondary: '#38bdf8', buttonSecondaryHover: '#0ea5e9', buttonDanger: '#ef4444', buttonDangerHover: '#dc2626' },
        forest: { name: 'Forest', icon: '🌲', bg: '#ecfdf5', text: '#064e3b', accent: '#10b981', boxBg: '#f0fdf4', border: '#6ee7b7', inputBg: '#f0fdf4', inputText: '#064e3b', buttonText: '#ffffff', buttonPrimaryHover: '#059669', buttonSecondary: '#34d399', buttonSecondaryHover: '#10b981', buttonDanger: '#ef4444', buttonDangerHover: '#dc2626' },
        midnight: { name: 'Midnight', icon: '🌌', bg: '#0f172a', text: '#e2e8f0', accent: '#7c3aed', boxBg: '#1e293b', border: '#475569', inputBg: '#334155', inputText: '#e2e8f0', buttonText: '#ffffff', buttonPrimaryHover: '#6d28d9', buttonSecondary: '#64748b', buttonSecondaryHover: '#475569', buttonDanger: '#dc2626', buttonDangerHover: '#b91c1c' },
        dracula: { name: 'Dracula', icon: '🧛', bg: '#282a36', text: '#f8f8f2', accent: '#bd93f9', boxBg: '#44475a', border: '#6272a4', inputBg: '#50fa7b', inputText: '#f8f8f2', buttonText: '#ffffff', buttonPrimaryHover: '#ff79c6', buttonSecondary: '#6272a4', buttonSecondaryHover: '#44475a', buttonDanger: '#ff5555', buttonDangerHover: '#ff3333' },
        cyberpunk: { name: 'Cyberpunk', icon: '🤖', bg: '#0d0f1b', text: '#fefefe', accent: '#ff007c', boxBg: '#1a1d2e', border: '#00ffff', inputBg: '#2a2e4a', inputText: '#fefefe', buttonText: '#ffffff', buttonPrimaryHover: '#ff00ff', buttonSecondary: '#00ff00', buttonSecondaryHover: '#00cc00', buttonDanger: '#fe4a4a', buttonDangerHover: '#e73030' },
        custom: { name: 'Custom', icon: '🎨', bg: '#f3f4f6', text: '#1f2937', accent: '#3b82f6', boxBg: '#ffffff', border: '#d1d5db', inputBg: '#ffffff', inputText: '#1f2937', buttonText: '#ffffff', buttonPrimaryHover: '#2563eb', buttonSecondary: '#6b7280', buttonSecondaryHover: '#4b5563', buttonDanger: '#dc2626', buttonDangerHover: '#b91c1c' } // Default custom theme
    };

    /**
     * Applies the selected theme by setting CSS variables on the root element.
     * @param {string} themeName - The name of the theme preset.
     */
    function applyTheme(themeName) {
        let theme = themePresets[themeName];
        
        if (!theme) {
            console.error(`Theme preset '${themeName}' not found. Defaulting to 'dark'.`);
            themeName = 'dark';
            theme = themePresets[themeName];
        }

        // 1. Set Body Class
        body.className = `min-h-screen theme-app-container theme-${themeName} flex items-center justify-center`; 

        if (themeName === 'custom') {
            const customColors = JSON.parse(sessionStorage.getItem('customThemeColors')) || themePresets.custom;
            theme = customColors;
            if (customBgColorInput) customBgColorInput.value = customColors.bg;
            if (customTextColorInput) customTextColorInput.value = customColors.text;
            if (customAccentColorInput) customAccentColorInput.value = customColors.accent;
            if (customColorsContainer) customColorsContainer.classList.remove('hidden');
        } else {
            if (customColorsContainer) customColorsContainer.classList.add('hidden');
        }

        // 2. Set CSS Variables on the HTML root element
        document.documentElement.style.setProperty('--bg-color', theme.bg);
        document.documentElement.style.setProperty('--text-color', theme.text);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
        document.documentElement.style.setProperty('--box-bg-color', theme.boxBg || theme.bg);
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
        document.documentElement.style.setProperty('--card-bg-color', theme.boxBg || theme.bg); 
        document.documentElement.style.setProperty('--subtle-text-color', theme.border);

        // 3. Special handling for dark mode class on HTML element
        if (['dark', 'midnight', 'dracula', 'cyberpunk'].includes(themeName)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // 4. Update the icon on the theme toggle button
        if (currentThemeIcon) {
            currentThemeIcon.innerHTML = theme.icon;
        }

        sessionStorage.setItem('selectedTheme', themeName); 
    }

    function saveCustomColors() {
        // ... (Existing saveCustomColors function)
        const customColors = {
            bg: customBgColorInput.value,
            text: customTextColorInput.value,
            accent: customAccentColorInput.value,
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

    /**
     * Renders the theme options into the dropdown menu and attaches listeners.
     */
    function renderThemeOptions() {
        if (!themeOptionsContainer) return;

        themeOptionsContainer.innerHTML = ''; 

        Object.keys(themePresets).forEach(themeKey => {
            const theme = themePresets[themeKey];
            const button = document.createElement('button');
            button.className = 'w-full text-left px-4 py-2 text-sm theme-text-color hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition duration-150 flex items-center space-x-2';
            button.setAttribute('role', 'menuitem');
            button.setAttribute('data-theme', themeKey);
            button.innerHTML = `<span>${theme.icon}</span><span>${theme.name}</span>`;
            
            button.addEventListener('click', () => {
                applyTheme(themeKey);
                // Hide the dropdown after selection
                if (themeDropdownMenu) themeDropdownMenu.classList.add('hidden');
            });

            themeOptionsContainer.appendChild(button);
        });
    }

    // --- Event Listeners for theme selection (Custom Dropdown Logic) ---

    // 1. Render options on load
    renderThemeOptions();

    // 2. Toggle Dropdown Menu (Fix: Use toggle for visibility)
    if (themeToggle && themeDropdownMenu) {
        // The toggle logic
        themeToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the body click listener from immediately closing it
            themeDropdownMenu.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            // Check if the click occurred outside both the toggle button and the dropdown menu
            if (!themeToggle.contains(event.target) && !themeDropdownMenu.contains(event.target)) {
                themeDropdownMenu.classList.add('hidden');
            }
        });
    }

    // Event Listeners for Custom Theme (unchanged)
    if (customBgColorInput) customBgColorInput.addEventListener('input', saveCustomColors);
    if (customTextColorInput) customTextColorInput.addEventListener('input', saveCustomColors);
    if (customAccentColorInput) customAccentColorInput.addEventListener('input', saveCustomColors);


    // Load saved theme on page load 
    const savedTheme = sessionStorage.getItem('selectedTheme') || 'dark'; 
    applyTheme(savedTheme);


    // --- CUSTOM ALERT SYSTEM (UNCHANGED) ---
    // Initialize modal elements once the DOM is ready and the HTML is present
    _customModalOverlay = document.getElementById('customModalOverlay');
    _customModalTitle = document.getElementById('customModalTitle');
    _customModalMessage = document.getElementById('customModalMessage');
    _customModalOkBtn = document.getElementById('customModalOkBtn');
    _customModalCancelBtn = document.getElementById('customModalCancelBtn');

    // Attach event listeners to modal buttons (for showCustomConfirm)
    if (_customModalOkBtn) {
        _customModalOkBtn.addEventListener('click', () => {
            _customModalOverlay.classList.remove('show');
            document.body.style.overflow = '';
            // Only resolve if it was a confirm dialog
            if (_resolveCustomConfirm) {
                _resolveCustomConfirm(true); 
                _resolveCustomConfirm = null;
            }
        });
    }

    if (_customModalCancelBtn) {
        _customModalCancelBtn.addEventListener('click', () => {
            _customModalOverlay.classList.remove('show');
            document.body.style.overflow = '';
            // Only resolve if it was a confirm dialog
            if (_resolveCustomConfirm) {
                _resolveCustomConfirm(false); 
                _resolveCustomConfirm = null;
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
            if (!_customModalOverlay || !_customModalTitle || !_customModalMessage || !_customModalOkBtn) { 
                alert(message);
                resolve();
                return;
            }

            _customModalTitle.textContent = '';
            _customModalMessage.textContent = message;

            _customModalTitle.classList.remove('success', 'error', 'warning', 'info');

            let effectiveTitle = title;
            if (!effectiveTitle) {
                if (type === 'success') effectiveTitle = 'Success!';
                else if (type === 'error') effectiveTitle = 'Error!';
                else if (type === 'warning') effectiveTitle = 'Warning!';
                else effectiveTitle = 'Information';
            }
            _customModalTitle.textContent = effectiveTitle;
            _customModalTitle.classList.add(type.replace(/\s+/g, '-'));

            _customModalCancelBtn.classList.add('hidden');
            _customModalOkBtn.classList.remove('hidden');
            _customModalOkBtn.textContent = 'OK';

            // Show the modal using the CSS transition class
            _customModalOverlay.classList.add('show'); 
            
            document.body.style.overflow = 'hidden';
            _customModalOkBtn.focus();

            // IMPORTANT: Overwrite the shared _customModalOkBtn listener temporarily for ALERT
            // This is a necessary pattern when mixing alerts (single action) and confirms (dual action)
            _customModalOkBtn.onclick = () => {
                _customModalOverlay.classList.remove('show');
                document.body.style.overflow = '';
                // Re-establish the original listener that handles the confirm logic
                _customModalOkBtn.onclick = null; 
                resolve(); 
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
                resolve(confirm(message));
                return;
            }
            _resolveCustomConfirm = resolve; 

            _customModalTitle.textContent = title;
            _customModalMessage.textContent = message;
            _customModalTitle.classList.remove('success', 'error', 'warning', 'info');
            _customModalTitle.classList.add('info');

            _customModalCancelBtn.classList.remove('hidden');
            _customModalOkBtn.classList.remove('hidden');
            _customModalOkBtn.textContent = 'OK';

            // Show the modal using the CSS transition class
            _customModalOverlay.classList.add('show');
            
            document.body.style.overflow = 'hidden';
            _customModalOkBtn.focus();

            // Clear any temporary onclick handler that might have been set by showCustomAlert
            _customModalOkBtn.onclick = null; 
        });
    };
});