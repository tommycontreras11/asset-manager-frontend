import assetTypeProvider from "@/providers/http/depreciation-calculations";
import {
    ICreateDepreciationCalculation,
    IUpdateDepreciationCalculation,
} from "@/providers/http/depreciation-calculations/interface";
import { getMutationOptions } from "@/utils/reactQueryOptions";
import { useMutation, useQueryClient } from "react-query";

export function useCreateDepreciationCalculation(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (data: ICreateDepreciationCalculation) => assetTypeProvider.create(data),
    getMutationOptions(queryClient, "depreciation-calculations", null, {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useUpdateDepreciationCalculation(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ uuid, data }: { uuid: string; data: IUpdateDepreciationCalculation }) =>
      assetTypeProvider.update(uuid, data),
    getMutationOptions(queryClient, "depreciation-calculations", "depreciation-calculation", {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useDeleteDepreciationCalculation(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (uuid: string) => assetTypeProvider.destroy(uuid),
    getMutationOptions(queryClient, "depreciation-calculations", "depreciation-calculation", {
      onSuccess: onSuccessCallback,
    })
  );
}
