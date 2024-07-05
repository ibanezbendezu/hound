"use client";

import React, {useState, useEffect} from 'react';
import {Spinner} from "@/components/spinner";
import {Navigation} from "./_components/navigation";
import {Cart} from "./_components/cart";
import {Navbar} from "./_components/navbar";
import {SearchCommand} from "@/components/search-command";
import {useAuthStore} from "@/store/auth";

const MainLayout = ({children}: { children: React.ReactNode }) => {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg"/>
            </div>
        );
    }

    return (
        <div className="h-full flex dark:bg-[#1F1F1F]">
            <Navigation/>
            <main className="flex-1 h-full overflow-y-auto">
                <SearchCommand/>
                {children}
            </main>
            <Cart/>
        </div>
    );
};

export default MainLayout;