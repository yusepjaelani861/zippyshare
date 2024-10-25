import { axios } from "@/config/axios"
import { Files } from "@/features/uploads/services/upload.service"

export default class FilesService {
    static index = async (payload: {
        page?: string | number
        limit?: string | number
    }): Promise<APIResponse<Files[]>> => {
        const { data } = await axios.get("/v1/files", {
            params: payload
        })

        return data;
    }
}