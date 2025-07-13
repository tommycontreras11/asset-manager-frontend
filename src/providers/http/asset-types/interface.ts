import { StatusEnum } from "@/enums/common.enum";
import { ILedgerAccount } from "../ledger-accounts/interface";

export interface IAssetType {
  uuid: string;
  name: string;
  purchaseAccount: ILedgerAccount;
  depreciationAccount: ILedgerAccount;
  status: StatusEnum;
}

export interface ICreateAssetType {
  name: string;
  purchaseAccountUUID: string;
  depreciationAccountUUID: string;
}

export interface IUpdateAssetType extends Partial<ICreateAssetType> {}
