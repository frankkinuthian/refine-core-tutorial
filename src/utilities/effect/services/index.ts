import { Context, Effect, Layer } from "effect";
import { NoToken } from "../errors";

// Define a service for token access
export class TokenStore extends Context.Tag("TokenStore")<
  TokenStore,
  { getToken: () => Effect.Effect<string, NoToken> }
>() {}

// Production implementation
export const LocalStorageTokenStore = Layer.succeed(TokenStore, {
  getToken: () => {
    const token = localStorage.getItem("my_access_token");
    return token ? Effect.succeed(token) : Effect.fail(new NoToken());
  },
});
