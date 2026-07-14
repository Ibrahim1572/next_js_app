import { NextResponse } from "next/server"
import { z } from 'zod'
import ApiError from "@/utils/ApiError";

export default async function validateRequest<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): Promise<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ApiError(400, "Validation failed", result.error.issues);   // ← throw, don't return
  }

  return result.data;   // ← always returns the validated value, never a Response
}