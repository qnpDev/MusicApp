import { createContext, useState } from "react";

const UserContext = createContext();

function UserProvider({ children }){
    const [ dataUser, setDataUser ] = useState()

    const handle = {
        dataUser,
        setDataUser
    }

    return (
        <UserContext.Provider value={handle}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }