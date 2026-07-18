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
                    name: "products",
                    list: "/products",
                    show: "/products/:id",
                    edit: "/products/:id/edit",
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "Yy6LH4-fmUJFI-KvlAqA",
                }}
              >
                <Header />
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-routes"
                        redirectOnFail="/login"
                      >
                        <Outlet />
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="products" />}
                    />
                    <Route path="/products" element={<ListProducts />} />
                    <Route path="/products/:id" element={<ShowProduct />} />
                    <Route
                      path="/products/:id/edit"
                      element={<EditProduct />}
                    />
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
