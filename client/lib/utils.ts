import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import cookie from "cookie"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const opciones: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
};

export function formatDateTime(inputDateString: string | number | Date) {
    return new Date(inputDateString).toLocaleDateString("es-CL", opciones);
}

export function parseJwt(token: string) {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
}

export const getTokenFromCookies = (req: any) => {
    const cookies = cookie.parse(req ? req.headers.cookie || '' : document.cookie);
    return cookies.jwt || null;
};

export function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const PROGRAMMING_LANGUAGES = {
    TypeScript: "/typescript.svg",
    JavaScript: "/javascript.svg",
    Python: "/python.svg",
    Java: "/java.svg",
    "C++": "/c++.svg",
    Swift: "/swift.svg",
    Csharp: "/csharp.svg",
    Go: "/go.svg",
    HTML: "/html.svg",
    CSS: "/css.svg",
};

export function formatMemberSince(inputDateString: string | number | Date) {
    const options: Intl.DateTimeFormatOptions = {month: "short", day: "2-digit", year: "numeric"};
    return new Date(inputDateString).toLocaleDateString("en-US", options);
}

export function formatDate(inputDateString: string | number | Date) {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const date = new Date(inputDateString);
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    // Function to add ordinal suffix to day
    function getOrdinalSuffix(day: any) {
        if (day >= 11 && day <= 13) {
            return day + "th";
        }
        switch (day % 10) {
            case 1:
                return day + "st";
            case 2:
                return day + "nd";
            case 3:
                return day + "rd";
            default:
                return day + "th";
        }
    }

    return `${monthName} ${getOrdinalSuffix(day)}, ${year}`;
}