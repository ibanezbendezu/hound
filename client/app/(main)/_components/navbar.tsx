"use client";

import {useScrollTop} from "@/hooks/use-scroll-top";
import {cn} from "@/lib/utils";
import {Logo} from "./logo";
import {Button} from "@/components/ui/button";
import Link from "next/link";


export const Navbar = () => {
    const scrolled = useScrollTop();

    return (
        <div
            className={cn(
                "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-3",
                scrolled && "border-b shadow-sm"
            )}
        >
            <div className="md:ml-auto md:justify-end justify-center w-full flex items-center gap-x-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/">
                        Log out
                    </Link>
                </Button>
            </div>
        </div>
    );
};
