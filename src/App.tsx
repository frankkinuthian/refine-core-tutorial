import { Refine, GitHubBanner, Authenticated } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  useNotificationProvider,
  RefineSnackbarProvider,
  RefineThemes,
  ThemedLayout,
  ThemedTitle,
} from "@refinedev/mui";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";

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
import { ListCategories } from "./pages/categories/list";
import { Login } from "./pages/auth/login";
import { EditProduct } from "./pages/products/edit";
import { Header } from "./components";
import { CreateProduct } from "./pages/products/create";
import { effectDataProvider } from "./providers/data-provider.effect";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={RefineThemes.Blue}>
        <RefineKbarProvider>
          <ColorModeContextProvider>
            <CssBaseline />
            <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
            <RefineSnackbarProvider>
              <DevtoolsProvider>
                <Refine
                  dataProvider={effectDataProvider}
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

                    {
                      name: "categories",
                      list: "/categories",
                      meta: { label: "Categories" },
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
                          <ThemedLayout
                            Title={(props) => (
                              <ThemedTitle {...props} text="Awesome Project" />
                            )}
                          >
                            <Outlet />
                          </ThemedLayout>
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

                      <Route path="/categories">
                        <Route index element={<ListCategories />} />
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
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
