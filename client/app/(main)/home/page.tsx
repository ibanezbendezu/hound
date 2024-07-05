"use client";

import {Heroes} from "../_components/heroes";
import {SearchCommand} from "@/components/search-command";
import {Button} from "@/components/ui/button";
//import { api } from "@/convex/_generated/api";
//import { useMutation } from "convex/react";
import {PlusCircle, Search, ArrowUpLeft, SearchCode, ArrowUp} from "lucide-react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import React from "react";
import {useAuthStore} from "@/store/auth";
import {redirect} from "next/navigation";

const Home = () => {

    const user = useAuthStore((state) => state.profile);

    //const create = useMutation(api.documents.create);

    /*
  const onCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) =>
      router.push(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new not.",
    });
  };*/

    return (
        <div className="m-10">
            <div className="my-6 flex items-center justify-between">
                <h2 className="text-4xl font-bold">
                    <kbd className="font-mono"> {"Bienvenido, "} </kbd>
                    <kbd className="text-muted-foreground font-mono">{
                        user?.displayName.split(' ')[0] || "Invitado"}
                    </kbd>
                </h2>
            </div>
            <div className="my-4 flex items-center gap-2">
                <ArrowUpLeft className="h-5 w-5 text-current"/>
                <p className="text-sm font-normal text-muted-foreground">
                    Puedes buscar repositorios clickeando allí.
                </p>
            </div>
            <div className="my-2 flex items-center gap-2">
                <p className="text-sm font-normal text-muted-foreground">
                    O usa el comando <code className="text-primary">Ctrl+k</code> en el teclado.
                </p>
                <SearchCode className="h-5 w-5 text-current"/>
            </div>
            <div className="my-16 flex items-center gap-2 justify-end">
                <p className="text-sm font-normal text-muted-foreground">
                    Los repositorios seleccionados aparecerán en el carrito.
                </p>
                <ArrowUp className="h-5 w-5 text-current"/>
            </div>
            <div className="my-20 h-full flex flex-col items-center justify-center space-y-4">
                <Heroes/>
            </div>
        </div>
    );
};

export default Home;
