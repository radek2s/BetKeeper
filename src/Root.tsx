import React from 'react'
import { Outlet } from 'react-router-dom'

function BetKeeperRootView() {
  return (
    <div className="root">
      <div className="root__navigation">
        <h1 className="page-logo">Bet Keeper</h1>

        <ul className="page-navigation">
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28.139"
              height="25.131"
              viewBox="0 0 28.139 25.131">
              <path
                id="home-heart-fill"
                d="M25.3,25.2a1.279,1.279,0,0,1-1.279,1.279H6.116A1.279,1.279,0,0,1,4.837,25.2V13.693H1L14.209,1.684a1.279,1.279,0,0,1,1.721,0L29.139,13.693H25.3ZM15.07,21.367l4.3-4.3A2.878,2.878,0,0,0,15.3,13l-.226.226L14.843,13a2.878,2.878,0,0,0-4.07,4.07Z"
                transform="translate(-1 -1.352)"
                fill="#ffcb74"
              />
            </svg>
            Dashboard
          </li>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26.448"
              height="25.132"
              viewBox="0 0 26.448 25.132">
              <g id="Group_31" data-name="Group 31" transform="translate(-1831 -59.5)">
                <path
                  id="settings-4-fill"
                  d="M6.409,5.205A13.21,13.21,0,0,1,11.092,2.5a5.28,5.28,0,0,0,4.132,1.987A5.28,5.28,0,0,0,19.356,2.5a13.21,13.21,0,0,1,4.683,2.708,5.29,5.29,0,0,0,4.132,7.153,13.348,13.348,0,0,1,0,5.41,5.29,5.29,0,0,0-4.132,7.153,13.208,13.208,0,0,1-4.683,2.708,5.29,5.29,0,0,0-8.264,0A13.209,13.209,0,0,1,6.409,24.92a5.29,5.29,0,0,0-4.132-7.153,13.351,13.351,0,0,1,0-5.41A5.29,5.29,0,0,0,6.409,5.205ZM17.208,18.5a3.967,3.967,0,1,0-5.419-1.452A3.967,3.967,0,0,0,17.208,18.5Z"
                  transform="translate(1829 57.003)"
                  fill="#2f2f2f"
                />
              </g>
            </svg>
            Settings
          </li>
        </ul>
      </div>
      <main className="root__outlet">
        <Outlet />
      </main>
    </div>
  )
}

export default BetKeeperRootView
