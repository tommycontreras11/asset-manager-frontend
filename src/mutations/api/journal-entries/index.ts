import journalEntriesProvider from "@/providers/http/journal-entries";
import {
    ICreateJournalEntry,
    IUpdateJournalEntry,
} from "@/providers/http/journal-entries/interface";
import { getMutationOptions } from "@/utils/reactQueryOptions";
import { useMutation, useQueryClient } from "react-query";

export function useCreateJournalEntry(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (data: ICreateJournalEntry) => journalEntriesProvider.create(data),
    getMutationOptions(queryClient, "journal-entries", null, {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useUpdateJournalEntry(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ uuid, data }: { uuid: string; data: IUpdateJournalEntry }) =>
      journalEntriesProvider.update(uuid, data),
    getMutationOptions(queryClient, "journal-entries", "journal-entry", {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useDeleteJournalEntry(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (uuid: string) => journalEntriesProvider.destroy(uuid),
    getMutationOptions(queryClient, "journal-entries", "journal-entry", {
      onSuccess: onSuccessCallback,
    })
  );
}
