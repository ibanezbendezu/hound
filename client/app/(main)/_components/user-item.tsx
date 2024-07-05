"use client";

import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {ChevronsLeftRight, ChevronDown, ArrowUpDown, LucideArrowUpDown} from "lucide-react";
import {LogOut} from "lucide-react";
import {useState, useEffect} from 'react';
import {useAuthStore} from "@/store/auth";

export const UserItem = () => {
    const user = useAuthStore((state) => state.profile);
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        return () => {
            logout();
        };
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div
                    role="button"
                    className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
                >
                    <div className="gap-x-2 flex items-center max-w-[150px]">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src={user?.photos[0].value}/>
                        </Avatar>
                        <span className="text-start font-medium line-clamp-1">
                            {user?.displayName}
                        </span>
                    </div>
                    <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-5 w-5"/>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-80"
                align="start"
                alignOffset={11}
                forceMount
            >
                <div className="flex flex-col space-y-2 p-2">
                    <p className="text-xs font-medium leading-none text-muted-foreground">
                        {user?.email}
                    </p>
                    <div className="flex items-center gap-x-2 pt-2">
                        <div className="rounded-md bg-secondary p-1">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.photos[0].value}/>
                            </Avatar>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm line-clamp-1">
                                {user?.username}
                            </p>
                        </div>
                    </div>
                </div>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <div className="flex items-center" onClick={handleLogout()}>
                        <LogOut className="text-xs"/>
                        <DropdownMenuLabel className="text-xs">Logout</DropdownMenuLabel>
                    </div>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
};