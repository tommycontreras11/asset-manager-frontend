import assetTypeProvider from "@/providers/http/asset-types";
import {
    ICreateAssetType,
    IUpdateAssetType,
} from "@/providers/http/asset-types/interface";
import { getMutationOptions } from "@/utils/reactQueryOptions";
import { useMutation, useQueryClient } from "react-query";

export function useCreateAssetType(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (data: ICreateAssetType) => assetTypeProvider.create(data),
    getMutationOptions(queryClient, "asset-types", null, {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useUpdateAssetType(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ uuid, data }: { uuid: string; data: IUpdateAssetType }) =>
      assetTypeProvider.update(uuid, data),
    getMutationOptions(queryClient, "asset-types", "asset-type", {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useDeleteAssetType(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (uuid: string) => assetTypeProvider.destroy(uuid),
    getMutationOptions(queryClient, "asset-types", "asset-type", {
      onSuccess: onSuccessCallback,
    })
  );
}
