import ledgerAccountsProvider from "@/providers/http/ledger-accounts";
import {
    ICreateLedgerAccount,
    IUpdateLedgerAccount,
} from "@/providers/http/ledger-accounts/interface";
import { getMutationOptions } from "@/utils/reactQueryOptions";
import { useMutation, useQueryClient } from "react-query";

export function useCreateLedgerAccount(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (data: ICreateLedgerAccount) => ledgerAccountsProvider.create(data),
    getMutationOptions(queryClient, "ledger-accounts", null, {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useUpdateLedgerAccount(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ uuid, data }: { uuid: string; data: IUpdateLedgerAccount }) =>
      ledgerAccountsProvider.update(uuid, data),
    getMutationOptions(queryClient, "ledger-accounts", "ledger-account", {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useDeleteLedgerAccount(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (uuid: string) => ledgerAccountsProvider.destroy(uuid),
    getMutationOptions(queryClient, "ledger-accounts", "ledger-account", {
      onSuccess: onSuccessCallback,
    })
  );
}
