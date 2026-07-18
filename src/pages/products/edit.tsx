import { useForm } from "@refinedev/react-hook-form";
import { useAutocomplete, SaveButton } from "@refinedev/mui";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { Controller } from "react-hook-form";

export const EditProduct = () => {
  const {
    register,
    control,
    saveButtonProps,
    refineCore: { query },
    formState: { errors },
  } = useForm();

  const { autocompleteProps } = useAutocomplete({
    resource: "categories",
    defaultValue: query?.data?.data?.category?.id,
  });

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
      autoComplete="off"
    >
      <TextField
        {...register("name")}
        label="Name"
        error={!!errors.name}
        helperText={errors.name?.message as string}
      />
      <TextField
        {...register("description")}
        multiline
        label="Description"
        error={!!errors.description}
        helperText={errors.description?.message as string}
      />
      <TextField
        {...register("material")}
        label="Material"
        error={!!errors.material}
        helperText={errors.material?.message as string}
      />
      <Controller
        control={control}
        name="category"
        defaultValue={null}
        render={({ field }) => (
          <Autocomplete
            id="category"
            {...autocompleteProps}
            {...field}
            onChange={(_, value) => field.onChange(value)}
            getOptionLabel={(item) => {
              return (
                autocompleteProps?.options?.find(
                  (option) => option?.id == item?.id,
                )?.title ?? ""
              );
            }}
            isOptionEqualToValue={(option, value) => {
              return value === undefined || option?.id == (value?.id ?? value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                variant="outlined"
                margin="normal"
                error={!!errors.category}
                helperText={errors.category?.message as string}
              />
            )}
          />
        )}
      />
      <TextField
        {...register("price")}
        label="Price"
        error={!!errors.price}
        helperText={errors.price?.message as string}
      />
      <SaveButton {...saveButtonProps} />
    </Box>
  );
};
