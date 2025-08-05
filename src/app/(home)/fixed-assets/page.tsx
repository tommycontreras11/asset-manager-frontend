"use client";

import {
  CreateUpdateForm,
  IFormField,
} from "@/components/common/modal/create-update";
import DataTable from "@/components/common/table/data-table";
import { commonStatusTableDefinitions } from "@/definitions/common.definition";
import { useGetAllAssetType } from "@/hooks/api/asset-type.hook";
import { useGetAllDepartment } from "@/hooks/api/department.hook";
import { useGetAllEmployee } from "@/hooks/api/employee.hook";
import {
  useGetAllFixedAsset,
  useGetOneFixedAsset,
} from "@/hooks/api/fixed-asset.hook";
import {
  useCreateFixedAsset,
  useDeleteFixedAsset,
  useUpdateFixedAsset,
} from "@/mutations/api/fixed-assets";
import {
  ICreateFixedAsset,
  IUpdateFixedAsset,
} from "@/providers/http/fixed-assets/interface";
import {
  createFixedAssetFormSchema,
  updateFixedAssetFormSchema,
} from "@/schema/fixed-asset.schema";
import { clearForm, fillFormInput } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { columns } from "./table/column";

export default function FixedAsset() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [uuid, setUUID] = useState<string | null>("");
  const [fixedAssetFields, setFixedAssetFields] = useState<IFormField[]>([
    { name: "name", label: "Name", type: "text" },
    { name: "purchase_value", label: "Purchase Value", type: "number" },
    { name: "accumulated_depreciation", label: "Accumulated Depreciation", type: "number" },
  ]);

  const form = useForm<Partial<ICreateFixedAsset | IUpdateFixedAsset>>({
    resolver: zodResolver(
      isEditable ? updateFixedAssetFormSchema : createFixedAssetFormSchema
    ),
    defaultValues: {
      name: "",
      purchase_value: "",
      accumulated_depreciation: "",
      departmentUUID: "",
      assetTypeUUID: "",
      employeeUUID: "",
    },
  });

  const { data: fixedAssets } = useGetAllFixedAsset();
  const { data: fixedAsset } = useGetOneFixedAsset(uuid || "");
  const { data: departments, isLoading: isLoadingDepartments } = useGetAllDepartment()
  const { data: assetTypes, isLoading: isLoadingAssetTypes } = useGetAllAssetType()
  const { data: employees, isLoading: isLoadingEmployees } = useGetAllEmployee()

  const { mutate: createFixedAsset } = useCreateFixedAsset(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: updateFixedAsset } = useUpdateFixedAsset(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: deleteFixedAsset } = useDeleteFixedAsset(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const handleDelete = (uuid: string) => {
    deleteFixedAsset(uuid);
  };

  const handleUpdate = (uuid: string) => {
    setIsEditable(true);
    setIsModalOpen(true);
    setUUID(uuid);
  };

  const modifyFixedAsset = (data: IUpdateFixedAsset) => {
    if (!uuid) return;
    updateFixedAsset({ uuid, data });
  };

  const handleSubmit = (data: ICreateFixedAsset | IUpdateFixedAsset) => {
    if (uuid) {
      modifyFixedAsset(data as IUpdateFixedAsset);
    } else {
      createFixedAsset(data as ICreateFixedAsset);
    }
  };

  useEffect(() => {
    if(!departments || !assetTypes || !employees || isLoadingDepartments || isLoadingAssetTypes || isLoadingEmployees) return;

    setFixedAssetFields((prev) => {
      if(!prev.find((field) => field.name === "departmentUUID")) {
        return [
          ...prev,
          {
            name: "departmentUUID",
            label: "Department",
            type: "select",
            options: departments.map((department) => ({
              label: department.name,
              value: department.uuid,
            })),
          }
        ]
      }
      return prev
    })

    setFixedAssetFields((prev) => {
      if(!prev.find((field) => field.name === "assetTypeUUID")) {
        return [
          ...prev,
          {
            name: "assetTypeUUID",
            label: "Asset Type",
            type: "select",
            options: assetTypes.map((assetType) => ({
              label: assetType.name,
              value: assetType.uuid,
            })),
          }
        ]
      }
      return prev
    })

    setFixedAssetFields((prev) => {
      if(!prev.find((field) => field.name === "employeeUUID")) {
        return [
          ...prev,
          {
            name: "employeeUUID",
            label: "Employee",
            type: "select",
            options: employees.map((employee) => ({
              label: employee.name,
              value: employee.uuid,
            })),
          }
        ]
      }
      return prev
    })

  }, [isLoadingDepartments, isLoadingAssetTypes, isLoadingEmployees]);

  useEffect(() => {
    if (!fixedAsset) return;

    if (isEditable && isModalOpen) {
      fillFormInput(form, [
        { property: "name", value: fixedAsset.name },
        { property: "purchase_value", value: fixedAsset.purchase_value },
        { property: "accumulated_depreciation", value: fixedAsset.accumulated_depreciation },
        { property: "departmentUUID", value: fixedAsset.department.uuid },
        { property: "assetTypeUUID", value: fixedAsset.assetType.uuid },
        { property: "employeeUUID", value: fixedAsset.employee.uuid },
      ]);
    }

    if (!isEditable || !isModalOpen) {
      clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
    }
  }, [fixedAsset, isEditable, isModalOpen]);

  return (
    <div className="mx-auto w-full overflow-x-auto">
      <button
        className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Create
      </button>
      <DataTable
        data={fixedAssets || []}
        columns={columns({ handleUpdate, handleDelete })}
        definitions={commonStatusTableDefinitions}
      />

      <CreateUpdateForm<ICreateFixedAsset | IUpdateFixedAsset>
        title={`${isEditable ? "Update" : "Create"} Fixed Asset`}
        fields={fixedAssetFields}
        form={form}
        onSubmit={handleSubmit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
