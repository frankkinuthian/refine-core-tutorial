import { MuiInferencer } from "@refinedev/inferencer/mui";

export const ListCategories = () => {
  return (
    <MuiInferencer
    // resource="categories" // We're omitting this prop because it's inferred from the route
    // action="list" // We're omitting this prop because it's inferred from the route
    />
  );
};
