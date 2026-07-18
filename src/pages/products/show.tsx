import { useShow } from "@refinedev/core";

export const ShowProduct = () => {
  const { query } = useShow();
  const { data: result, isLoading } = query;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Product name: {result?.data?.name}</div>;
};
