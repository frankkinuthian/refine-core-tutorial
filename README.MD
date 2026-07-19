# Refine v5 Tutorial - Core (Headless + MUI)

<div align="center" style="margin: 30px;">
    <a href="https://refine.dev">
    <img alt="refine logo" src="https://refine.ams3.cdn.digitaloceanspaces.com/readme/refine-readme-banner.png">
    </a>
</div>

A hands-on tutorial project built with [Refine v5](https://refine.dev/docs/) covering authentication, data fetching, CRUD operations, routing, and an experimental **Effect-TS** integration for typed, composable data providers.

## What This Covers

1. **Authentication** - Login/logout flow with token-based auth, `useLogin`, `useLogout`, `useGetIdentity`
2. **Data Providers** - Custom fetcher with auth headers, CRUD operations (`getOne`, `getList`, `getMany`, `create`, `update`, `deleteOne`)
3. **Routing** - React Router v7 with Refine's `<Authenticated>` component for protected/public route groups
4. **UI Integration** - Material UI with `@refinedev/mui` (`DataGrid`, `useDataGrid`, `EditButton`, `ShowButton`, `ThemedLayout`)
5. **Effect-TS Data Provider** - A drop-in replacement that uses Effect for typed errors, dependency injection, and composable pipelines

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

This runs `refine dev` which starts both:

- Vite dev server on `http://localhost:5173`
- Refine DevTools server on `http://localhost:5001`

### Build

```bash
pnpm build
```

### Demo Credentials

```
Email:    demo@demo.com
Password: demodemo
```

## Project Structure

```
src/
├── App.tsx                          # Root - Refine config, routes, providers
├── components/
│   └── header/                      # App header with dark mode toggle + user avatar
├── contexts/
│   └── color-mode/                  # MUI theme (dark/light) context
├── pages/
│   ├── auth/
│   │   └── login.tsx                # Custom login page with useLogin
│   ├── categories/
│   │   └── list.tsx                 # Categories list (MuiInferencer)
│   └── products/
│       ├── list.tsx                 # Products DataGrid with useDataGrid + useSelect
│       ├── show.tsx                 # Product detail with useShow + useOne
│       └── edit.tsx                 # Product edit form with useForm (react-hook-form)
├── providers/
│   ├── auth-provider.ts             # Auth provider (login, logout, check, getIdentity)
│   ├── data-provider.ts             # Manual data provider with custom fetcher
│   └── data-provider.effect.ts      # Effect-TS data provider (drop-in replacement)
└── utilities/
    └── effect/
        ├── index.ts                 # Barrel exports
        ├── errors/index.ts          # Typed errors (NoToken, ApiError, Unauthorized)
        ├── services/index.ts        # TokenStore service + LocalStorageTokenStore layer
        └── fetcher/index.ts         # authedFetch Effect + parseJson helper
```

## Effect-TS Integration

The project includes an Effect-based data provider at `src/providers/data-provider.effect.ts` that demonstrates:

- **Typed errors** - `NoToken`, `ApiError` show up in the type signature; no more `throw response`
- **Dependency injection** - `TokenStore` service abstracts token access; swap `LocalStorageTokenStore` for a test mock with zero code changes
- **Composable pipelines** - `authedFetch` handles token + fetch + status validation in one reusable Effect
- **Bridge to Refine** - `run()` function provides the layer and converts Effect to Promise at the boundary

### Switching to the Effect provider

In `App.tsx`, change the import:

```typescript
// Manual provider:
import { dataProvider } from "./providers/data-provider";

// Effect-TS provider:
import { effectDataProvider as dataProvider } from "./providers/data-provider.effect";
```

Both are API-compatible with Refine's `DataProvider` interface.

## Key Patterns

### Route Structure (Refine v5 + React Router)

```tsx
<Routes>
  {/* Protected routes - redirect to /login if unauthenticated */}
  <Route
    element={
      <Authenticated redirectOnFail="/login">
        <Outlet />
      </Authenticated>
    }
  >
    <Route
      index
      element={<NavigateToResource resource="protected-products" />}
    />
    <Route path="/products">...</Route>
  </Route>

  {/* Auth pages - redirect to app if already authenticated */}
  <Route
    element={
      <Authenticated fallback={<Outlet />}>
        <NavigateToResource />
      </Authenticated>
    }
  >
    <Route path="/login" element={<Login />} />
  </Route>
</Routes>
```

### Resources

```typescript
resources={[{
  name: "protected-products",
  list: "/products",
  show: "/products/:id",
  edit: "/products/:id/edit",
  create: "/products/create",
  meta: { label: "Products" },
}]}
```

## Tech Stack

| Layer         | Technology                                   |
| ------------- | -------------------------------------------- |
| Framework     | Refine v5                                    |
| UI            | Material UI v6 + @refinedev/mui              |
| Routing       | React Router v7 + @refinedev/react-router    |
| Forms         | React Hook Form + @refinedev/react-hook-form |
| Data Grid     | MUI X Data Grid v7                           |
| State         | TanStack Query v5 (via Refine)               |
| Effect System | Effect-TS v3                                 |
| Build         | Vite 6                                       |
| Runtime       | React 19                                     |

## Learn More

- [Refine Documentation](https://refine.dev/docs/)
- [Refine Tutorial](https://refine.dev/tutorial/essentials/intro/)
- [Effect-TS Documentation](https://effect.website/docs/getting-started/introduction)
- [MUI X DataGrid](https://mui.com/x/react-data-grid/)

## License

MIT
