import React from 'react'
import BetEntry from '../models/BetEntry'

interface BetItemProps {
  bet: BetEntry
}
function BetItem({ bet }: BetItemProps) {
  return (
    <div className="bet-item flex flex-col p-3 px-4 rounded-xl shadow">
      <header className="text-sm flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12.763"
          height="12.763"
          viewBox="0 0 12.763 12.763">
          <path
            id="time-fill"
            d="M8.381,14.763a6.381,6.381,0,1,1,6.381-6.381A6.381,6.381,0,0,1,8.381,14.763Zm.638-6.381V5.191H7.743V9.658h3.829V8.381Z"
            transform="translate(-2 -2)"
            fill="#5d5d5d"
          />
        </svg>

        {bet.description}
      </header>
      <section className="flex flex-col items-center gap-4 my-2">
        <span>{bet.title}</span>
        <button>Resolve</button>
      </section>
    </div>
  )
}

export default BetItem
