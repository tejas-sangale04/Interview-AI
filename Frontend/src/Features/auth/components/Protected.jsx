import React, { Children } from 'react';
import { useAuth } from '../hooks/useauth';
import { Navigate, useNavigate } from 'react-router';

const Protected = ({children}) => {
    const {user,loading} = useAuth()

     if (loading) {
        return <main><h1>Loading....</h1></main>
    }
    if(!user){
       return <Navigate to={'/login'}></Navigate>
    }

    return children

}

export default Protected