import ledgerAccountsProvider from "@/providers/http/ledger-accounts";
import { useQuery } from "react-query";

export function useGetAllLedgerAccount() {
  const query = useQuery({
    queryKey: ["ledger-accounts"],
    retry: 1,
    queryFn: () => ledgerAccountsProvider.getAll(),
  });

  return {
    ...query,
    data: query.data?.data,
  };
}

export function useGetOneLedgerAccount(uuid: string) {
  const query = useQuery({
    queryKey: ["ledger-account", uuid],
    retry: 1,
    queryFn: () => ledgerAccountsProvider.getOne(uuid),
    enabled: !!uuid,
  });

  return {
    ...query,
    data: query.data?.data,
  };
}