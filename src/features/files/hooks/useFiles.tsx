import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import FilesService from "../services/files.service"

export const useFiles = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(12)

    const { data, isLoading, refetch } = useQuery({
        queryKey: [
            "files.index",
            { page, limit }
        ],
        queryFn: () => FilesService.index({ page, limit })
    })

    return {
        data,
        isLoading,
        refetch,
        page,
        setPage,
        limit,
        setLimit
    }
}