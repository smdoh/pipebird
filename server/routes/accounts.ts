import { Router } from "express";
import { z } from "zod";
import { default as validator } from "validator";
import { HttpStatusCode } from "../../utils/http.js";
import { default as argon2 } from "argon2";
import { db } from "../../lib/db.js";

const accountCreateSchema = z.object({
  email: z.string().refine(validator.isEmail, { message: "Invalid email" }),
  password: z
    .string()
    .refine(validator.isStrongPassword, { message: "Weak password" }),
});

const accountsRouter = Router();

accountsRouter.post("/", async (req, res) => {
  const bodyParseResult = accountCreateSchema.safeParse(req.body);

  if (!bodyParseResult.success) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      error: {
        code: "body_parse_error",
        issues: bodyParseResult.error.issues,
      },
    });
  }

  const { email, password } = bodyParseResult.data;

  try {
    const passwordHash = await argon2.hash(password);

    const account = await db.account.create({
      data: {
        email,
        passwordHash,
      },
    });

    return res.status(HttpStatusCode.OK).json({ id: account.id });
  } catch (error) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ error: { code: "internal_server_error" } });
  }
});

export { accountsRouter };
