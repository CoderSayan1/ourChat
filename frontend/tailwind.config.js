/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scrollbarWidth: {
        '0': '0px',
      },
    },
  },
  plugins: [
    function({addUtilities}){
      const newUtilities = {
        ".scrollbar-thin":{
          scrollbarWidth: "thin",
        },
        ".scrollbar-webkit":{
          "&::-webkit-scrollbar":{
            width: "2px"
          },
          "&::-webkit-scrollbar-thumb":{
            borderRadius: "32px",
            border: "1px solid white"
          }
        },
        ".scrollbar-hide": {
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            width: '0px',
            height: '0px',
          },
        },
      }

      addUtilities(newUtilities, ["responsive", "hover"])
    }
  ],
}