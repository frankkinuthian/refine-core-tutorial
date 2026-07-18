import { Data } from "effect";

// Declare the error types explicitly
export class Unauthorized extends Data.TaggedError("Unauthorized")<{}> {}
export class ApiError extends Data.TaggedError("ApiError")<{
  status: number;
  body: unknown;
}> {}
export class NoToken extends Data.TaggedError("NoToken")<{}> {}
