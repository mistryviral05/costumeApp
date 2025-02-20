import React from 'react'
import { Navigate } from 'react-router-dom'



const ClientAuthProtected = ({children}) => {
        if(localStorage.getItem('clientToken')){
            return <>{children}</>
        }
        return <Navigate to={"/"} replace/>;
}

export default ClientAuthProtected
