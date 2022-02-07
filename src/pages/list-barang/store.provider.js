import React from 'react';
import { useLocalStore } from 'mobx-react';

export const StoreContext = React.createContext()

export const StoreProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    listBarang: [""]
  }))
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  )
}
