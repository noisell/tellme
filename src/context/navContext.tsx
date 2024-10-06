'use client'
import React, { createContext, useContext, useState } from 'react'

type NavContextType = {
  activeButton: string
  setActiveButton: (path: string) => void
  showNavigation: boolean // Добавляем свойство для отображения навигации
  setShowNavigation: (show: boolean) => void
}

export const NavContext = createContext<NavContextType>({
  activeButton: '/',
  setActiveButton: () => {},
  showNavigation: false,
  setShowNavigation: () => {},
})

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeButton, setActiveButton] = useState<string>('/')
  const [showNavigation, setShowNavigation] = useState<boolean>(false) // Состояние для отображения навигации

  return (
    <NavContext.Provider
      value={{
        activeButton,
        setActiveButton,
        showNavigation,
        setShowNavigation,
      }}>
      {children}
    </NavContext.Provider>
  )
}

export const useNav = () => useContext(NavContext)
