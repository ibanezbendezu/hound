"use client";

import {useCallback, useEffect, useState} from "react";
import toast from "react-hot-toast";
import {FaEye} from "react-icons/fa";
import {FaCodeBranch, FaCopy, FaRegStar} from "react-icons/fa";
import {FaCodeFork} from "react-icons/fa6";
import {RiGitRepositoryFill, RiUserFollowFill, RiUserFollowLine} from "react-icons/ri";
import {FaXTwitter} from "react-icons/fa6";
import {TfiThought} from "react-icons/tfi";
import {IoLocationOutline} from "react-icons/io5";
import {PROGRAMMING_LANGUAGES} from "../../../../../lib/utils";

import {formatMemberSince} from "../../../../../lib/utils";

import ProfileInfo from "../_components/profile-info";
import Repos from "../_components/repos";
import Spinner from "../_components/spinner";
import {Button} from "@/components/ui/button";

export default function UserPage({params}: { params: any }) {

    const [userProfile, setUserProfile] = useState(null);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);

    const getUserProfileAndRepos = useCallback(async (username = params.id) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/users/profile/${username}`, {credentials: "include"});
            const {repos, userProfile} = await res.json();

            console.log(repos);

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

    const memberSince = formatMemberSince(userProfile?.created_at);

    return (
        <div className='md:mx-10 mx-6 mt-14 mb-10 flex'>
            <div className='md:w-1/4 w-full px-1 md:px-0'>
                <div>
                    <div className="pb-2">
                        <a href={userProfile?.html_url}>
                            <img
                                className='h-260 w-260 rounded-full border-2'
                                src={userProfile?.avatar_url}
                                alt={userProfile?.name}
                            />
                        </a>
                    </div>

                    <div className='flex flex-col py-4 border-b text-sm'>
                        <div className='text-3xl font-semibold'>{userProfile?.name}</div>
                        <span className='text-muted-foreground text-lg'>{userProfile?.login}</span>

                        <div className='mt-5'>
                            <Button variant="secondary" size="sm"
                                    className=" w-full flex items-center justify-center gap-4 rounded-lg">
                                <FaEye size={16}/>
                                <span className="text-center">Ver perfil en Github</span>
                            </Button>
                            <p className='text-sm mb-4'>
                                {userProfile?.bio}
                            </p>
                        </div>

                        <div className='flex flex-wrap gap-0 mx-1 font-normal'>
                            {/* Followers Count */}
                            <div className='flex items-center gap-2 bg-glass rounded-lg p-2 flex-1 min-w-24'>
                                <RiUserFollowFill className='w-3 h-3 text-primary'/>
                                <p className='text-muted-foreground text-xs'>Seguidores: {userProfile?.followers}</p>
                            </div>

                            {/* Following count */}
                            <div className='flex items-center gap-2 bg-glass rounded-lg p-2 flex-1 min-w-24'>
                                <RiUserFollowLine className='w-3 h-3 text-primary'/>
                                <p className='text-muted-foreground text-xs'>Seguidos: {userProfile?.following}</p>
                            </div>

                            {/* Number of public repos */}
                            <div className='flex items-center gap-2 bg-glass rounded-lg p-2 flex-1 min-w-24'>
                                <RiGitRepositoryFill className='w-3 h-3 text-primary'/>
                                <p className='text-muted-foreground text-xs'>R.
                                    Públicos: {userProfile?.public_repos}</p>
                            </div>

                            {/* Number of public gists */}
                            <div className='flex items-center gap-2 bg-glass rounded-lg p-2 flex-1 min-w-24'>
                                <RiGitRepositoryFill className='w-3 h-3 text-primary'/>
                                <p className='text-muted-foreground text-xs'>G.
                                    Públicos: {userProfile?.public_gists}</p>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col py-4 border-b text-sm'>
                        {/* User Bio */}
                        {userProfile?.bio ? (
                            <div className='flex items-center gap-2'>
                                <TfiThought/>
                                <p className='text-sm'>{userProfile?.bio.substring(0, 60)}...</p>
                            </div>
                        ) : null}

                        {/* Location */}
                        {userProfile?.location ? (
                            <div className='flex items-center gap-2'>
                                <IoLocationOutline/>
                                {userProfile?.location}
                            </div>
                        ) : null}

                        {/* Twitter Username */}
                        {userProfile?.twitter_username ? (
                            <a
                                href={`https://twitter.com/${userProfile.twitter_username}`}
                                target='_blank'
                                rel='noreferrer'
                                className='flex items-center gap-2 hover:text-primary/80'
                            >
                                <FaXTwitter/>
                                {userProfile?.twitter_username}
                            </a>
                        ) : null}

                        {/* Member Since Date */}
                        <div className='my-2 text-xs'>
                            <p className='text-muted-foreground font-normal'>Miembro desde</p>
                            <p className=''>{memberSince}</p>
                        </div>

                        {/* Email Address */}
                        {userProfile?.email && (
                            <div className='my-2 text-xs'>
                                <p className='text-muted-foreground font-normal'>Email address</p>
                                <p className=''>{userProfile.email}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className='md:w-3/4 md:ml-6 px-1 md:px-0 grid grid-cols-1 md:grid-cols-2 gap-4'>
                <h2 className='col-span-full text-2xl font-bold'>Repositorios</h2>
                {/* Repositories Section*/}
                {repos.map((repo) => (
                    <div key={repo.id} className='border-2 px-4 py-4 rounded-lg text-sm'>
                        <div>
                            <a href={repo.html_url} className='hover:underline text-sm font-semibold'>
                                {repo.name}
                            </a>
                            <p className='text-muted-foreground mt-2 text-xs font-light'>
                                {repo.description ? repo.description.slice(0, 500) : "No se proporciona descripción\n"}
                            </p>
                        </div>
                        <div className='text-muted-foreground flex text-sm space-x-2 mt-6 items-center'>

                            {PROGRAMMING_LANGUAGES[repo.language as keyof typeof PROGRAMMING_LANGUAGES] ? (
                                <img src={PROGRAMMING_LANGUAGES[repo.language as keyof typeof PROGRAMMING_LANGUAGES]}
                                     alt='Programming language icon' className='h-8'/>
                            ) : null}

                            {repo.language && (
                                <div className='font-normal text-xs'>
                                    {repo.language}
                                </div>
                            )}

                            <span
                                className='bg-muted-foreground text-secondary text-xs font-normal px-2.5 py-0.5 rounded-full flex items-center gap-1'>
                                <FaRegStar/> {repo.stargazers_count}
                            </span>

                            <span
                                className='bg-muted-foreground text-secondary text-xs font-normal px-2.5 py-0.5 rounded-full flex items-center gap-1'>
                                <FaCodeFork/> {repo.forks_count}
                            </span>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
