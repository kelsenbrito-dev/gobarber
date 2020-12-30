import React, { createContext, useCallback, useContext, useState } from 'react';

import api from '../services/api';

interface IUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

interface IAuthState {
    user: IUser;
}

interface ISignInCredentials {
    email: string;
    password: string;
}

interface IAuthContextData {
    user: IUser;
    signIn(credentials: ISignInCredentials): Promise<void>;
    signOut(): void;
};

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<IAuthState>(() => {
        const user = localStorage.getItem('@GoBarber:user');
        if (user) {
            return { user: JSON.parse(user) };
        }
        return {} as IAuthState;
    });

    const signIn = useCallback(async ({ email, password }) => {

        api.post('', {
            query: `
                mutation login($email: String!, $password: String!){
                    login(email: $email, password: $password){
                        _id, name, email token
                    }
            }`,
            variables: {
                email: email,
                password: password
            }
        }, {
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(!response.data.errors){
                const user = response.data.data.login;
                localStorage.setItem('@GoBarber:user', JSON.stringify(user));
                setData({ user });
            }
        });

    }, []);

    const signOut = useCallback(() => {
        localStorage.remove('@GoBarber:user');
        setData({} as IAuthState);
    }, []);

    return (
        <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

function useAuth(): IAuthContextData {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export { AuthProvider, useAuth };