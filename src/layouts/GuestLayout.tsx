import Link from "next/link";
import { PropsWithChildren } from "react";

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen w-full">
            <header className="max-w-2xl mx-auto py-4">
                <Link href="/">
                    <h1 className="text-2xl font-semibold text-center text-stone-900">Zippyshare</h1>
                </Link>
            </header>

            <main className="container mx-auto space-y-4">
                {children}
            </main>
        </div>
    )
}