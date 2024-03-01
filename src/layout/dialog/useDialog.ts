import { useState } from 'react'

function useDialog(initialValue: boolean = false) {
  const [visible, setVisible] = useState<boolean>(initialValue)

  function hide() {
    setVisible(false)
  }

  function show() {
    setVisible(true)
  }

  return {
    visible,
    hide,
    show,
  }
}

export default useDialog
