import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppContextProvider = ({children}) => {

    const SignIn = async () => {
        const res =  await axios.post()
    }

    const value = {

    }

    return (
        <AppContext.Provider>
            {children}
        </AppContext.Provider>
    )
}