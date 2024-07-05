import axios from "../lib/axios"

export const profileDataRequest = async (username: string) => {
    try {
        const res = await axios.get(`http://localhost:5000/users/profile/${username}`);
        let {repos, userProfile} = res.data;

        repos = repos.filter((repo: { language: string }) => repo.language === "Java");
        repos.sort((a: { created_at: string | number | Date; }, b: {
            created_at: string | number | Date;
        }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); //descending, recent first

        return {userProfile, repos};
    } catch (error) {
        console.error("Error fetching profile data:", error);
        throw error;
    }
}

export const clusterDataRequest = async (id: number) => {
    try {
        const res = await axios.get(`http://localhost:5000/clusters/${id}`);
        console.log(res.data);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching cluster data:", error);
        throw error;
    }
}

export const clusterCreateRequest = async (repos: any[], username: any) => {
    try {
        const requestBody = {repos, username};
        const res = await axios.post(`http://localhost:5000/clusters`, requestBody);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching cluster create data:", error);
        throw error;
    }
}