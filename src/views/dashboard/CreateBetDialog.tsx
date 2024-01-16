import React from 'react'
function CreateBetDialog() {
  //TODO: Handle create logic
  return (
    <div className="px-4 py-2">
      <h2 className="py-4">Create Bet</h2>

      <div className="flex flex-col">
        <label>Title</label>
        <input />
      </div>
      <div className="flex flex-col">
        <label>Description</label>
        <input />
      </div>
      <div className="flex flex-col">
        <label>Resolve 1</label>
        <input />
      </div>
      <div className="flex flex-col">
        <label>Resolve 2</label>
        <input />
      </div>
    </div>
  )
}

export default CreateBetDialog
