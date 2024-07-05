"use client"

import {useEffect, useState} from "react";

export default function FilePage({params}: { params: any }) {
    const [data, setData] = useState<{ data: any }[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/file/${params.id}`);
            const data = await res.json();
            setData(data);
            setLoading(false);
        };

        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
