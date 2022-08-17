import { Prisma } from "@prisma/client";
import { Router } from "express";
import { db } from "../../../lib/db.js";
import { RealizeApiResponse } from "../../../lib/handlers.js";
import { HttpStatusCode } from "../../../utils/http.js";
import { z } from "zod";
import { default as validator } from "validator";
const configurationRouter = Router();

// List configurations
const listConfigurationQueryParams = z.object({
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

configurationRouter.get(
  "/",
  async (
    req,
    res: RealizeApiResponse<
      Prisma.ConfigurationGetPayload<{
        select: {
          id: true;
        };
      }>[]
    >,
  ) => {
    const queryResult = listConfigurationQueryParams.safeParse(req.query);

    if (!queryResult.success) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        code: "query_validation_error",
        validationIssues: queryResult.error.issues,
      });
    }

    const { take, cursor } = queryResult.data;

    const configurations = await db.configuration.findMany({
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      take,
    });
    return res.status(HttpStatusCode.OK).json({ content: configurations });
  },
);

// Create configuration

configurationRouter.post(
  "/",
  async (
    req,
    res: RealizeApiResponse<
      Prisma.ConfigurationGetPayload<{
        select: {
          id: true;
          columns: {
            select: {
              nameInSource: true;
              nameInDestination: true;
              transformer: true;
              destinationFormatString: true;
              isPrimaryKey: true;
              isLastModified: true;
            };
          };
        };
      }>
    >,
  ) => {
    const body = z
      .object({
        viewId: z.number().nonnegative(),
        columns: z
          .object({
            nameInSource: z.string().min(1),
            nameInDestination: z.string().min(1),
            destinationFormatString: z.string().min(1),
            transformer: z.string().min(1),
            isPrimaryKey: z.boolean().default(false),
            isLastModified: z.boolean().default(false),
          })
          .array(),
      })
      .safeParse(req.body);
    if (!body.success) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        code: "body_validation_error",
        validationIssues: body.error.issues,
      });
    }

    const configuration = await db.configuration.create({
      data: {
        viewId: body.data.viewId,
      },
      select: {
        id: true,
      },
    });

    const columns = await db.$transaction(
      body.data.columns.map((column) =>
        db.columnTransformation.create({
          data: {
            configurationId: configuration.id,
            ...column,
          },
          select: {
            nameInSource: true,
            nameInDestination: true,
            transformer: true,
            destinationFormatString: true,
            isPrimaryKey: true,
            isLastModified: true,
          },
        }),
      ),
    );

    return res
      .status(HttpStatusCode.CREATED)
      .json({ content: { ...configuration, columns } });
  },
);

// Get configuration
configurationRouter.get(
  "/:configurationId",
  async (
    req,
    res: RealizeApiResponse<
      Prisma.ConfigurationGetPayload<{
        select: {
          id: true;
        };
      }>
    >,
  ) => {
    const queryParams = z
      .object({
        configurationId: z
          .string()
          .min(1)
          .refine((val) => validator.isNumeric(val, { no_symbols: true }), {
            message: "The configurationId query param must be an integer.",
          })
          .transform((s) => parseInt(s)),
      })
      .safeParse(req.query);
    if (!queryParams.success) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        code: "query_validation_error",
        message: "Invalid or missing configuration_id in path.",
        validationIssues: queryParams.error.issues,
      });
    }
    const configuration = await db.configuration.findUnique({
      where: {
        id: queryParams.data.configurationId,
      },
      select: {
        id: true,
      },
    });
    if (!configuration) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ code: "configuration_id_not_found" });
    }
    return res.status(HttpStatusCode.OK).json({ content: configuration });
  },
);

export { configurationRouter };
