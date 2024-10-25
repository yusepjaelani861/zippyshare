import { axios } from "@/config/axios"

export interface Files {
    id: number
    user_id: number | null
    name: string
    path: string
    disk: string
    size: number
    mime_type: string
    extension: string
    is_protected: boolean
    password: string | null
    slug: string
    url: string | null
    created_at: string
    updated_at: string
}

export default class UploadService {
    static store = async (payload: {
        file: File
        is_protected: boolean
        password?: string
    }, setProgress?: (progress: number) => void): Promise<APIResponse<Files>> => {
        const { data } = await axios.post("/v1/upload", payload, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 0))
                setProgress?.(percentCompleted)
            }
        })

        return data;
    }

    static show = async (slug: string): Promise<APIResponse<Files>> => {
        const { data } = await axios.get(`/v1/view/${slug}`)

        return data;
    }

    static download = async (slug: string, payload: {
        password?: string
    }): Promise<APIResponse<{
        url: string
    }>> => {
        const { data } = await axios.post(`/v1/download/${slug}`, payload)

        return data;
    }
}