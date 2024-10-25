import { z } from "zod";

export const FormUploadSchema = z.object({
    files: z.array(z.instanceof(File)),
    is_protected: z.boolean().default(false),
    password: z.string().optional(),
})