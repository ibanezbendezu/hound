import {useState, useEffect} from "react";
import toast from "react-hot-toast";
import {getCookie} from "../lib/utils";

export const useUser = () => {
    const [profile, setProfile] = useState(null);
    useEffect(() => {
        const fetchUsers = async () => {
            const jwt = getCookie('jwt');

            try {
                const response = await fetch("http://localhost:5000/profile", {credentials: "include"});

                const data = await response.json();
                setProfile(data);
            } catch (err) {
                toast.error("Data not found.");
            }
        };

        fetchUsers();
    }, []);

    return profile;
}