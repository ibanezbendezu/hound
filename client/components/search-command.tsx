"use client";

import {useState, useEffect} from "react";
import {useDebounce} from "use-debounce";
import {useRouter} from "next/navigation";
import axios from "axios";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {useSearch} from "@/hooks/use-search";
import {useAuthStore} from "../store/auth";
import React from "react";
import {set} from "lodash";

interface GitHubUser {
    id: string;
    login: string;
    avatar_url: string;
}

export const SearchCommand = () => {
    const router = useRouter();
    const user = useAuthStore((state) => state.profile);

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 200);
    const [users, setUsers] = useState<GitHubUser[]>([]);

    const [isMounted, setIsMounted] = useState(false);

    const toggle = useSearch((store) => store.toggle);
    const isOpen = useSearch((store) => store.isOpen);
    const onClose = useSearch((store) => store.onClose);
    const onOpen = useSearch((store) => store.onOpen);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (!isOpen) {
                    onOpen();
                } else {
                    onClose();
                }
            }
        };

        window.addEventListener("keydown", down);
        return () => window.removeEventListener("keydown", down);
    }, [isOpen, onOpen, onClose]);

    React.useEffect(() => {
        const fetchUsers = async () => {
            if (debouncedSearchTerm) {
                try {
                    const authToken = user?.githubToken;
                    const response = await axios.get<{
                        items: GitHubUser[]
                    }>(
                        `https://api.github.com/search/users?q=${debouncedSearchTerm}`,
                        {
                            // Añadir encabezados al request
                            headers: {
                                Authorization: `Bearer ${authToken}` // Usar el token de autorización
                            }
                        }
                    );
                    setUsers(response.data.items);
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
            } else {
                setUsers([]);
            }
        };

        fetchUsers();
    }, [debouncedSearchTerm]);

    const onSelect = (id: string) => {
        setUsers([]);
        setSearchTerm("");
        router.push(`/users/${id}`);
        onClose();
    };

    if (!isMounted) return null;

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput
                placeholder="Busca usuarios de Github..."
                value={searchTerm}
                onValueChange={(value) => setSearchTerm(value)}
            />
            {users?.length > 0 && (
                <div className="px-4 py-2 text-left text-sm">Usuarios</div>
            )}
            <CommandList>
                {users?.length === 0 && (
                    <div className="py-6 text-center text-sm">No hay resultados.</div>
                )}
                {users?.map((user) => (
                    <div
                        className="hover:bg-primary/5 relative flex cursor-pointer select-none items-center rounded-sm px-4 py-4 text-sm outline-none"
                        key={user.id}
                        title={user.login}
                        onClick={() => onSelect(user.login)}
                    >
                        <img src={user.avatar_url} alt={user.login} className="mr-2 h-6 w-6 rounded-full"/>
                        <span>{user.login}</span>
                    </div>
                ))}
            </CommandList>
        </CommandDialog>
    );
};