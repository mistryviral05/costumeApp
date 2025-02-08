import React from 'react'
import { Navigate } from 'react-router-dom'

import { useCookies } from 'react-cookie';


const AuthProtected = ({children}) => {
     const [cookies, setCookie] = useCookies(['token']);
        if(!cookies.token){
            return <Navigate to={"/admin/"} replace/>;
        }
        return <>{children}</>
}

export default AuthProtected
