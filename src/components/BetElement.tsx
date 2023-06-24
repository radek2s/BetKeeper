import BetEntry, { BetResolve } from '../models/BetEntry'
import React, { useEffect, useState } from 'react'
import { FontIcon } from '@fluentui/react/lib/Icon'
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog'

import {
  Checkbox,
  DefaultButton,
  IconButton,
  PrimaryButton,
  TextField,
} from '@fluentui/react'

interface IBetElement {
  bet: BetEntry
  betUpdate: (bet: BetEntry) => void
  betDelete?: (id: string | number) => void
  betArchive?: (id: string | number) => void
}

const BetElement: React.FC<IBetElement> = ({ bet, betDelete, betUpdate, betArchive }) => {
  const [didMount, setDidMount] = useState<number>(1)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [internalBet, setInternalBet] = React.useState<BetEntry>({ ...bet })
  const [tempBet, setTempBet] = React.useState<BetEntry>({ ...bet })
  const [hideDialog, toggleHideDialog] = useState(true)
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Delete Bet',
    closeButtonAriaLabel: 'Close',
    subText: 'Are you sure?',
  }

  // Provide two new state variables to handle checkboxes values.
  // Initialize their state based on the request.betResolve value
  const [person1Checked, setPerson1Checked] = React.useState<boolean>(
    internalBet.betResolve === BetResolve.Person1 ||
      internalBet.betResolve === BetResolve.Draw
  )
  const [person2Checked, setPerson2Checked] = React.useState<boolean>(
    internalBet.betResolve === BetResolve.Person2 ||
      internalBet.betResolve === BetResolve.Draw
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
      setInternalBet({ ...internalBet, betResolve }) //save to local state variable
      betUpdate({ ...internalBet, betResolve }) //emit change to parent component
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

  function handleEditChange(updateBet?: boolean) {
    setEditMode((isEditMode) => {
      if (isEditMode && updateBet) {
        setInternalBet(tempBet)
        betUpdate(tempBet)
      } else {
        setTempBet(internalBet)
      }
      return !isEditMode
    })
  }

  return (
    <div className="bet-card">
      <header className="flex align-center space-between">
        <h2>
          {editMode ? (
            <TextField
              onChange={(_, e) => setTempBet({ ...tempBet, title: e || '' })}
              value={tempBet.title}
              placeholder="Title..."
            />
          ) : (
            <span>{internalBet.title}</span>
          )}
        </h2>
        <div className="manage-buttons">
          {bet.archived ? (
            <IconButton
              onClick={() => {
                betArchive && betArchive(bet.id)
              }}>
              <FontIcon iconName="PublishContent" />
            </IconButton>
          ) : (
            <IconButton
              disabled={editMode}
              onClick={() => {
                handleEditChange()
              }}>
              <FontIcon iconName="Edit" />
            </IconButton>
          )}
          {bet.archived ? (
            <IconButton
              onClick={() => {
                toggleHideDialog(false)
              }}>
              <FontIcon iconName="Delete" />
            </IconButton>
          ) : (
            <IconButton
              className="archive-button"
              onClick={() => {
                betArchive && betArchive(bet.id)
              }}>
              <FontIcon iconName="Archive" />
            </IconButton>
          )}
        </div>
      </header>
      <div>
        {editMode ? (
          <TextField
            onChange={(_, e) => setTempBet({ ...tempBet, description: e || '' })}
            value={tempBet.description}
            placeholder="Description..."
          />
        ) : (
          <p>{internalBet.description}</p>
        )}
      </div>
      <div className="options flex space-between">
        <div className="option flex space-between align-center">
          {editMode ? (
            <TextField
              onChange={(_, e) => setTempBet({ ...tempBet, option1: e || '' })}
              value={tempBet.option1}
              placeholder="First person demand"
            />
          ) : (
            <>
              <span>{internalBet.option1}</span>
              <Checkbox
                disabled={bet.archived}
                checked={person1Checked}
                onChange={() => {
                  handleCheck(1)
                }}
              />
            </>
          )}
        </div>
        <div className="option flex space-between align-center">
          {editMode ? (
            <TextField
              onChange={(_, e) => setTempBet({ ...tempBet, option2: e || '' })}
              value={tempBet.option2}
              placeholder="Second person demand"
            />
          ) : (
            <>
              <span className={bet.betResolve == BetResolve.Pending ? 'notFinished' : ''}>
                {tempBet.option2}
              </span>
              <Checkbox
                disabled={bet.archived}
                checked={person2Checked}
                onChange={() => {
                  handleCheck(2)
                }}
              />
            </>
          )}
        </div>
      </div>
      {editMode && (
        <div className="confirmation-buttons">
          <PrimaryButton
            onClick={() => {
              handleEditChange(true)
            }}>
            Save
          </PrimaryButton>
          <DefaultButton
            onClick={() => {
              handleEditChange(false)
            }}>
            Cancel
          </DefaultButton>
        </div>
      )}
      <Dialog
        hidden={hideDialog}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onDismiss={() => {}}
        dialogContentProps={dialogContentProps}
        modalProps={undefined}>
        <DialogFooter>
          <PrimaryButton
            onClick={() => {
              toggleHideDialog(true)
              betDelete && betDelete(+bet.id)
            }}
            text="OK"
          />
          <DefaultButton onClick={() => toggleHideDialog(true)} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export default BetElement
