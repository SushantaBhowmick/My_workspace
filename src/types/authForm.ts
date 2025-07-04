import { z } from "zod";

export const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6,{message:"Password must be at least 6 charater"})
});