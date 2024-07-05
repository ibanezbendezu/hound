import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const fetchGitHubUsers = async (term: string) => {
    const response = await fetch(`https://api.github.com/search/users?q=${term}`);
    const data = await response.json();
    return data.items;
};