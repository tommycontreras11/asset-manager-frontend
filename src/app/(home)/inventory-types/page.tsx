"use client";

import {
  CreateUpdateForm,
  IFormField,
} from "@/components/common/modal/create-update";
import DataTable from "@/components/common/table/data-table";
import { commonStatusTableDefinitions } from "@/definitions/common.definition";
import {
  useGetAllInventoryType,
  useGetOneInventoryType,
} from "@/hooks/api/inventory-type.hook";
import {
  useCreateInventoryType,
  useDeleteInventoryType,
  useUpdateInventoryType,
} from "@/mutations/api/inventory-types";
import {
  ICreateInventoryType,
  IUpdateInventoryType,
} from "@/providers/http/inventory-types/interface";
import {
  createInventoryTypeFormSchema,
  updateInventoryTypeFormSchema,
} from "@/schema/inventory-type.schema";
import { clearForm, fillFormInput } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { columns } from "./table/column";

export default function InventoryType() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [uuid, setUUID] = useState<string | null>("");
  const [departmentFields, setInventoryTypeFields] = useState<IFormField[]>([
    { name: "name", label: "Name", type: "text" },
    { name: "description", label: "Description", type: "text" },
  ]);

  const form = useForm<ICreateInventoryType, IUpdateInventoryType>({
    resolver: zodResolver(
      isEditable ? updateInventoryTypeFormSchema : createInventoryTypeFormSchema
    ),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { data: inventoryTypes } = useGetAllInventoryType();
  const { data: inventoryType } = useGetOneInventoryType(uuid || "");

  const { mutate: createInventoryType } = useCreateInventoryType(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: updateInventoryType } = useUpdateInventoryType(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: deleteInventoryType } = useDeleteInventoryType(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const handleDelete = (uuid: string) => {
    deleteInventoryType(uuid);
  };

  const handleUpdate = (uuid: string) => {
    setIsEditable(true);
    setIsModalOpen(true);
    setUUID(uuid);
  };

  const modifyInventoryType = (data: IUpdateInventoryType) => {
    if (!uuid) return;
    updateInventoryType({ uuid, data });
  };

  const handleSubmit = (data: ICreateInventoryType | IUpdateInventoryType) => {
    if (uuid) {
      modifyInventoryType(data);
    } else {
      createInventoryType(data);
    }
  };

  useEffect(() => {
    if (!inventoryType) return;

    if (isEditable && isModalOpen) {
      fillFormInput(form, [
        { property: "name", value: inventoryType.name }, 
        { property: "description", value: inventoryType?.description || "" },
      ]);
    }

    if (!isEditable || !isModalOpen) {
      clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
    }
  }, [inventoryType, isEditable, isModalOpen]);

  return (
    <div className="mx-auto w-full overflow-x-auto">
      <button
        className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Create
      </button>
      <DataTable
        data={inventoryTypes || []}
        columns={columns({ handleUpdate, handleDelete })}
        definitions={commonStatusTableDefinitions}
      />

      <CreateUpdateForm<ICreateInventoryType | IUpdateInventoryType>
        title={`${isEditable ? 'Update' : 'Create'} Inventory type`}
        fields={departmentFields}
        form={form}
        onSubmit={handleSubmit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
