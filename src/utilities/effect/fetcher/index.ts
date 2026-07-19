import { Effect } from "effect";
import { TokenStore } from "../services";
import { ApiError, NoToken } from "../errors";

/**
 * An Effect-based HTTP fetcher that automatically attaches the auth token.
 *
 * Type signature:
 *   Effect<Response, NoToken | ApiError, TokenStore>
 *
 * - Requires `TokenStore` service (dependency injection)
 * - Can fail with `NoToken` (no token available) or `ApiError` (non-2xx response)
 * - Succeeds with a validated `Response`
 */
export const authedFetch = (url: string, options?: RequestInit) =>
  Effect.gen(function* () {
    // 1. Get the token from the injected TokenStore service
    const store = yield* TokenStore;
    const token = yield* store.getToken();

    // 2. Make the fetch call, converting network errors to ApiError
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            Authorization: token,
          },
        }),
      catch: () => new ApiError({ status: 0, body: "Network error" }),
    });

    // 3. Validate the response status
    if (response.status < 200 || response.status > 299) {
      const body = yield* Effect.tryPromise({
        try: () => response.json(),
        catch: () => null,
      });
      return yield* Effect.fail(
        new ApiError({ status: response.status, body }),
      );
    }

    return response;
  });

/**
 * Parse JSON from a Response, failing with ApiError on parse failure.
 */
export const parseJson = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: () => new ApiError({ status: response.status, body: null }),
  });
