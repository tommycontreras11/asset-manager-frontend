import { StatusEnum } from "@/enums/common.enum";

export interface IPerson {
  identification: string;
  name: string;
  email: string;
  password: string;
}

export interface IUser extends IPerson {
  uuid: string;
  status: StatusEnum;
}

export interface ICreateUser
  extends Partial<Omit<IUser, "uuid" | "status">> { }

export interface IUpdateUser extends Partial<ICreateUser> {}
