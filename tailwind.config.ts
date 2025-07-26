import type {Config} from "tailwindcss";
import {heroui} from "@heroui/react";
import tailwindcss_animate from "tailwindcss-animate";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'small-gradient': 'linear-gradient(rgba(120, 99, 227, 0.612), rgba(120, 99, 227, 0.612))',
                'large-gradient': 'linear-gradient(60deg, hsl(211, 84%, 27%) 0%, hsl(250, 77%, 64%) 50%, hsl(280, 87%, 76%) 100%)',
                'recursive-gradient': 'linear-gradient(90deg, hsl(211, 84%, 27%) 0%, hsl(250, 77%, 64%) 40%, hsl(280, 87%, 76%) 80%, hsl(250, 77%, 64%) 94%, hsl(211, 84%, 27%) 100%)'
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                title: 'hsl(var(--title))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            fontSize: {
                'cv1': '12px',
                'cv2': '14px',
                'cv3': '16px',
                'cv4': '18px',
                'cv5': '20px',
                'cv6': '24px',
                'cv7': '30px',
                'cv8': '36px',
                'cv9': '48px',
                'cv10': '60px',
                'cv11': '72px',            },
            animation: {
                'spin-slow': 'spin 8s linear infinite',
            },
            spacing: {
                'scv1': '4px',
                'scv2': '8px',
                'scv3': '12px',
                'scv4': '16px',
                'scv5': '24px',
                'scv6': '32px',
                'scv7': '48px',
                'scv8': '64px',
                'scv9': '96px',
                'scv10': '128px',
                'scv11': '192px',
                'scv12': '256px',
                'scv13': '324px',
                'scv14': '512px',
                'scv15': '640px',
                'scv16': '720px',
                'scv17': '860px',
                'scv18': '1280px'
            },

        },
        screens: {
            'mw': '400px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
    },
    darkMode: ["class"],
    plugins: [heroui(), tailwindcss_animate],
} satisfies Config;
