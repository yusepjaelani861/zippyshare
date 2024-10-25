import { Loader2Icon } from "lucide-react"
import { create } from "zustand"


interface LoaderState {
    loader: boolean
    setLoader: (loader: boolean) => void
}

const useLoaderStore = create<LoaderState>((set) => ({
    loader: false,
    setLoader: (loader) => set({ loader })
}))

export const useLoader = () => {
    const { loader, setLoader } = useLoaderStore()

    const Loader: React.FC = () => {
        return (
            <div className="fixed z-[99999] inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative w-full h-full flex items-center justify-center">
                    <Loader2Icon size={64} className="absolute inset-0 w-40 m-auto animate-spin text-white" />
                </div>
            </div>

        )
    }

    return { loader, setLoader, Loader }
}