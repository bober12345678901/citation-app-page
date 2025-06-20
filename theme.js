// theme.js

document.addEventListener('DOMContentLoaded', () => {
    // Tailwind CSS Configuration MUST be inside DOMContentLoaded if CDN is in head
    // and if you are using 'class' for dark mode.
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
        custom: null // Will be loaded from localStorage or default
    };

    function applyTheme(themeName) {
        let theme = themePresets[themeName];
        body.className = `min-h-screen theme-app-container theme-${themeName} flex items-center justify-center`; // Ensure these base classes are always there

        if (themeName === 'custom') {
            const customColors = JSON.parse(localStorage.getItem('customThemeColors')) || {
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
            document.documentElement.style.setProperty('--button-primary-bg', theme.accent); // Primary button uses accent
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

        localStorage.setItem('selectedTheme', themeName);
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
            buttonDanger: '#dc2626', // Keep danger consistent for custom
            buttonDangerHover: '#b91c1c'
        };
        localStorage.setItem('customThemeColors', JSON.stringify(customColors));
        applyTheme('custom'); // Re-apply custom theme after saving
    }

    // Event Listeners
    if (themeSelector) {
        themeSelector.addEventListener('change', (event) => {
            applyTheme(event.target.value);
        });
    }

    if (customBgColorInput) customBgColorInput.addEventListener('input', saveCustomColors);
    if (customTextColorInput) customTextColorInput.addEventListener('input', saveCustomColors);
    if (customAccentColorInput) customAccentColorInput.addEventListener('input', saveCustomColors);


    // Load saved theme on page load
    const savedTheme = localStorage.getItem('selectedTheme') || 'light';
    if (themeSelector) {
        themeSelector.value = savedTheme;
    }
    applyTheme(savedTheme);
});