import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const ProjectProvider = ({ children }) => {

    const [token, setToken] = useState(
        localStorage.getItem("token") || null
    );

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const loginFn = (jwttoken, userData) => {
        localStorage.setItem("token", jwttoken);
        localStorage.setItem("user", JSON.stringify(userData));

        setToken(jwttoken);
        setUser(userData);
    };

    const logoutFn = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ token, user, loginFn, logoutFn }}>
            {children}
        </UserContext.Provider>
    );
};

export const authManage = () => useContext(UserContext);