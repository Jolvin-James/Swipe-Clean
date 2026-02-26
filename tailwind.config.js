/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                sand: 'var(--color-sand)',
                ink: 'var(--color-ink)',
                'ink-10': 'var(--color-ink-10)',
                'ink-20': 'var(--color-ink-20)',
            },
            fontFamily: {
                display: ['"Inter Tight"', 'sans-serif'],
                mono: ['"Space Mono"', 'monospace'],
            },
            boxShadow: {
                'hard-sm': '4px 4px 0px 0px #000000',
                'hard-md': '8px 8px 0px 0px #000000',
                'hard-lg': '12px 12px 0px 0px #000000',
                'hard-sm-light': '4px 4px 0px 0px rgba(0,0,0,0.2)',
            },
            backgroundImage: {
                'dot-grid': 'radial-gradient(#000000 1px, transparent 1px)',
            },
            backgroundSize: {
                'dot-grid': '40px 40px',
            },
        },
    },
    plugins: [],
}
