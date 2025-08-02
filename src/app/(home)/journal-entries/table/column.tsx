"use client";

import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";

import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import { DataTableRowActions } from "@/components/common/table/data-table-row-actions";
import {
  commonStatusTableDefinitions,
  movementTypeStatusTableDefinitions,
} from "@/definitions/common.definition";
import { MovementTypeEnum, StatusEnum } from "@/enums/common.enum";
import { IJournalEntry } from "@/providers/http/journal-entries/interface";

// Pass `handleUpdate` and `handleDelete` as props to columns
export const columns = ({
  handleUpdate,
  handleDelete,
}: {
  handleUpdate: (uuid: string) => void;
  handleDelete: (uuid: string) => void;
}): ColumnDef<IJournalEntry>[] => [
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Description"} />
    ),
    cell: ({ row }) => {
      return <div>{`${(row.getValue("description") as string).slice(0, 40)}...`}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Amount"} />
    ),
    cell: ({ row }) => {
      return <div>{`${row.getValue("amount")} $`}</div>;
    },
  },
  {
    accessorKey: "inventoryType.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Inventory Type"} />
    ),
  },
  {
    accessorKey: "ledgerAccount.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Ledger Account"} />
    ),
  },
  {
    accessorKey: "movement_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Movement Type"} />
    ),
    cell: ({ row }) => {
      const status = movementTypeStatusTableDefinitions.find(
        (movementType) => movementType.value === row.getValue("movement_type")
      );
      if (!status) {
        return null;
      }
      return (
        <div
          className={clsx("flex w-[100px] items-center", {
            "text-red-500": status.value === MovementTypeEnum.CREDIT,
            "text-green-500": status.value === MovementTypeEnum.DEBIT,
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
