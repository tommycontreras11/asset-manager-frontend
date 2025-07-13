"use client";

import {
  CreateUpdateForm,
  IFormField,
} from "@/components/common/modal/create-update";
import DataTable from "@/components/common/table/data-table";
import { commonStatusTableDefinitions } from "@/definitions/common.definition";
import {
  useGetAllAssetType,
  useGetOneAssetType,
} from "@/hooks/api/asset-type.hook";
import {
  useCreateAssetType,
  useDeleteAssetType,
  useUpdateAssetType,
} from "@/mutations/api/asset-types";
import {
  ICreateAssetType,
  IUpdateAssetType,
} from "@/providers/http/asset-types/interface";
import {
  createAssetTypeFormSchema,
  updateAssetTypeFormSchema,
} from "@/schema/asset-type.schema";
import { clearForm, fillFormInput } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { columns } from "./table/column";
import { useGetAllLedgerAccount } from "@/hooks/api/ledger-account.hook";

export default function AssetType() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [uuid, setUUID] = useState<string | null>("");
  const [assetTypeFields, setAssetTypeFields] = useState<IFormField[]>([
    { name: "name", label: "Name", type: "text" },
  ]);

  const form = useForm<Partial<ICreateAssetType>>({
    resolver: zodResolver(
      isEditable ? updateAssetTypeFormSchema : createAssetTypeFormSchema
    ),
    defaultValues: {
      name: "",
      purchaseAccountUUID: "",
      depreciationAccountUUID: "",
    },
  });

  const { data: assetTypes } = useGetAllAssetType();
  const { data: assetType } = useGetOneAssetType(uuid || "");
  const { data: ledgerAccounts, isLoading: isLoadingLedgerAccounts } = useGetAllLedgerAccount()

  const { mutate: createAssetType } = useCreateAssetType(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: updateAssetType } = useUpdateAssetType(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: deleteAssetType } = useDeleteAssetType(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const handleDelete = (uuid: string) => {
    deleteAssetType(uuid);
  };

  const handleUpdate = (uuid: string) => {
    setIsEditable(true);
    setIsModalOpen(true);
    setUUID(uuid);
  };

  const modifyAssetType = (data: IUpdateAssetType) => {
    if (!uuid) return;
    updateAssetType({ uuid, data });
  };

  const handleSubmit = (data: ICreateAssetType | IUpdateAssetType) => {
    if (uuid) {
      modifyAssetType(data as IUpdateAssetType);
    } else {
      createAssetType(data as ICreateAssetType);
    }
  };

  useEffect(() => {
    if(!ledgerAccounts || isLoadingLedgerAccounts) return;

    setAssetTypeFields((prev) => {
      if(!prev.find((field) => field.name === "purchaseAccountUUID")) {
        return [
          ...prev,
          {
            name: "purchaseAccountUUID",
            label: "Purchase Account",
            type: "select",
            options: ledgerAccounts.map((ledgerAccount) => ({
              label: ledgerAccount.name,
              value: ledgerAccount.uuid,
            })),
          }
        ]
      }
      return prev
    })
    setAssetTypeFields((prev) => {
      if(!prev.find((field) => field.name === "purchaseAccountUUID")) {
        return [
          ...prev,
          {
            name: "purchaseAccountUUID",
            label: "Purchase Account",
            type: "select",
            options: ledgerAccounts.map((ledgerAccount) => ({
              label: ledgerAccount.name,
              value: ledgerAccount.uuid,
            })),
          }
        ]
      }
      return prev
    })

    setAssetTypeFields((prev) => {
      if(!prev.find((field) => field.name === "depreciationAccountUUID")) {
        return [
          ...prev,
          {
            name: "depreciationAccountUUID",
            label: "Depreciation Account",
            type: "select",
            options: ledgerAccounts.map((ledgerAccount) => ({
              label: ledgerAccount.name,
              value: ledgerAccount.uuid,
            })),
          }
        ]
      }
      return prev
    })

  }, [ledgerAccounts, isLoadingLedgerAccounts]);

  useEffect(() => {
    if (!assetType) return;

    if (isEditable && isModalOpen) {
      fillFormInput(form, [
        { property: "name", value: assetType.name },
        { property: "purchaseAccountUUID", value: assetType.purchaseAccount.uuid },
        { property: "depreciationAccountUUID", value: assetType.depreciationAccount.uuid },
      ]);
    }

    if (!isEditable || !isModalOpen) {
      clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
    }
  }, [assetType, isEditable, isModalOpen]);

  return (
    <div className="mx-auto w-full overflow-x-auto">
      <button
        className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Create
      </button>
      <DataTable
        data={assetTypes || []}
        columns={columns({ handleUpdate, handleDelete })}
        definitions={commonStatusTableDefinitions}
      />

      <CreateUpdateForm<ICreateAssetType | IUpdateAssetType>
        title={`${isEditable ? "Update" : "Create"} Asset Type`}
        fields={assetTypeFields}
        form={form}
        onSubmit={handleSubmit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
