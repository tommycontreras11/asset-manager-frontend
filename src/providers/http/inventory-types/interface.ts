import { StatusEnum } from "@/enums/common.enum";

export interface IInventoryType {
  uuid: string;
  name: string;
  description: string;
  status: StatusEnum;
}

export interface ICreateInventoryType
  extends Partial<Omit<IInventoryType, "uuid" | "status">> { }

export interface IUpdateInventoryType extends Partial<ICreateInventoryType> {}
