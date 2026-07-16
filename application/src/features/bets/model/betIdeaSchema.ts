import z from "zod";

export const BetIdeaRequestSchema = z.object({
  content: z.string(),
});

export type BetIdeaRequestTypeApi = {
  content: string;
};
export type BetIdeaTypeApi = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BetIdeaRequestType = z.infer<typeof BetIdeaRequestSchema>;

export const BetIdeaSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type BetIdeaType = z.infer<typeof BetIdeaSchema>;
