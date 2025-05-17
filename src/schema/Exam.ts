import {z} from "zod"

export const examSchema=z.object({
    description:z.string().min(1),
    date:z.date(),
    fullMarks:z.number().min(10),
})