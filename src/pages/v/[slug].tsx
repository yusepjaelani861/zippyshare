import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import UploadService, { Files } from "@/features/uploads/services/upload.service";
import GuestLayout from "@/layouts/GuestLayout";
import { convertSize } from "@/utils/helper";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Fragment, useState } from "react";

const VideoPlayer = dynamic(() => import("@/components/video-player"), {
    ssr: false
})

export default function ShowPage({ data }: { data: Files }) {
    const [wait, setWait] = useState(false);
    const [step, setStep] = useState(0);
    const [timer, setTimer] = useState(5);
    const [url, setUrl] = useState("");
    const [error, setError] = useState(false);

    const submit = async () => {
        setWait(true)
        setStep(1)
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1)
        }, 1000)

        setTimeout(() => {
            clearInterval(interval)

            UploadService.download(data.slug, { password: "" })
                .then((res) => {
                    setUrl(res.data.url)
                    setStep(2)
                }).catch(() => {
                    setError(true)
                }).finally(() => {
                    setWait(false)
                })
        }, 10000)
    }

    return (
        <GuestLayout>
            <Head>
                <title>{data.name}</title>
            </Head>

            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    {data.mime_type.includes("image") && data.url && (
                        <picture className="mb-4">
                            <img src={data.url} alt={data.name} className="w-full h-full object-contain" />
                        </picture>
                    )}

                    {data.mime_type.includes("video") && data.url && (
                        <VideoPlayer url={data.url} />
                    )}

                    <CardTitle className="">{data.name}</CardTitle>
                </CardHeader>

                <CardContent className="">
                    <p className=""><b>Size: </b> {convertSize(data.size)}</p>
                    <p className=""><b>Extension: </b> {data.extension.toUpperCase()}</p>
                    <p className=""><b>Created At: </b> {new Date(data.created_at).toLocaleString()}</p>
                </CardContent>

                <CardFooter>
                    <div className="flex items-center justify-center w-full">
                        {!error && (
                            <Fragment>
                                {step !== 2 ? (
                                    <Button
                                        type="button"
                                        onClick={submit}
                                        disabled={wait}
                                    >
                                        {wait ? (
                                            <Fragment>
                                                {timer < 0 ? "Finding files..." : `Please wait ${timer} seconds`}
                                            </Fragment>
                                        ) : "Download"}
                                    </Button>
                                ) : (
                                    <div>
                                        <p className="text-sm text-opacity-80">File has been founded.</p>
                                        <a href={url} target="_blank">
                                            <Button
                                                type="button"
                                            >
                                                Click to Download
                                            </Button>
                                        </a>
                                    </div>
                                )}
                            </Fragment>
                        )}

                        {error && (
                            <p className="text-red-500">Error, please refresh the page.</p>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </GuestLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
        const slug = ctx.params?.slug as string

        const data = await UploadService.show(slug);

        return {
            props: {
                data: data.data
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return {
            notFound: true
        }
    }
}