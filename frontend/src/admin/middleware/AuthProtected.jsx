import React from 'react'
import { Navigate } from 'react-router-dom'



const AuthProtected = ({children}) => {
        if(localStorage.getItem('token')){
            return <>{children}</>
        }
        return <Navigate to={"/admin/"} replace/>;
}

export default AuthProtected
