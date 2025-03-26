import { z } from "zod";

export const businessTypeSchema = z.object({
  businessType: z.string().min(1, "You must select a business type"),
});
