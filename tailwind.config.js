/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            maxWidth: {
                outerContainer: '1920px'
            },

            fontFamily: {
                roboto: ["Roboto", "sans-serif"],
            },

            colors: {
                customBlue: {
                    default: '#1877f2',
                    100: '#E7F3FF',
                    200: '#385898'
                },

                customGray: {
                    default: '#f0f2f5',
                    100: '#e4e6eb',
                    200: '#777777',
                    300: '#65676b'
                }
            },

            boxShadow: {
                customFull: '0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)',
                customFull2: '1px 1px 10px 1px rgb(0, 0, 0, 0.1)'
            },

            backgroundImage: {
                'coverPhoto-gradient': 'linear-gradient(to top, #FFFFFF, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0))',
            },
        },
    },
    plugins: [],
}