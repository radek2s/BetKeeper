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
    'local-svg': (
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.75 22a.75.75 0 0 1-.102-1.493l.102-.007h1.749v-2.498H4.25a2.25 2.25 0 0 1-2.245-2.096L2 15.752V5.25a2.25 2.25 0 0 1 2.096-2.245L4.25 3h15.499a2.25 2.25 0 0 1 2.245 2.096l.005.154v10.502a2.25 2.25 0 0 1-2.096 2.245l-.154.005h-4.25V20.5h1.751a.75.75 0 0 1 .102 1.494L17.25 22H6.75Zm7.248-3.998h-4l.001 2.498h4l-.001-2.498Z"
          fill="#000000"
        />
      </svg>
    ),
    'mobile-menu': (
      <svg
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2048 2048"
        className="svg_dd790ee3"
        focusable="false">
        <path
          fill="white"
          d="M128 768V640h1792v128H128zm0-640h1792v128H128V128zm0 1152v-128h1792v128H128zm0 512v-128h1792v128H128z"></path>
      </svg>
    ),
  },
})
