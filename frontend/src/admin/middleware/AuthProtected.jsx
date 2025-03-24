import React from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner';



const AuthProtected = ({children}) => {

    const getToken = () => {
        const data = localStorage.getItem('token');
        if (!data) return null;
      
        const { token, expiry } = JSON.parse(data);
      
        // If expired, remove the token and return null
        if (Date.now() > expiry) {
          localStorage.removeItem('token');
          toast.warning("Session Time Out");
          return null;
        }
      
        return token;
      };
      const token = getToken();
        if(token){
            return <>{children}</>
        }
        return <Navigate to={"/admin/"} replace/>;
}

export default AuthProtected
