import { useState, useEffect } from "react";

const useAuthAdmin = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const tokenHole = JSON.parse(localStorage.getItem("token"));
               const  token = tokenHole.token;
                if (!token) {
                    // console.error("No token found in localStorage");
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/getAdminDetails`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (!res.ok) {
                    const errorData = await res.json();
                  
                    setLoading(false);
                    return;
                }

                const adminData = await res.json();
                
                setAdmin(adminData.message);
            } catch (error) {
                // console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();
    }, []);

    return { admin, loading };
};

export default useAuthAdmin;
