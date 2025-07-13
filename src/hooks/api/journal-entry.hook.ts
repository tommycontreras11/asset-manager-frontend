import journalEntriesProvider from "@/providers/http/journal-entries";
import { useQuery } from "react-query";

export function useGetAllJournalEntry() {
  const query = useQuery({
    queryKey: ["journal-entries"],
    retry: 1,
    queryFn: () => journalEntriesProvider.getAll(),
  });

  return {
    ...query,
    data: query.data?.data,
  };
}

export function useGetOneJournalEntry(uuid: string) {
  const query = useQuery({
    queryKey: ["journal-entry", uuid],
    retry: 1,
    queryFn: () => journalEntriesProvider.getOne(uuid),
    enabled: !!uuid,
  });

  return {
    ...query,
    data: query.data?.data,
  };
}