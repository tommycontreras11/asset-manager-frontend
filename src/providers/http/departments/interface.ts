import { StatusEnum } from "@/enums/common.enum";

export interface IDepartment {
  uuid: string;
  name: string;
  description: string;
  status: StatusEnum;
}

export interface ICreateDepartment
  extends Partial<Omit<IDepartment, "uuid" | "status">> {
  description?: string;
}

export interface IUpdateDepartment extends Partial<ICreateDepartment> {}
