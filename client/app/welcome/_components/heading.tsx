"use client";

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowRight} from "lucide-react";

export const Heading = () => {

    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3">
                ¡Hola! Bienvenido a <span className="underline">Hound.</span> Te invitamos seguir adelante.
            </h1>
            <Button size="sm" asChild>
                <Link href="/home">
                    Entra a Hound <ArrowRight className="h-4 w-4 ml-2"/>
                </Link>
            </Button>
        </div>
    );
};
