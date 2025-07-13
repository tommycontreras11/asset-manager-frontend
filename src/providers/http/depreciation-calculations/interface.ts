import { StatusEnum } from "@/enums/common.enum";
import { IFixedAsset } from "../fixed-assets/interface";

export interface IDepreciationCalculation {
  uuid: string;
  process_date: Date
  depreciation_amount: string;
  accumulated_depreciation: string;
  fixedAsset: IFixedAsset;
  status: StatusEnum;
}

export interface ICreateDepreciationCalculation
  extends Partial<
    Omit<
      IDepreciationCalculation,
      | "uuid"
      | "fixedAsset"
      | "status"
    >
  > {
  fixedAssetUUID: string;
}

export interface IUpdateDepreciationCalculation extends Partial<ICreateDepreciationCalculation> {}
