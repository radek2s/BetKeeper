import React from 'react'
import { initializeIcons } from '@fluentui/react/lib/Icons'
import { registerIcons } from '@fluentui/react/lib/Styling'

initializeIcons()
registerIcons({
  icons: {
    'database-svg': (
      <svg
        width="32"
        height="32"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 10c4.418 0 8-1.79 8-4s-3.582-4-8-4-8 1.79-8 4 3.582 4 8 4Zm6.328.17A7.61 7.61 0 0 0 20 9.053V18c0 2.21-3.582 4-8 4s-8-1.79-8-4V9.053a7.61 7.61 0 0 0 1.672 1.117C7.37 11.018 9.608 11.5 12 11.5c2.392 0 4.63-.482 6.328-1.33Z"
          fill="#000000"
        />
      </svg>
    ),
    'firebase-svg': (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="32px"
        height="32px">
        <path
          fill="#ff8f00"
          d="M8,37L23.234,8.436c0.321-0.602,1.189-0.591,1.494,0.02L30,19L8,37z"
        />
        <path
          fill="#ffa000"
          d="M8,36.992l5.546-34.199c0.145-0.895,1.347-1.089,1.767-0.285L26,22.992L8,36.992z"
        />
        <path
          fill="#ff6f00"
          d="M8.008 36.986L8.208 36.829 25.737 22.488 20.793 13.012z"
        />
        <path
          fill="#ffc400"
          d="M8,37l26.666-25.713c0.559-0.539,1.492-0.221,1.606,0.547L40,37l-15,8.743 c-0.609,0.342-1.352,0.342-1.961,0L8,37z"
        />
      </svg>
    ),
  },
})
