"use client";

import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";

import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import { DataTableRowActions } from "@/components/common/table/data-table-row-actions";
import {
    commonStatusTableDefinitions,
    personTypeStatusTableDefinitions
} from "@/definitions/common.definition";
import { PersonTypeEnum, StatusEnum } from "@/enums/common.enum";
import { IUser } from "@/providers/http/users/interface";

// Pass `handleUpdate` and `handleDelete` as props to columns
export const columns = ({
  handleUpdate,
  handleDelete,
}: {
  handleUpdate: (uuid: string) => void;
  handleDelete: (uuid: string) => void;
}): ColumnDef<IUser>[] => [
  {
    accessorKey: "identification",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Identification"} />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue("identification")}</div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Email"} />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Name"} />
    ),
  },
  {
    accessorKey: "password",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Password"} />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{`********`}</div>;
    },
  },
  {
    accessorKey: "department.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Department"} />
    ),
  },
  {
    accessorKey: "personType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Person Type"} />
    ),
    cell: ({ row }) => {
      const status = personTypeStatusTableDefinitions.find(
        (personType) => personType.value === row.getValue("personType")
      );
      if (!status) {
        return null;
      }
      return (
        <div
          className={clsx("flex w-[100px] items-center", {
            "text-gray-500": status.value === PersonTypeEnum.INDIVIDUAL,
            "text-yellow-500": status.value === PersonTypeEnum.JURIDIC,
          })}
        >
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Status"} />
    ),
    cell: ({ row }) => {
      const status = commonStatusTableDefinitions.find(
        (status) => status.value === row.getValue("status")
      );
      if (!status) {
        return null;
      }
      return (
        <div
          className={clsx("flex w-[100px] items-center", {
            "text-red-500": status.value === StatusEnum.INACTIVE,
            "text-green-500": status.value === StatusEnum.ACTIVE,
          })}
        >
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onEdit={handleUpdate}
        onDelete={handleDelete}
      />
    ),
  },
];
