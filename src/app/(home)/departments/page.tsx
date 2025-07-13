"use client";

import {
  CreateUpdateForm,
  IFormField,
} from "@/components/common/modal/create-update";
import DataTable from "@/components/common/table/data-table";
import { commonStatusTableDefinitions } from "@/definitions/common.definition";
import {
  useGetAllDepartment,
  useGetOneDepartment,
} from "@/hooks/api/department.hook";
import {
  useCreateDepartment,
  useDeleteDepartment,
  useUpdateDepartment,
} from "@/mutations/api/departments";
import {
  ICreateDepartment,
  IUpdateDepartment,
} from "@/providers/http/departments/interface";
import {
  createDepartmentFormSchema,
  updateDepartmentFormSchema,
} from "@/schema/department.schema";
import { clearForm, fillFormInput } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { columns } from "./table/column";

export default function Department() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [uuid, setUUID] = useState<string | null>("");
  const [departmentFields, setDepartmentFields] = useState<IFormField[]>([
    { name: "name", label: "Name", type: "text" },
    { name: "description", label: "Description", type: "text" },
  ]);

  const form = useForm<ICreateDepartment, IUpdateDepartment>({
    resolver: zodResolver(
      isEditable ? updateDepartmentFormSchema : createDepartmentFormSchema
    ),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { data: departments } = useGetAllDepartment();
  const { data: department } = useGetOneDepartment(uuid || "");

  const { mutate: createDepartment } = useCreateDepartment(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: updateDepartment } = useUpdateDepartment(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: deleteDepartment } = useDeleteDepartment(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const handleDelete = (uuid: string) => {
    deleteDepartment(uuid);
  };

  const handleUpdate = (uuid: string) => {
    setIsEditable(true);
    setIsModalOpen(true);
    setUUID(uuid);
  };

  const modifyDepartment = (data: IUpdateDepartment) => {
    if (!uuid) return;
    updateDepartment({ uuid, data });
  };

  const handleSubmit = (data: ICreateDepartment | IUpdateDepartment) => {
    if (uuid) {
      modifyDepartment(data);
    } else {
      createDepartment(data);
    }
  };

  useEffect(() => {
    if (!department) return;

    if (isEditable && isModalOpen) {
      fillFormInput(form, [
        { property: "name", value: department.name }, 
        { property: "description", value: department?.description || "" },
      ]);
    }

    if (!isEditable || !isModalOpen) {
      clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
    }
  }, [department, isEditable, isModalOpen]);

  return (
    <div className="mx-auto w-full overflow-x-auto">
      <button
        className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Create
      </button>
      <DataTable
        data={departments || []}
        columns={columns({ handleUpdate, handleDelete })}
        definitions={commonStatusTableDefinitions}
      />

      <CreateUpdateForm<ICreateDepartment | IUpdateDepartment>
        title={`${isEditable ? 'Update' : 'Create'} Department`}
        fields={departmentFields}
        form={form}
        onSubmit={handleSubmit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
