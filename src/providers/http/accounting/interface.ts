import { MovementTypeEnum } from "@/enums/common.enum";

export interface ICreateAccounting {
  uuid: string;
  description: string;
  amount: string;
  entry_date: Date;
  ledgerAccountUUID: string;
  movementType: MovementTypeEnum;
}

export interface ICreateAccountingList {
  accounting: ICreateAccounting[];
}