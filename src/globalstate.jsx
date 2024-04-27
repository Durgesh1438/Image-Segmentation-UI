import { createContext, useContext, useState } from 'react';

const UsernameContext = createContext();

export const UsernameProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [picture,setpicture]=useState(null)
  const [processname,setprocessname]=useState(null)
  const [manualmeasure,setManualmeasure]=useState(false)
  const [isLoading,setisLoading]=useState(false)
  const [loading,setloading]=useState(false)
  const [login,setlogin]=useState(true)
  const [plan,setplan]=useState(null)
  const [expires,setexpires]=useState(null)
  return (
    <UsernameContext.Provider value={{ username, setUsername,picture,setpicture,processname,setprocessname,manualmeasure,setManualmeasure,isLoading,setisLoading,loading,setloading,login,setlogin,plan,setplan,expires,setexpires }}>
      {children}
    </UsernameContext.Provider>
  );
};

export const useUsername = () => useContext(UsernameContext);