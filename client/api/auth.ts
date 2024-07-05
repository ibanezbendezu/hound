import axios from "../lib/axios"

export const profileRequest = async () => {
    return await axios.get("/profile");
}