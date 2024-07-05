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

import ProfileInfo from "../_components/profile-info2";
import Repos from "../_components/repos2";
import {Spinner} from "@/components/spinner";
import {Button} from "@/components/ui/button";
import {profileDataRequest} from '../../../../../api/server-data';

export default function UserPage({params}: { params: any }) {

    const [userProfile, setUserProfile] = useState(null);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            const data = await profileDataRequest(params.id);
            const {userProfile, repos: fetchedRepos} = data;
            setRepos(fetchedRepos);
            setUserProfile(userProfile);
            setLoading(false);
        };

        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg"/>
            </div>
        );
    }

    const memberSince = formatMemberSince(userProfile?.created_at);

    return (
        <div className='m-5'>
            <div className='p-4 flex gap-6 flex-col md:flex-row justify-center items-start'>

                <div className='md:w-1/3 w-full px-1 md:px-0'>
                    <div className="flex flex-col py-2 gap-5">
                        <a href={userProfile?.html_url}>
                            <img
                                className='h-260 w-260 rounded-full border-2'
                                src={userProfile?.avatar_url}
                                alt={userProfile?.name}
                            />
                        </a>
                        <div className="text-left ">
                            <div className='text-3xl font-semibold'>{userProfile?.name}</div>
                            <span className='text-muted-foreground text-lg'>{userProfile?.login}</span>
                        </div>
                    </div>

                    <div className='flex flex-col py-2 border-b text-sm'>
                        <div className='mt-2'>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full flex items-center justify-center gap-4 rounded-lg"
                                onClick={() => window.open(userProfile?.html_url, '_blank')}
                            >
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
                            {/* <div className='flex items-center gap-2 bg-glass rounded-lg p-2 flex-1 min-w-24'>
                                <RiGitRepositoryFill className='w-3 h-3 text-primary' />
                                <p className='text-muted-foreground text-xs'>R. Públicos: {userProfile?.public_repos}</p>
                            </div> */}

                            {/* Number of public gists */}
                            {/* <div className='flex items-center gap-2 bg-glass rounded-lg p-2 flex-1 min-w-24'>
                                <RiGitRepositoryFill className='w-3 h-3 text-primary' />
                                <p className='text-muted-foreground text-xs'>G. Públicos: {userProfile?.public_gists}</p>
                            </div> */}
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

                <Repos repos={repos}/>
            </div>
        </div>
    );
};
