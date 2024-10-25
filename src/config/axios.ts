import axiosService from "axios"
import { getSession } from "next-auth/react"

export const axios = axiosService.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})


axios.interceptors.request.use(
    async (config) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session: any = await getSession()
        if (session?.user?.token) {
            config.headers.Authorization = `Bearer ${session?.user?.token}`
        }

        return config
    }
)