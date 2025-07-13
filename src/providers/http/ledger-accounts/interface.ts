import { StatusEnum } from "@/enums/common.enum";

export interface ILedgerAccount {
  uuid: string;
  code: string;
  name: string;
  type: string;
  status: StatusEnum;
}

export interface ICreateLedgerAccount
  extends Partial<Omit<ILedgerAccount, "uuid" | "status">> {}

export interface IUpdateLedgerAccount extends Partial<ICreateLedgerAccount> {}
