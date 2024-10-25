// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface APIResponse<T> {
    data: T;
    message: string;
    success: boolean;
    pagination: Pagination
}

interface Pagination {
    total: number
    total_page: number
    current_page: number
    next_page: number | null
    prev_page: number | null
    limit: number
    from: number
    to: number
    last_page: number
}