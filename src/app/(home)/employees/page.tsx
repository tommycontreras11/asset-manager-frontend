"use client";

import {
  CreateUpdateForm,
  IFormField,
} from "@/components/common/modal/create-update";
import DataTable from "@/components/common/table/data-table";
import { commonStatusTableDefinitions } from "@/definitions/common.definition";
import {
  useGetAllEmployee,
  useGetOneEmployee,
} from "@/hooks/api/employee.hook";
import {
  useCreateEmployee,
  useDeleteEmployee,
  useUpdateEmployee,
} from "@/mutations/api/employees";
import {
  ICreateEmployee,
  IUpdateEmployee,
} from "@/providers/http/employees/interface";
import {
  createEmployeeFormSchema,
  updateEmployeeFormSchema,
} from "@/schema/employee.schema";
import { clearForm, fillFormInput } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { columns } from "./table/column";
import { PersonTypeEnum } from "@/enums/common.enum";
import { useGetAllDepartment } from "@/hooks/api/department.hook";

export default function Employee() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [uuid, setUUID] = useState<string | null>("");
  const [employeeFields, setEmployeeFields] = useState<IFormField[]>([
    { name: "identification", label: "Identification", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "name", label: "Name", type: "text" },
    { name: "password", label: "Password", type: "password" },
    {
      name: "personType",
      label: "Person Type",
      type: "select",
      options: Object.values(PersonTypeEnum).map((type) => ({
        label: type,
        value: type,
      })),
    },
  ]);

  const form = useForm<ICreateEmployee | IUpdateEmployee>({
    resolver: zodResolver(
      isEditable ? updateEmployeeFormSchema : createEmployeeFormSchema
    ),
    defaultValues: {
      identification: "",
      email: "",
      name: "",
      password: "",
      personType: undefined,
      departmentUUID: undefined,
    },
  });

  const { data: employees } = useGetAllEmployee();
  const { data: employee } = useGetOneEmployee(uuid || "");

  const { data: departments, isLoading: isLoadingDepartments } =
    useGetAllDepartment();

  const { mutate: createEmployee } = useCreateEmployee(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: updateEmployee } = useUpdateEmployee(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: deleteEmployee } = useDeleteEmployee(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const handleDelete = (uuid: string) => {
    deleteEmployee(uuid);
  };

  const handleUpdate = (uuid: string) => {
    setIsEditable(true);
    setIsModalOpen(true);
    setUUID(uuid);
  };

  const modifyEmployee = (data: IUpdateEmployee) => {
    if (!uuid) return;
    updateEmployee({ uuid, data });
  };

  const handleSubmit = (data: ICreateEmployee | IUpdateEmployee) => {
    if (uuid) {
      modifyEmployee(data);
    } else {
      createEmployee(data as ICreateEmployee);
    }
  };

  useEffect(() => {
    if (!departments || isLoadingDepartments) return;

    setEmployeeFields((prev) => {
      if (!prev.find((field) => field.name === "departmentUUID")) {
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
          },
        ];
      }

      return prev;
    });
  }, [departments, isLoadingDepartments]);

  useEffect(() => {
    if (!employee) return;

    if (isEditable && isModalOpen) {
      fillFormInput(form, [
        {
          property: "identification",
          value: employee.identification,
        },
        {
          property: "email",
          value: employee.email,
        },
        {
          property: "name",
          value: employee.name,
        },
        {
          property: "password",
          value: employee.password,
        },
        {
          property: "personType",
          value: employee.personType,
        },
        {
          property: "departmentUUID",
          value: employee.department.uuid,
        },
      ]);
    }

    if (!isEditable || !isModalOpen) {
      clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
    }
  }, [employee, isEditable, isModalOpen]);

  return (
    <div className="mx-auto w-full overflow-x-auto">
      <button
        className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Create
      </button>
      <DataTable
        data={employees || []}
        columns={columns({ handleUpdate, handleDelete })}
        definitions={commonStatusTableDefinitions}
      />

      <CreateUpdateForm<ICreateEmployee | IUpdateEmployee>
        title={`${isEditable ? "Update" : "Create"} Employee`}
        fields={employeeFields}
        form={form}
        onSubmit={handleSubmit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
