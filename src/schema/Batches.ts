import {z} from "zod"

export const subjectSchema=z.object({
   subject:z.string().regex(/^[a-zA-Z0-9\s]+$/, "Subject must not contain special characters or symbols"),
})

export const batcheSchema=z.object({
    subject:z.string(),
    startTime:z.date(),
    endTime:z.date(),
    days:z.array(z.string()).min(1,{message:"At least one day must be selected."}).default([]),
})