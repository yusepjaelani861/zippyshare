import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormUploadSchema } from "./schemas/FormUploadSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { convertSize } from "@/utils/helper";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import UploadService from "./services/upload.service";
import { Progress } from "@/components/ui/progress";

export default function FormUpload() {
    const [results, setResults] = useState<Array<File & { url?: string, progress: number }>>([])
    const { toast } = useToast()
    const [onUpload, setOnUpload] = useState(false)
    const [progress, setProgress] = useState(0)

    const form = useForm<z.infer<typeof FormUploadSchema>>({
        resolver: zodResolver(FormUploadSchema),
        defaultValues: {
            files: [],
            is_protected: false,
            password: "",
        }
    })

    const submit = async (values: z.infer<typeof FormUploadSchema>) => {
        if (values.files.length === 0) {
            form.setError("files", {
                message: "Minimum 1 file is required",
                type: "manual"
            })

            return;
        }

        for (let i = 0; i < values.files.length; i++) {
            if (values.files[i].size > 100 * 1024 * 1024) {
                toast({
                    title: "Error",
                    description: "Max size 100MB per file",
                    variant: "destructive"
                })

                return;
            }
        }

        setOnUpload(true)
        for (let i = 0; i < values.files.length; i++) {

            const payload = {
                file: values.files[i],
                is_protected: values.is_protected,
                password: values.password
            }

            try {
                const data = await UploadService.store(payload, setProgress)

                setResults((prev) => [...prev, {
                    ...values.files[i],
                    url: window.origin + '/v/' + data.data.slug,
                    progress: 100
                }])
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.response.data.message || "Something went wrong",
                    variant: "destructive"
                })
            } finally {
                setProgress(0)
            }

            if (i === values.files.length - 1) {
                setOnUpload(false)
            }
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload File</CardTitle>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
                        <FormField
                            control={form.control}
                            name="files"
                            render={() => (
                                <FormItem>
                                    <FormLabel>File</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    form.setValue("files", Array.from(e.target.files))
                                                    form.trigger("files")
                                                } else {
                                                    form.setValue("files", [])
                                                    form.trigger("files")
                                                }
                                            }}
                                            multiple
                                        />
                                    </FormControl>
                                    <p className="text-xs text-gray-500">
                                        Max size 100MB per file.
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* <FormField
                            control={form.control}
                            name="is_protected"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="block">Is Protected?</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={form.watch("is_protected")}
                                            onCheckedChange={(value) => {
                                                form.setValue("is_protected", value)
                                                form.trigger("is_protected")
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.watch("is_protected") && (
                            <FormField
                                control={form.control}
                                name="password"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                onChange={(e) => {
                                                    form.setValue("password", e.target.value)
                                                    form.trigger("password")
                                                }}
                                                placeholder="********"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )} */}

                        <Button
                            type="submit"
                        >
                            Upload
                        </Button>
                    </form>
                </Form>

                <div className="mt-4">
                    <Progress
                        value={progress}
                        max={100}
                    />
                </div>

                <div className="space-y-4 mt-4">
                    {form.getValues("files").map((file, index) => (
                        <Card key={index}>
                            <CardContent className="pt-4">
                                <p className="font-semibold">{file.name}</p>
                                <p className="text-sm">{convertSize(file.size)} - {file.type}</p>

                                <div className="border rounded-lg bg-slate-50 p-2 mt-2">
                                    {results.find((results, i) => i === index) ? (
                                        <p
                                            onClick={() => navigator.clipboard.writeText(results.find((results, i) => i === index)?.url ?? "")}
                                            className="text-sm font-medium hover:underline">
                                            {results.find((results, i) => i === index)?.url}
                                        </p>
                                    ) : (
                                        <p className="text-sm font-medium overflow-auto">
                                            {onUpload ? "Uploading..." : "-"}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}