import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Post title cannot be empty"),
  description: z
    .string()
    .min(10, "Post description must be at least 10 characters long")
});

export type createPostDTO = z.infer<typeof createPostSchema>