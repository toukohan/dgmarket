import { z } from "zod";

export const IsoDateString = z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "Invalid datetime string",
    });
