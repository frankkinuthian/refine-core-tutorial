/**
 * Effect-TS based data provider, made with love by a lovestruck kid that loves Effectification.
 *
 * Replaces the manual fetcher with composable Effects.
 * Each method builds an Effect pipeline, then runs it at the boundary
 * using Effect.runPromise, where Refine expects a Promise.
 *
 * USE interchangeably with manual provider.
 */
import { Effect } from "effect";
import type { DataProvider } from "@refinedev/core";
import {
  authedFetch,
  parseJson,
  TokenStore,
  LocalStorageTokenStore,
} from "../utilities/effect";

const API_URL = "https://api.fake-rest.refine.dev";

/**
 * Runs an Effect that requires TokenStore, providing the production layer
 * and converting it to a Promise. This is the "edge of the world" —
 * where Effect meets Refine's async interface.
 */
const run = <A, E>(effect: Effect.Effect<A, E, TokenStore>): Promise<A> =>
  Effect.runPromise(effect.pipe(Effect.provide(LocalStorageTokenStore)));

// -- Individual data provider methods as Effects --

const getOneEffect = (resource: string, id: string | number) =>
  Effect.gen(function* () {
    const response = yield* authedFetch(`${API_URL}/${resource}/${id}`);
    const data = yield* parseJson(response);
    return { data };
  });

const getListEffect = (resource: string, params: URLSearchParams) =>
  Effect.gen(function* () {
    const response = yield* authedFetch(
      `${API_URL}/${resource}?${params.toString()}`,
    );
    const data = yield* parseJson(response);
    const total = Number(response.headers.get("x-total-count"));
    return { data, total };
  });

const getManyEffect = (resource: string, params: URLSearchParams) =>
  Effect.gen(function* () {
    const response = yield* authedFetch(
      `${API_URL}/${resource}?${params.toString()}`,
    );
    const data = yield* parseJson(response);
    return { data };
  });

const createEffect = (resource: string, variables: Record<string, unknown>) =>
  Effect.gen(function* () {
    const response = yield* authedFetch(`${API_URL}/${resource}`, {
      method: "POST",
      body: JSON.stringify(variables),
      headers: { "Content-Type": "application/json" },
    });
    const data = yield* parseJson(response);
    return { data };
  });

const updateEffect = (
  resource: string,
  id: string | number,
  variables: Record<string, unknown>,
) =>
  Effect.gen(function* () {
    const response = yield* authedFetch(`${API_URL}/${resource}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(variables),
      headers: { "Content-Type": "application/json" },
    });
    const data = yield* parseJson(response);
    return { data };
  });

// -- The actual DataProvider that Refine consumes --

export const effectDataProvider: DataProvider = {
  getOne: ({ resource, id }) => run(getOneEffect(resource, id!)),

  getList: ({ resource, pagination, filters, sorters }) => {
    const params = new URLSearchParams();

    if (pagination) {
      const current = pagination.currentPage ?? 1;
      const pageSize = pagination.pageSize ?? 10;
      params.append("_start", String((current - 1) * pageSize));
      params.append("_end", String(current * pageSize));
    }

    if (sorters && sorters.length > 0) {
      params.append("_sort", sorters.map((s) => s.field).join(","));
      params.append("_order", sorters.map((s) => s.order).join(","));
    }

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if ("field" in filter && filter.operator === "eq") {
          params.append(filter.field, filter.value);
        }
      });
    }

    return run(getListEffect(resource, params));
  },

  getMany: ({ resource, ids }) => {
    const params = new URLSearchParams();
    if (ids) {
      ids.forEach((id) => params.append("id", String(id)));
    }
    return run(getManyEffect(resource, params));
  },

  create: ({ resource, variables }) =>
    run(createEffect(resource, variables as Record<string, unknown>)),

  update: ({ resource, id, variables }) =>
    run(updateEffect(resource, id!, variables as Record<string, unknown>)),

  deleteOne: ({ resource, id }) =>
    run(
      Effect.gen(function* () {
        const response = yield* authedFetch(`${API_URL}/${resource}/${id}`, {
          method: "DELETE",
        });
        const data = yield* parseJson(response);
        return { data };
      }),
    ),
    
  getApiUrl: () => API_URL,
};
