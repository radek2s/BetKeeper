import BetEntry, { BetResolve } from '../models/BetEntry'
import React, { useEffect, useState } from 'react'
interface IBetElement {
  bet: BetEntry
  betDelete: (id: number) => void
  betUpdate: (bet: BetEntry) => void
}

const BetElement: React.FC<IBetElement> = ({ bet, betDelete, betUpdate }) => {
  const [didMount, setDidMount] = useState<number>(1)
  const [request, setRequest] = React.useState<BetEntry>({ ...bet })

  // Provide two new state variables to handle checkboxes values.
  // Initialize their state based on the request.betResolve value
  const [person1Checked, setPerson1Checked] = React.useState<boolean>(
    request.betResolve === BetResolve.Person1 || request.betResolve === BetResolve.Draw
  )
  const [person2Checked, setPerson2Checked] = React.useState<boolean>(
    request.betResolve === BetResolve.Person2 || request.betResolve === BetResolve.Draw
  )

  //Using useEffect(() => {...}, [x, y]) hook we can perform some actions when one
  // of the [x,y] value in array has changed. So now we are listening for any value
  // change of person1Checked or person2Checked and then we are performing request update
  useEffect(() => {
    let betResolve: BetResolve
    //Simple condition validation
    if (person1Checked && person2Checked) {
      betResolve = BetResolve.Draw //both checked
    } else if (!person1Checked && !person2Checked) {
      betResolve = BetResolve.Pending //none checked
    } else {
      betResolve = person1Checked ? BetResolve.Person1 : BetResolve.Person2
    }
    setDidMount((mount) => mount - 1)
    if (didMount < 0) {
      setRequest({ ...request, betResolve }) //save to local state variable
      betUpdate({ ...request, betResolve }) //emit change to parent component
    }
  }, [person1Checked, person2Checked])

  const handleCheck = (person: 1 | 2) => {
    // Here is a tricky part -> depending on the provided personType (1 or 2) we
    // assign the proper setPerson1Checked or setPerson2Checked method to variable called method
    const method = person === 1 ? setPerson1Checked : setPerson2Checked
    // It behaves in the same way how it will be done with setPerson1Checked or setPerson2Checked
    // but in one line we handle both cases
    method((perviousValue: boolean) => !perviousValue)
  }

  return (
    <div className="bet-card">
      <header className="flex align-center space-between">
        <h2>
          <input
            onChange={(e) => setRequest({ ...request, title: e.target.value })}
            value={request.title}
          />
        </h2>
        <div className="">
          <button
            className="accept"
            onClick={() => {
              betUpdate(request)
            }}>
            ✅
          </button>
          <button
            className="delete"
            onClick={() => {
              betDelete(+bet.id)
            }}>
            ❌
          </button>
        </div>
      </header>
      <div className="options flex space-between">
        <div className="flex space-between align-center">
          <input
            type="textarea"
            className={bet.betResolve == BetResolve.Pending ? 'notFinished' : ''}
            onChange={(e) => setRequest({ ...request, option1: e.target.value })}
            value={request.option1}
          />
          <input
            checked={person1Checked}
            type="checkbox"
            className="checkbox"
            onChange={() => {
              handleCheck(1)
            }}
          />
        </div>
        <div className="flex space-between align-center">
          <input
            type="textarea"
            className={bet.betResolve == BetResolve.Pending ? 'notFinished' : ''}
            onChange={(e) => setRequest({ ...request, option2: e.target.value })}
            value={request.option2}
          />
          <input
            checked={person2Checked}
            type="checkbox"
            className="checkbox"
            onChange={() => {
              handleCheck(2)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default BetElement
