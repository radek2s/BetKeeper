import React, { useState } from 'react'

interface ToastProps {
  visible: boolean
  message: string
}
const Toast: React.FC<ToastProps> = ({ visible, message }) => {
  return (
    <div className={`toast ${visible ? 'visible' : 'invisible'}`}>
      <span>{message}</span>
    </div>
  )
}

export default Toast

interface ToastService {
  show: (message: string) => void
}

/** @deprecated */
export const ToastContext = React.createContext<ToastService>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  show: () => {},
})

interface ToastProviderProps {
  children: React.ReactNode
}
/** @deprecated */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [visible, setVisibility] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  function show(message: string) {
    setVisibility(true)
    setMessage(message)
    setTimeout(() => {
      setVisibility(false)
    }, 5000)
  }
  return (
    <>
      <Toast visible={visible} message={message} />
      <ToastContext.Provider
        value={{
          show: show,
        }}>
        {children}
      </ToastContext.Provider>
    </>
  )
}
