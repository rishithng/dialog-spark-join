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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				/* Terminal theme colors */
				'terminal-green': 'hsl(var(--terminal-green))',
				'terminal-green-dim': 'hsl(var(--terminal-green-dim))',
				'terminal-green-bright': 'hsl(var(--terminal-green-bright))',
				'background-dark': 'hsl(var(--background-dark))',
				'message-own': 'hsl(var(--message-own))',
				'message-other': 'hsl(var(--message-other))',
				'timestamp': 'hsl(var(--timestamp))',
				
				/* Enhanced gradient colors */
				'gradient-start': 'hsl(var(--gradient-start))',
				'gradient-middle': 'hsl(var(--gradient-middle))',
				'gradient-end': 'hsl(var(--gradient-end))',
				'cyber-blue': 'hsl(var(--cyber-blue))',
				'cyber-purple': 'hsl(var(--cyber-purple))',
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
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				"pulse-glow": {
					"0%, 100%": { 
						boxShadow: "0 0 20px hsl(var(--terminal-green) / 0.5)" 
					},
					"50%": { 
						boxShadow: "0 0 30px hsl(var(--terminal-green) / 0.8)" 
					}
				},
				"float": {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" }
				},
				"glow": {
					"from": { boxShadow: "0 0 20px hsl(var(--terminal-green) / 0.3)" },
					"to": { boxShadow: "0 0 40px hsl(var(--terminal-green) / 0.6)" }
				},
				"slide-up": {
					"from": { transform: "translateY(20px)", opacity: "0" },
					"to": { transform: "translateY(0)", opacity: "1" }
				},
				"gradient-flow": {
					"0%, 100%": { "filter": "hue-rotate(0deg)" },
					"50%": { "filter": "hue-rotate(180deg)" }
				},
				"cyber-pulse": {
					"0%, 100%": { 
						"box-shadow": "0 0 20px hsl(var(--terminal-green) / 0.3), 0 0 40px hsl(var(--cyber-blue) / 0.2)" 
					},
					"50%": { 
						"box-shadow": "0 0 30px hsl(var(--terminal-green) / 0.5), 0 0 60px hsl(var(--cyber-blue) / 0.4)" 
					}
				},
				"matrix-shift": {
					"0%, 100%": { "transform": "translateX(0) translateY(0)" },
					"25%": { "transform": "translateX(2px) translateY(-1px)" },
					"50%": { "transform": "translateX(-1px) translateY(2px)" },
					"75%": { "transform": "translateX(-2px) translateY(-1px)" }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				"pulse-glow": "pulse-glow 2s ease-in-out infinite",
				"float": "float 6s ease-in-out infinite",
				"glow": "glow 2s ease-in-out infinite alternate",
				"slide-up": "slide-up 0.4s ease-out",
				"gradient-flow": "gradient-flow 3s ease-in-out infinite",
				"cyber-pulse": "cyber-pulse 4s ease-in-out infinite",
				"matrix-shift": "matrix-shift 8s ease-in-out infinite"
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
