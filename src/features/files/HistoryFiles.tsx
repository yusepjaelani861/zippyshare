import { Card, CardContent } from "@/components/ui/card"
import { useFiles } from "./hooks/useFiles"
import { convertSize } from "@/utils/helper"
import { Button } from "@/components/ui/button"

export default function HistoryFiles() {
    const { data, setPage, page } = useFiles()

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data && data.data.map((item, index) => (
                    <a
                        key={index}
                        href={`/v/${item.slug}`}
                        target="_blank"
                    >
                        <Card>
                            <CardContent className="pt-4">
                                <h1 className="font-semibold line-clamp-1">{item.name}</h1>
                                <p className="text-sm">{convertSize(item.size)} - {item.extension.toUpperCase()}</p>

                                <div className="border rounded-lg bg-slate-50 p-2 mt-2">
                                    <p className="text-sm">{new Date(item.created_at).toLocaleString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                ))}
            </div>

            <div className="flex justify-center space-x-4">
                <Button
                    type="button"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </Button>

                <Button
                    type="button"
                    onClick={() => setPage(page + 1)}
                    disabled={data && data.pagination.last_page === page}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}