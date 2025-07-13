"use client";

import {
  CreateUpdateForm,
  IFormField,
} from "@/components/common/modal/create-update";
import DataTable from "@/components/common/table/data-table";
import { commonStatusTableDefinitions } from "@/definitions/common.definition";
import {
  useGetAllJournalEntry,
  useGetOneJournalEntry,
} from "@/hooks/api/journal-entry.hook";
import {
  useCreateJournalEntry,
  useDeleteJournalEntry,
  useUpdateJournalEntry,
} from "@/mutations/api/journal-entries";
import {
  ICreateJournalEntry,
  IUpdateJournalEntry,
} from "@/providers/http/journal-entries/interface";
import {
  createJournalEntryFormSchema,
  updateJournalEntryFormSchema,
} from "@/schema/journal-entry.schema";
import { clearForm, fillFormInput } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { columns } from "./table/column";
import { useGetAllLedgerAccount } from "@/hooks/api/ledger-account.hook";
import { useGetAllInventoryType } from "@/hooks/api/inventory-type.hook";
import { MovementTypeEnum } from "@/enums/common.enum";

export default function JournalEntry() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [uuid, setUUID] = useState<string | null>("");
  const [assetTypeFields, setJournalEntryFields] = useState<IFormField[]>([
    { name: "description", label: "Description", type: "text" },
    { name: "entry_date", label: "Entry Date", type: "date" },
    { name: "amount", label: "Amount", type: "number" },
    {
      name: "movementType",
      label: "Movement Type",
      type: "select",
      options: Object.values(MovementTypeEnum).map((type) => ({
        label: type,
        value: type,
      })),
    },
  ]);

  const form = useForm<Partial<ICreateJournalEntry & IUpdateJournalEntry>>({
    resolver: zodResolver(
      isEditable ? updateJournalEntryFormSchema : createJournalEntryFormSchema
    ),
    defaultValues: {
      description: "",
      entry_date: undefined,
      amount: "",
      inventoryTypeUUID: "",
      ledgerAccountUUID: "",
      movementType: undefined,
    },
  });

  const { data: journalEntries } = useGetAllJournalEntry();
  const { data: journalEntry } = useGetOneJournalEntry(uuid || "");

  const { data: inventoryTypes, isLoading: isLoadingInventoryTypes } =
    useGetAllInventoryType();
  const { data: ledgerAccounts, isLoading: isLoadingLedgerAccounts } =
    useGetAllLedgerAccount();

  const { mutate: createJournalEntry } = useCreateJournalEntry(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: updateJournalEntry } = useUpdateJournalEntry(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: deleteJournalEntry } = useDeleteJournalEntry(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const handleDelete = (uuid: string) => {
    deleteJournalEntry(uuid);
  };

  const handleUpdate = (uuid: string) => {
    setIsEditable(true);
    setIsModalOpen(true);
    setUUID(uuid);
  };

  const modifyJournalEntry = (data: IUpdateJournalEntry) => {
    if (!uuid) return;
    updateJournalEntry({ uuid, data });
  };

  const handleSubmit = (data: ICreateJournalEntry | IUpdateJournalEntry) => {
    if (uuid) {
      modifyJournalEntry(data as IUpdateJournalEntry);
    } else {
      createJournalEntry(data as ICreateJournalEntry);
    }
  };

  useEffect(() => {
    if (
      isLoadingLedgerAccounts ||
      isLoadingInventoryTypes ||
      !ledgerAccounts ||
      !inventoryTypes
    )
      return;

    setJournalEntryFields((prev) => {
      if (!prev.find((field) => field.name === "inventoryTypeUUID")) {
        return [
          ...prev,
          {
            name: "inventoryTypeUUID",
            label: "Inventory Type",
            type: "select",
            options: inventoryTypes.map((inventoryType) => ({
              label: inventoryType.name,
              value: inventoryType.uuid,
            })),
          },
        ];
      }
      return prev;
    });

    setJournalEntryFields((prev) => {
      if (!prev.find((field) => field.name === "ledgerAccountUUID")) {
        return [
          ...prev,
          {
            name: "ledgerAccountUUID",
            label: "Ledger Account",
            type: "select",
            options: ledgerAccounts.map((ledgerAccount) => ({
              label: ledgerAccount.name,
              value: ledgerAccount.uuid,
            })),
          },
        ];
      }
      return prev;
    });
  }, [
    isLoadingLedgerAccounts,
    isLoadingInventoryTypes,
    ledgerAccounts,
    inventoryTypes,
  ]);

  useEffect(() => {
    if (!journalEntry) return;

    if (isEditable && isModalOpen) {
      fillFormInput(form, [
        { property: "description", value: journalEntry.description },
        { property: "entry_date", value: new Date(journalEntry.entry_date) },
        { property: "amount", value: journalEntry.amount.toString() },
        {
          property: "inventoryTypeUUID",
          value: journalEntry.inventoryType.uuid,
        },
        {
          property: "ledgerAccountUUID",
          value: journalEntry.ledgerAccount.uuid,
        },
        { property: "movementType", value: journalEntry.movement_type },
      ]);
    }

    if (!isEditable || !isModalOpen) {
      clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
    }
  }, [journalEntry, isEditable, isModalOpen]);

  return (
    <div className="mx-auto w-full overflow-x-auto">
      <button
        className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Create
      </button>
      <DataTable
        data={journalEntries || []}
        columns={columns({ handleUpdate, handleDelete })}
        definitions={commonStatusTableDefinitions}
      />

      <CreateUpdateForm<ICreateJournalEntry | IUpdateJournalEntry>
        title={`${isEditable ? "Update" : "Create"} Journal Entry`}
        fields={assetTypeFields}
        form={form}
        onSubmit={handleSubmit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
