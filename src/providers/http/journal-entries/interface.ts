import { MovementTypeEnum, StatusEnum } from "@/enums/common.enum";
import { IAssetType } from "../asset-types/interface";
import { IDepartment } from "../departments/interface";

export interface IJournalEntry {
  uuid: string;
  description: string;
  journal_id?: string;
  entry_date: Date
  amount: string;
  inventoryType: IDepartment;
  ledgerAccount: IAssetType;
  movement_type: MovementTypeEnum;
  status: StatusEnum;
}

export interface ICreateJournalEntry
  extends Partial<
    Omit<
      IJournalEntry,
      | "uuid"
      | "description"
      | "journal_id"
      | "inventoryType"
      | "ledgerAccount"
      | "movementType"
      | "status"
    >
  > {
    inventoryTypeUUID: string
    ledgerAccountUUID: string
    movementType: string
}

export interface IUpdateJournalEntry extends Partial<ICreateJournalEntry> {}
