import fixedAssetsProvider from "@/providers/http/fixed-assets";
import {
    ICreateFixedAsset,
    IUpdateFixedAsset,
} from "@/providers/http/fixed-assets/interface";
import { getMutationOptions } from "@/utils/reactQueryOptions";
import { useMutation, useQueryClient } from "react-query";

export function useCreateFixedAsset(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (data: ICreateFixedAsset) => fixedAssetsProvider.create(data),
    getMutationOptions(queryClient, "fixed-assets", null, {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useUpdateFixedAsset(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ uuid, data }: { uuid: string; data: IUpdateFixedAsset }) =>
      fixedAssetsProvider.update(uuid, data),
    getMutationOptions(queryClient, "fixed-assets", "fixed-asset", {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useDeleteFixedAsset(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (uuid: string) => fixedAssetsProvider.destroy(uuid),
    getMutationOptions(queryClient, "fixed-assets", "fixed-asset", {
      onSuccess: onSuccessCallback,
    })
  );
}
