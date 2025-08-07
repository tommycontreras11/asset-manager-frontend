"use client";

import {
  CreateUpdateForm,
  IFormField,
} from "@/components/common/modal/create-update";
import DataTable from "@/components/common/table/data-table";
import { commonStatusTableDefinitions } from "@/definitions/common.definition";
import {
  useGetAllDepreciationCalculation,
  useGetOneDepreciationCalculation,
} from "@/hooks/api/depreciation-calculation.hook";
import { useGetAllFixedAsset } from "@/hooks/api/fixed-asset.hook";
import {
  useCreateDepreciationCalculation,
  useDeleteDepreciationCalculation,
  useUpdateDepreciationCalculation,
} from "@/mutations/api/depreciation-calculations";
import {
  ICreateDepreciationCalculation,
  IUpdateDepreciationCalculation,
} from "@/providers/http/depreciation-calculations/interface";
import {
  createDepreciationCalculationFormSchema,
  updateDepreciationCalculationFormSchema,
} from "@/schema/depreciation-calculation.schema";
import { clearForm, fillFormInput } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { columns } from "./table/column";

export default function DepreciationCalculation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [uuid, setUUID] = useState<string | null>("");
  const [assetTypeFields, setDepreciationCalculationFields] = useState<IFormField[]>([
    { name: "process_date", label: "Process Date", type: "date" },
  ]);

  const form = useForm<Partial<ICreateDepreciationCalculation & IUpdateDepreciationCalculation>>({
    resolver: zodResolver(
      isEditable ? updateDepreciationCalculationFormSchema : createDepreciationCalculationFormSchema
    ),
    defaultValues: {
      process_date: undefined,
      fixedAssetUUID: "",
    },
  });

  const { data: depreciationCalculations } = useGetAllDepreciationCalculation();
  const { data: depreciationCalculation } = useGetOneDepreciationCalculation(uuid || "");

  const { data: fixedAssets, isLoading: isLoadingFixedAssets } =
    useGetAllFixedAsset();

  const { mutate: createDepreciationCalculation } = useCreateDepreciationCalculation(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: updateDepreciationCalculation } = useUpdateDepreciationCalculation(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: deleteDepreciationCalculation } = useDeleteDepreciationCalculation(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const handleDelete = (uuid: string) => {
    deleteDepreciationCalculation(uuid);
  };

  const handleUpdate = (uuid: string) => {
    setIsEditable(true);
    setIsModalOpen(true);
    setUUID(uuid);
  };

  const modifyDepreciationCalculation = (data: IUpdateDepreciationCalculation) => {
    if (!uuid) return;
    updateDepreciationCalculation({ uuid, data });
  };

  const handleSubmit = (data: ICreateDepreciationCalculation | IUpdateDepreciationCalculation) => {
    if (uuid) {
      modifyDepreciationCalculation(data as IUpdateDepreciationCalculation);
    } else {
      createDepreciationCalculation(data as ICreateDepreciationCalculation);
    }
  };

  useEffect(() => {
    if (
      isLoadingFixedAssets ||
      !fixedAssets
    )
      return;

    setDepreciationCalculationFields((prev) => {
      if (!prev.find((field) => field.name === "fixedAssetUUID")) {
        return [
          ...prev,
          {
            name: "fixedAssetUUID",
            label: "Fixed Asset",
            type: "select",
            options: fixedAssets.map((fixedAsset) => ({
              label: fixedAsset.name,
              value: fixedAsset.uuid,
            })),
          },
        ];
      }
      return prev;
    });
  }, [
    isLoadingFixedAssets,
    fixedAssets,
  ]);

  useEffect(() => {
    if (!depreciationCalculation) return;

    if (isEditable && isModalOpen) {
      fillFormInput(form, [
        { property: "process_date", value: new Date(depreciationCalculation.process_date) },
        { property: "fixedAssetUUID", value: depreciationCalculation.fixedAsset.uuid },
      ]);
    }

    if (!isEditable || !isModalOpen) {
      clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
    }
  }, [depreciationCalculation, isEditable, isModalOpen]);

  return (
    <div className="mx-auto w-full overflow-x-auto">
      <button
        className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Create
      </button>
      <DataTable
        data={depreciationCalculations || []}
        columns={columns({ handleUpdate, handleDelete })}
        definitions={commonStatusTableDefinitions}
      />

      <CreateUpdateForm<ICreateDepreciationCalculation | IUpdateDepreciationCalculation>
        title={`${isEditable ? "Update" : "Create"} Depreciation Calculation`}
        fields={assetTypeFields}
        form={form}
        onSubmit={handleSubmit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
