"use client";

import {
  CreateUpdateForm,
  IFormField,
} from "@/components/common/modal/create-update";
import DataTable from "@/components/common/table/data-table";
import { commonStatusTableDefinitions } from "@/definitions/common.definition";
import { LedgerAccountTypeEnum, MovementTypeEnum } from "@/enums/common.enum";
import { useGetAllInventoryType } from "@/hooks/api/inventory-type.hook";
import {
  useGetAllJournalEntry,
  useGetOneJournalEntry,
} from "@/hooks/api/journal-entry.hook";
import { useGetAllLedgerAccount } from "@/hooks/api/ledger-account.hook";
import { useCreateAccounting } from "@/mutations/api/accounting";
import {
  useCreateJournalEntry,
  useDeleteJournalEntry,
  useUpdateJournalEntry,
} from "@/mutations/api/journal-entries";
import { ICreateAccountingList } from "@/providers/http/accounting/interface";
import {
  ICreateJournalEntry,
  IJournalEntry,
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
import { toast } from "sonner";

export default function JournalEntry() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [uuid, setUUID] = useState<string | null>("");
  const [filterDate, setFilterDate] = useState({
    from: "",
    to: "",
  });
  const [assetTypeFields, setJournalEntryFields] = useState<IFormField[]>([
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
      entry_date: undefined,
      amount: "",
      inventoryTypeUUID: "",
      ledgerAccountUUID: "",
      movementType: undefined,
    },
  });

  const { data: journalEntries } = useGetAllJournalEntry(
    filterDate.from,
    filterDate.to
  );
  const { data: journalEntry } = useGetOneJournalEntry(uuid || "");

  const { data: inventoryTypes, isLoading: isLoadingInventoryTypes } =
    useGetAllInventoryType();
  const { data: ledgerAccounts, isLoading: isLoadingLedgerAccounts } =
    useGetAllLedgerAccount();

  const { mutate: createJournalEntry } = useCreateJournalEntry(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: createAccounting } = useCreateAccounting(() => {});

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

  const sendToAccounting = (data: IJournalEntry[]) => {
    let formattedData: ICreateAccountingList = { accounting: [] };

    data.forEach((entry) => {
      formattedData.accounting.push({
        uuid: entry.uuid,
        description: entry.description,
        amount: entry.amount.toString(),
        entry_date: entry.entry_date,
        ledgerAccountUUID: entry.ledgerAccount.uuid,
        movementType: entry.movement_type as MovementTypeEnum,
      });
    });

    createAccounting(formattedData);
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
            options: ledgerAccounts
              .filter(
                (ledgerAccount) =>
                  ledgerAccount.type === LedgerAccountTypeEnum.GENERAL
              )
              .map((ledgerAccount) => ({
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
    <div className="w-full">
      {/* Top section: Create button */}
      <div className="mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-4 mb-6">
        {journalEntries && journalEntries.length > 0 ? (
          <>
            {/* Second row: Date range + Filter button */}
            {/* From Date */}
            <div className="flex flex-col">
              <label className="text-sm mb-1">From</label>
              <input
                type="date"
                value={filterDate.from?.split("T")[0] ?? ""}
                onChange={(e) =>
                  setFilterDate((prev) => ({
                    ...prev,
                    from: new Date(e.target.value).toISOString(),
                  }))
                }
                className="border border-gray-300 rounded px-3 py-1"
              />
            </div>
            {/* To Date */}
            <div className="flex flex-col">
              <label className="text-sm mb-1">To</label>
              <input
                type="date"
                value={filterDate.to?.split("T")[0] ?? ""}
                onChange={(e) =>
                  setFilterDate((prev) => ({
                    ...prev,
                    to: new Date(e.target.value).toISOString(),
                  }))
                }
                className="border border-gray-300 rounded px-3 py-1"
              />
            </div>
            {/* Filter Button */}
            <div className="flex flex-col items-end mt-auto">
              <button
                onClick={() => {
                  if(journalEntries.some((entry) => entry.journal_id !== null)) {
                    toast.error("Some journal entries have already been sent to accounting")
                    return;
                  }
                  sendToAccounting(journalEntries)
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
              >
                Send to Accounting
              </button>
            </div>{" "}
          </>
        ) : (
          <>
            {/* Remove Filter Button */}
            <div className="flex flex-col items-start mt-auto">
              <button
                onClick={() => setFilterDate({ from: "", to: "" })}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
              >
                Remove Filter
              </button>
            </div>
          </>
        )}
      </div>
      {/* Table and Modal */}
      <div className="w-full overflow-x-auto">
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
    </div>
  );
}
