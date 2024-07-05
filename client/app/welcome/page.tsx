"use client"

import {Footer} from "./_components/footer";
import {Heading} from "./_components/heading";
import {Heroes} from "./_components/heroes";
import {useAuthStore} from "../../store/auth";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {NextPageContext} from 'next'
import cookie from 'cookie';

export default function WelcomePage() {

    const {setToken, setProfile} = useAuthStore();

    useEffect(() => {
        const token = cookie.parse(document.cookie).jwt
        const profile = cookie.parse(document.cookie).user

        if (token) {
            setToken(token)
            setProfile(JSON.parse(profile))
        }
    }, [])

    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F] pt-12">
            <div
                className="flex flex-col items-center justify-center md:justify-start text-center gap-y-10 flex-1 px-6 pb-5">
                <Heading/>
                <Heroes/>
            </div>
            <Footer/>
        </div>
    );
};
