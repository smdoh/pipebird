import { Response } from "express";
import { z } from "zod";

export type RealizeApiResponse<T> = Response<ErrorApiSchema | { content: T }>;

const errorCodeSchema = z.enum([
  "unauthorized",
  "body_validation_error",
  "configuration_id_not_found",
  "unhandled_exception",
  "internal_server_error",
  "resource_already_exists",
  "query_validation_error",
  "organization_id_not_found",
  "integration_not_found",
  "params_validation_error",
  "integration_session_expired",
]);

export type ErrorApiSchema = {
  code: z.infer<typeof errorCodeSchema>;
  validationIssues?: z.ZodIssue[];
  message?: string;
};
