"use client";

import {
    CreateUpdateForm,
    IFormField,
} from "@/components/common/modal/create-update";
import DataTable from "@/components/common/table/data-table";
import { commonStatusTableDefinitions } from "@/definitions/common.definition";
import {
    useGetAllUser,
    useGetOneUser,
} from "@/hooks/api/user.hook";
import {
    useCreateUser,
    useDeleteUser,
    useUpdateUser,
} from "@/mutations/api/users";
import {
    ICreateUser,
    IUpdateUser,
} from "@/providers/http/users/interface";
import {
    createUserFormSchema,
    updateUserFormSchema,
} from "@/schema/user.schema";
import { clearForm, fillFormInput } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { columns } from "./table/column";

export default function User() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [uuid, setUUID] = useState<string | null>("");
  const [userFields, setUserFields] = useState<IFormField[]>([
    { name: "identification", label: "Identification", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "name", label: "Name", type: "text" },
    { name: "password", label: "Password", type: "password" },
  ]);

  const form = useForm<ICreateUser | IUpdateUser>({
    resolver: zodResolver(
      isEditable ? updateUserFormSchema : createUserFormSchema
    ),
    defaultValues: {
      identification: "",
      email: "",
      name: "",
      password: "",
    },
  });

  const { data: users } = useGetAllUser();
  const { data: user } = useGetOneUser(uuid || "");

  const { mutate: createUser } = useCreateUser(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: updateUser } = useUpdateUser(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const { mutate: deleteUser } = useDeleteUser(() => {
    clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
  });

  const handleDelete = (uuid: string) => {
    deleteUser(uuid);
  };

  const handleUpdate = (uuid: string) => {
    setIsEditable(true);
    setIsModalOpen(true);
    setUUID(uuid);
  };

  const modifyUser = (data: IUpdateUser) => {
    if (!uuid) return;
    updateUser({ uuid, data });
  };

  const handleSubmit = (data: ICreateUser | IUpdateUser) => {
    if (uuid) {
      modifyUser(data);
    } else {
      createUser(data);
    }
  };

  useEffect(() => {
    if (!user) return;

    if (isEditable && isModalOpen) {
      fillFormInput(form, [
        {
          property: "identification",
          value: user.identification,
        },
        {
          property: "email",
          value: user.email,
        },
        {
          property: "name",
          value: user.name,
        },
        {
          property: "password",
          value: user.password,
        },
      ]);
    }

    if (!isEditable || !isModalOpen) {
      clearForm(form, true, setIsModalOpen, setIsEditable, setUUID);
    }
  }, [user, isEditable, isModalOpen]);

  return (
    <div className="mx-auto w-full overflow-x-auto">
      <button
        className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Create
      </button>
      <DataTable
        data={users || []}
        columns={columns({ handleUpdate, handleDelete })}
        definitions={commonStatusTableDefinitions}
      />

      <CreateUpdateForm<ICreateUser | IUpdateUser>
        title={`${isEditable ? 'Update' : 'Create'} User`}
        fields={userFields}
        form={form}
        onSubmit={handleSubmit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
