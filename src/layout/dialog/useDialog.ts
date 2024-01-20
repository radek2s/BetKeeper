import { useState } from 'react'

function useDialog() {
  const [visible, setVisible] = useState<boolean>(false)

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
