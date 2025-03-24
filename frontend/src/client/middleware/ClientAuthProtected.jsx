import React from 'react'
import { Navigate } from 'react-router-dom'



const ClientAuthProtected = ({children}) => {

    const getClientToken = () => {
        const data = localStorage.getItem("clientToken");
        if (!data) return null;
      
        const { token, expiry } = JSON.parse(data);
      
        if (Date.now() > expiry) {
          localStorage.removeItem("clientToken");
          return null;
        }
      
        return token;
      };

      const clientToken = getClientToken();
      


        if(clientToken){
            return <>{children}</>
        }
        return <Navigate to={"/"} replace/>;
}

export default ClientAuthProtected
