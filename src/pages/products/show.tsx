import { useShow, useOne } from "@refinedev/core";
import {
  Show,
  TextFieldComponent as TextField,
  NumberField,
  MarkdownField,
} from "@refinedev/mui";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export const ShowProduct = () => {
  const {
    result: product,
    query: { isLoading },
  } = useShow();

  const {
    result: category,
    query: { isLoading: categoryIsLoading },
  } = useOne({
    resource: "categories",
    id: product?.category?.id || "",
    queryOptions: {
      enabled: !!product,
    },
  });

  if (isLoading || !product) {
    return <div>Loading...</div>;
  }

  return (
    <Show>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          Id
        </Typography>
        <TextField value={product.id} />

        <Typography variant="body1" fontWeight="bold">
          Name
        </Typography>
        <TextField value={product.name} />

        <Typography variant="body1" fontWeight="bold">
          Description
        </Typography>
        <MarkdownField value={product.description} />

        <Typography variant="body1" fontWeight="bold">
          Material
        </Typography>
        <TextField value={product.material} />

        <Typography variant="body1" fontWeight="bold">
          Category
        </Typography>
        <TextField value={categoryIsLoading ? "Loading..." : category?.title} />

        <Typography variant="body1" fontWeight="bold">
          Price
        </Typography>
        <NumberField value={product.price} />
      </Stack>
    </Show>
  );
};
