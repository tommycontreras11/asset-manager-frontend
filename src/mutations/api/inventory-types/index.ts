import departmentsProvider from "@/providers/http/inventory-types";
import {
    ICreateInventoryType,
    IUpdateInventoryType,
} from "@/providers/http/inventory-types/interface";
import { getMutationOptions } from "@/utils/reactQueryOptions";
import { useMutation, useQueryClient } from "react-query";

export function useCreateInventoryType(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (data: ICreateInventoryType) => departmentsProvider.create(data),
    getMutationOptions(queryClient, "inventory-types", null, {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useUpdateInventoryType(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ uuid, data }: { uuid: string; data: IUpdateInventoryType }) =>
      departmentsProvider.update(uuid, data),
    getMutationOptions(queryClient, "inventory-types", "inventory-type", {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useDeleteInventoryType(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (uuid: string) => departmentsProvider.destroy(uuid),
    getMutationOptions(queryClient, "inventory-types", "inventory-type", {
      onSuccess: onSuccessCallback,
    })
  );
}
