import { z } from "zod";
import { default as validator } from "validator";

const cursorPaginationValidator = z.object({
  cursor: z.number().optional(),
  take: z
    .string()
    .default("25")
    .refine((val) => validator.isNumeric(val, { no_symbols: true }), {
      message: "The take parameter must be an integer.",
    })
    .transform((s) => parseInt(s))
    .refine((val) => val > 0, {
      message: "The take parameter must be greater than 0.",
    })
    .refine((val) => val <= 1000, {
      message: "The take parameter must be less than or equal to 1000.",
    }),
});

export { cursorPaginationValidator };
