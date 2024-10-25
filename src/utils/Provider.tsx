import { Toaster } from "@/components/ui/toaster";
import { useLoader } from "@/hooks/use-loader";
import { QueryClient, isServer, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, Suspense } from "react";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // With SSR, we usually want to set some default staleTime
                // above 0 to avoid refetching immediately on the client
                staleTime: 60 * 1000,
            },
        },
    })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
    if (isServer) {
        // Server: always make a new query client
        return makeQueryClient()
    } else {
        // Browser: make a new query client if we don't already have one
        // This is very important, so we don't re-make a new client if React
        // suspends during the initial render. This may not be needed if we
        // have a suspense boundary BELOW the creation of the query client
        if (!browserQueryClient) browserQueryClient = makeQueryClient()
        return browserQueryClient
    }
}


export default function Provider({ children }: PropsWithChildren) {
    const queryClient = getQueryClient()
    const { loader, Loader } = useLoader()

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                {children}

                <Suspense>
                    {loader && <Loader />}
                    <Toaster />
                </Suspense>
            </QueryClientProvider>
        </SessionProvider>
    )
}