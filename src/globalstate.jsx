import { createContext, useContext, useState } from 'react';

const UsernameContext = createContext();

export const UsernameProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [picture,setpicture]=useState(null)
  const [processname,setprocessname]=useState(null)
  const [manualmeasure,setManualmeasure]=useState(false)
  return (
    <UsernameContext.Provider value={{ username, setUsername,picture,setpicture,processname,setprocessname,manualmeasure,setManualmeasure }}>
      {children}
    </UsernameContext.Provider>
  );
};

export const useUsername = () => useContext(UsernameContext);