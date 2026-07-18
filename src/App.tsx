import { Refine, GitHubBanner, Authenticated } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  useNotificationProvider,
  RefineSnackbarProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import routerProvider, {
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { dataProvider } from "./providers/data-provider";
import { authProvider } from "./providers/auth-provider";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { ShowProduct } from "./pages/products/show";
import { ListProducts } from "./pages/products/list";
import { Login } from "./pages/auth/login";
import { EditProduct } from "./pages/products/edit";
import { Header } from "./components";
import { CreateProduct } from "./pages/products/create";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                authProvider={authProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                resources={[
                  {
                    name: "protected-products",
                    list: "/products",
                    show: "/products/:id",
                    edit: "/products/:id/edit",
                    create: "/products/create",
                    meta: { label: "Products" },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "Yy6LH4-fmUJFI-KvlAqA",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-routes"
                        redirectOnFail="/login"
                      >
                        <Header />
                        <Outlet />
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={
                        <NavigateToResource resource="protected-products" />
                      }
                    />
                    <Route path="/products">
                      <Route index element={<ListProducts />} />
                      <Route path=":id" element={<ShowProduct />} />
                      <Route path=":id/edit" element={<EditProduct />} />
                      <Route path="create" element={<CreateProduct />} />
                    </Route>
                  </Route>
                  <Route
                    element={
                      <Authenticated key="auth-pages" fallback={<Outlet />}>
                        <NavigateToResource resource="protected-products" />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
