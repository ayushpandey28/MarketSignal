import { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [notice, setNotice] = useState('');

  const value = useMemo(
    () => ({
      notice,
      flash: (message) => {
        setNotice(message);
        setTimeout(() => setNotice(''), 3500);
      },
    }),
    [notice]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
