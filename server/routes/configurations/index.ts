import { Prisma } from "@prisma/client";
import { Response, Router } from "express";
import { db } from "../../../lib/db.js";
import {
  ApiResponse,
  ErrorApiSchema,
  ListApiResponse,
} from "../../../lib/handlers.js";
import { HttpStatusCode } from "../../../utils/http.js";
import { z } from "zod";
import { default as validator } from "validator";
import { cursorPaginationValidator } from "../../../lib/pagination.js";
import { TransferStatus } from "../../../types/index.js";
const configurationRouter = Router();

type ConfigurationResponse = Prisma.ConfigurationGetPayload<{
  select: {
    id: true;
    viewId: true;
    columns: {
      select: {
        nameInSource: true;
        nameInDestination: true;
        destinationFormatString: true;
        transformer: true;
        isPrimaryKey: true;
        isLastModified: true;
      };
    };
  };
}>;

// List configurations
configurationRouter.get(
  "/",
  async (req, res: ListApiResponse<ConfigurationResponse>) => {
    const queryParams = cursorPaginationValidator.safeParse(req.query);

    if (!queryParams.success) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        code: "query_validation_error",
        validationIssues: queryParams.error.issues,
      });
    }

    const { take, cursor } = queryParams.data;

    const configurations = await db.configuration.findMany({
      select: {
        viewId: true,
        id: true,
        columns: {
          select: {
            nameInSource: true,
            nameInDestination: true,
            destinationFormatString: true,
            transformer: true,
            isPrimaryKey: true,
            isLastModified: true,
          },
        },
      },
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      take,
    });
    return res.status(HttpStatusCode.OK).json({ content: configurations });
  },
);

// Create configuration
configurationRouter.post(
  "/",
  async (req, res: ApiResponse<ConfigurationResponse>) => {
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
        viewId: true,
      },
    });

    const columns = await db.$transaction(
      body.data.columns.map((column) =>
        db.columnTransformation.create({
          data: {
            configurationId: configuration.id,
            destinationFormatString: column.destinationFormatString,
            isLastModified: column.isLastModified,
            isPrimaryKey: column.isPrimaryKey,
            nameInDestination: column.nameInDestination,
            nameInSource: column.nameInSource,
            transformer: column.transformer,
          },
          select: {
            nameInSource: true,
            nameInDestination: true,
            destinationFormatString: true,
            transformer: true,
            isPrimaryKey: true,
            isLastModified: true,
          },
        }),
      ),
    );

    return res
      .status(HttpStatusCode.CREATED)
      .json({ ...configuration, columns });
  },
);

// Get configuration
configurationRouter.get(
  "/:configurationId",
  async (req, res: ApiResponse<ConfigurationResponse>) => {
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
        viewId: true,
        columns: {
          select: {
            nameInSource: true,
            nameInDestination: true,
            destinationFormatString: true,
            transformer: true,
            isPrimaryKey: true,
            isLastModified: true,
          },
        },
      },
    });
    if (!configuration) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ code: "configuration_id_not_found" });
    }
    return res.status(HttpStatusCode.OK).json(configuration);
  },
);

// Delete configuration
configurationRouter.delete(
  "/:configurationId",
  async (req, res: Response<ErrorApiSchema>) => {
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

    // await db.configuration.deleteMany({
    //   where: {
    //     id: queryParams.data.configurationId,
    //     destinations: {
    //       some: {
    //         transfers: {},
    //       },
    //     },
    //   },

    //   delete: {},
    // });
    // await db.transfer.deleteMany({
    //   where: {
    //     ''
    //   }
    // })

    const configuration = await db.configuration.delete({
      where: {
        id: queryParams.data.configurationId,
      },
    });
    if (!configuration) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ code: "configuration_id_not_found" });
    }
    return res.status(HttpStatusCode.NO_CONTENT);
  },
);

export { configurationRouter };
