"use client";

import {useCallback, useEffect, useState} from "react";
import toast from "react-hot-toast";

import ProfileInfo from "./_components/profile-info";
import Repos from "./_components/repos";
import Spinner from "./_components/spinner";

const UserPage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);

    const getUserProfileAndRepos = useCallback(async (username = "burakorkmez") => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/users/profile/${username}`);
            const {repos, userProfile} = await res.json();

            repos.sort((a: { created_at: string | number | Date; }, b: { created_at: string | number | Date; }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); //descending, recent first

            setRepos(repos);
            setUserProfile(userProfile);

            return {userProfile, repos};
        } catch (error) {
            toast.error("Data not found.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getUserProfileAndRepos();
    }, [getUserProfileAndRepos]);


    return (
        <div className='m-4'>
            <div className='flex gap-4 flex-col lg:flex-row justify-center items-start'>
                {userProfile && !loading && <ProfileInfo userProfile={userProfile}/>}

                {!loading && <Repos repos={repos}/>}
                {loading && <Spinner/>}
            </div>
        </div>
    );
};
export default UserPage;
