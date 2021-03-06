module.exports = {
	variants: {
		display: [
			'children',
			'default',
			'children-first',
			'children-last',
			'children-odd',
			'children-even',
			'children-not-first',
			'children-not-last',
			'children-hover',
			'hover',
			'children-focus',
			'focus',
			'children-focus-within',
			'focus-within',
			'children-active',
			'active',
			'children-visited',
			'visited',
			'children-disabled',
			'disabled',
			'responsive',
		],
	},
	content: [
		'./src/**/*.{js,jsx,ts,tsx}',
		'./node_modules/tw-elements/dist/js/**/*.js',
	],
	theme: {
		extend: {
			transitionDuration: {
				1500: '1500ms',
				2000: '2000ms',
				3000: '3000ms',
				4000: '4000ms',
				5000: '5000ms',
			},
			transitionDelay: {
				1500: '1500ms',
				2000: '2000ms',
				3000: '3000ms',
				4000: '4000ms',
				5000: '5000ms',
			},
			width: {
				7.5: '30px',
			},
			height: {
				7.5: '30px',
			},
		},
	},
	plugins: [
		require('tw-elements/dist/plugin'),
		require('tailwindcss-children'),
	],
};
