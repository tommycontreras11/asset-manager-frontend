"use client";

import {
  CreateUpdateForm,
  IFormField,
} from "@/components/common/modal/create-update";
import DataTable from "@/components/common/table/data-table";
import { commonStatusTableDefinitions } from "@/definitions/common.definition";
import {
  useGetAllLedgerAccount,
  useGetOneLedgerAccount,
} from "@/hooks/api/ledger-account.hook";
import {
  useCreateLedgerAccount,
  useDeleteLedgerAccount,
  useUpdateLedgerAccount,
} from "@/mutations/api/ledger-accounts";
import {
  ICreateLedgerAccount,
  IUpdateLedgerAccount,
} from "@/providers/http/ledger-accounts/interface";
import {
  createLedgerAccountFormSchema,
  updateLedgerAccountFormSchema,
} from "@/schema/ledger-account.schema";
import { clearForm, fillFormInput } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { columns } from "./table/column";
import { LedgerAccountTypeEnum } from "@/enums/common.enum";

export default function LedgerAccount() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [uuid, setUUID] = useState<string | null>("");
  const [ledgerAccountFields, setLedgerAccountFields] = useState<IFormField[]>([
    { name: "code", label: "Code", type: "text" },
    { name: "name", label: "Name", type: "text" },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: Object.values(LedgerAccountTypeEnum).map((type) => ({
        label: type,
        value: type,
      })),
    },
  ]);

  const form = useForm<ICreateLedgerAccount, IUpdateLedgerAccount>({
    resolver: zodResolver(
      isEditable ? updateLedgerAccountFormSchema : createLedgerAccountFormSchema
    ),
    defaultValues: {
      code: "",
      name: "",
      type: "",
    },
  });

  const { data: ledgerAccounts } = useGetAllLedgerAccount();
  const { data: ledgerAccount } = useGetOneLedgerAccount(uuid || "");

  const { mutate: createLedgerAccount } = useCreateLedgerAccount(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: updateLedgerAccount } = useUpdateLedgerAccount(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: deleteLedgerAccount } = useDeleteLedgerAccount(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const handleDelete = (uuid: string) => {
    deleteLedgerAccount(uuid);
  };

  const handleUpdate = (uuid: string) => {
    setIsEditable(true);
    setIsModalOpen(true);
    setUUID(uuid);
  };

  const modifyLedgerAccount = (data: IUpdateLedgerAccount) => {
    if (!uuid) return;
    updateLedgerAccount({ uuid, data });
  };

  const handleSubmit = (data: ICreateLedgerAccount | IUpdateLedgerAccount) => {
    if (uuid) {
      modifyLedgerAccount(data);
    } else {
      createLedgerAccount(data);
    }
  };

  useEffect(() => {
    if (!ledgerAccount) return;

    if (isEditable && isModalOpen) {
      fillFormInput(form, [
        { property: "code", value: ledgerAccount.code },
        { property: "name", value: ledgerAccount.name },
        { property: "type", value: ledgerAccount.type },
      ]);
    }

    if (!isEditable || !isModalOpen) {
      clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
    }
  }, [ledgerAccount, isEditable, isModalOpen]);

  return (
    <div className="mx-auto w-full overflow-x-auto">
      <button
        className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Create
      </button>
      <DataTable
        data={ledgerAccounts || []}
        columns={columns({ handleUpdate, handleDelete })}
        definitions={commonStatusTableDefinitions}
      />

      <CreateUpdateForm<ICreateLedgerAccount | IUpdateLedgerAccount>
        title={`${isEditable ? "Update" : "Create"} Ledger Account`}
        fields={ledgerAccountFields}
        form={form}
        onSubmit={handleSubmit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
