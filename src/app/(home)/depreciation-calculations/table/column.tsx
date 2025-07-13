"use client";

import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";

import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import { DataTableRowActions } from "@/components/common/table/data-table-row-actions";
import { commonStatusTableDefinitions } from "@/definitions/common.definition";
import { StatusEnum } from "@/enums/common.enum";
import { IDepreciationCalculation } from "@/providers/http/depreciation-calculations/interface";

// Pass `handleUpdate` and `handleDelete` as props to columns
export const columns = ({
  handleUpdate,
  handleDelete,
}: {
  handleUpdate: (uuid: string) => void;
  handleDelete: (uuid: string) => void;
}): ColumnDef<IDepreciationCalculation>[] => [
  {
    accessorKey: "process_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Process Date"} />
    ),
  },
  {
    accessorKey: "depreciation_amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Depreciation Amount"} />
    ),
    cell: ({ row }) => {
      return <div>{`${row.getValue("depreciation_amount")} $`}</div>;
    },
  },
  {
    accessorKey: "accumulated_depreciation",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Accumulated Depreciation"}
      />
    ),
    cell: ({ row }) => {
      return <div>{`${row.getValue("accumulated_depreciation")} $`}</div>;
    },
  },
  {
    accessorKey: "fixedAsset.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Fixed Asset"} />
    ),
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
