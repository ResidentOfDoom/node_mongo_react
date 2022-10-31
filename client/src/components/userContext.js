import React, { createContext } from 'react';

// Create a new user context and define 
// what it will contain. 
export const UserContext = createContext({
    username: null,
    token: null,
    isAuthenticated: () => {}
});