
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Poppins', 'Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Vendah+ colors
				'vendah-purple': '#5D2E8C',
				'vendah-blue': '#144D8C',
				'vendah-neon': '#39FF14',
				'vendah-black': '#0B0B0B',
				'vendah-dark': '#121212',
				'vendah-gray': {
					DEFAULT: '#221F26',
					dark: '#1C1920',
					light: '#2A2730',
				},
				'vendah-gradient-start': '#221F26',
				'vendah-gradient-end': '#2A2730',
                // New mapped Vendah+ colors from CSS variables
                'bg': 'hsl(var(--color-bg))', 
                'surface': 'hsl(var(--color-surface))',
                'neutral': 'hsl(var(--color-neutral))',
                'text-muted': 'hsl(var(--color-muted))',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
                DEFAULT: '10px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-neon': {
					'0%, 100%': { 
						boxShadow: '0 0 10px #39FF14, 0 0 15px #39FF14' 
					},
					'50%': { 
						boxShadow: '0 0 5px #39FF14, 0 0 10px #39FF14' 
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'subtle-glow': {
					'0%, 100%': { 
						filter: 'drop-shadow(0 0 15px rgba(93, 46, 140, 0.7))' 
					},
					'50%': { 
						filter: 'drop-shadow(0 0 10px rgba(93, 46, 140, 0.4))' 
					}
				},
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-neon': 'pulse-neon 2s infinite',
				'float': 'float 6s ease-in-out infinite',
				'subtle-glow': 'subtle-glow 4s ease-in-out infinite',
                'fade-in': 'fade-in 0.5s ease-out forwards'
			},
			boxShadow: {
				'neon': '0 0 5px #39FF14, 0 0 10px #39FF14',
				'neon-intense': '0 0 10px #39FF14, 0 0 20px #39FF14, 0 0 30px #39FF14',
				'neon-subtle': '0 0 5px rgba(57, 255, 20, 0.5)',
				'purple': '0 0 15px rgba(93, 46, 140, 0.5)',
				'purple-glow': '0 0 20px rgba(93, 46, 140, 0.7)',
				'blue-glow': '0 0 20px rgba(20, 77, 140, 0.6)'
			},
			backgroundImage: {
				'dark-gradient': 'linear-gradient(to bottom, #221F26, #2A2730)',
				'purple-gradient': 'linear-gradient(to right, #5D2E8C, #144D8C)',
				'button-gradient': 'linear-gradient(to right, #5D2E8C, #7039AD)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
