import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                "on-primary-fixed-variant": "#0b513d",
                "on-secondary": "#ffffff",
                "surface": "#faf9f4",
                "on-tertiary": "#ffffff",
                "error-container": "#ffdad6",
                "on-tertiary-fixed": "#0d1c2e",
                "on-tertiary-fixed-variant": "#3a485b",
                "on-primary": "#ffffff",
                "on-surface-variant": "#404944",
                "secondary-container": "#fed65b",
                "tertiary-container": "#374558",
                "surface-bright": "#faf9f4",
                "error": "#ba1a1a",
                "surface-container-high": "#e9e8e3",
                "inverse-surface": "#30312e",
                "outline": "#707974",
                "on-secondary-fixed": "#241a00",
                "outline-variant": "#bfc9c3",
                "primary-container": "#064e3b",
                "tertiary": "#212f41",
                "on-primary-container": "#80bea6",
                "on-primary-fixed": "#002117",
                "on-secondary-fixed-variant": "#574500",
                "tertiary-fixed": "#d5e3fc",
                "on-secondary-container": "#745c00",
                "primary-fixed-dim": "#95d3ba",
                "background": "#faf9f4",
                "tertiary-fixed-dim": "#b9c7df",
                "surface-container-highest": "#e3e3de",
                "surface-variant": "#e3e3de",
                "surface-tint": "#2b6954",
                "inverse-primary": "#95d3ba",
                "on-error": "#ffffff",
                "secondary-fixed": "#ffe088",
                "surface-dim": "#dbdad5",
                "primary-fixed": "#b0f0d6",
                "on-error-container": "#93000a",
                "on-tertiary-container": "#a4b2c9",
                "inverse-on-surface": "#f2f1ec",
                "primary": "#003527",
                "secondary": "#735c00",
                "surface-container-low": "#f5f4ef",
                "on-surface": "#1b1c19",
                "surface-container": "#efeee9",
                "on-background": "#1b1c19",
                "secondary-fixed-dim": "#e9c349",
                "surface-container-lowest": "#ffffff"
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            spacing: {
                "margin-desktop": "48px",
                "margin-mobile": "16px",
                "container-max": "1280px",
                "base": "8px",
                "gutter": "24px"
            },
            fontFamily: {
                "sans": ['Inter', ...defaultTheme.fontFamily.sans],
                "body-sm": ["Inter"],
                "headline-lg": ["Montserrat"],
                "label-md": ["Inter"],
                "display-lg": ["Montserrat"],
                "body-md": ["Inter"],
                "headline-md": ["Montserrat"],
                "body-lg": ["Inter"],
                "headline-lg-mobile": ["Montserrat"],
                "numeric-lg": ["Inter"]
            },
            fontSize: {
                "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
                "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                "label-md": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
                "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
                "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
                "headline-lg-mobile": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
                "numeric-lg": ["32px", { "lineHeight": "40px", "fontWeight": "700" }]
            }
        },
    },

    plugins: [forms, containerQueries],
};
