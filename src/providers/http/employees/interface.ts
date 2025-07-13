import { PersonTypeEnum, StatusEnum } from "@/enums/common.enum";
import { IPerson } from "../users/interface";
import { IDepartment } from "../departments/interface";

export interface IEmployee extends IPerson {
  uuid: string;
  department: IDepartment;
  personType: PersonTypeEnum;
  status: StatusEnum;
}

export interface ICreateEmployee
  extends Partial<Omit<IEmployee, "uuid" | "personType" | "status">> {
  personType: string;
  departmentUUID: string;
}

export interface IUpdateEmployee extends Partial<ICreateEmployee> {}
