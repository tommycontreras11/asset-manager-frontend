import accountingProvider from "@/providers/http/accounting";
import { ICreateAccountingList } from "@/providers/http/accounting/interface";
import { getMutationOptions } from "@/utils/reactQueryOptions";
import { useMutation, useQueryClient } from "react-query";

export function useCreateAccounting(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (data: ICreateAccountingList) => accountingProvider.create(data),
    getMutationOptions(queryClient, "journal-entries", null, {
      onSuccess: onSuccessCallback,
    })
  );
}
