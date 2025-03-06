import { useState, useEffect } from "react";

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const clientToken = localStorage.getItem("clientToken");
                if (!clientToken) {
                    // console.error("No token found in localStorage");
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clients/getClientById`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${clientToken}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    setLoading(false);
                    return;
                }

                const userData = await res.json();
                setUser(userData.message);
            } catch (error) {
                // console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
};

export default useAuth;
