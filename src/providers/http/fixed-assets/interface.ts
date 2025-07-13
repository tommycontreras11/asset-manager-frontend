import { StatusEnum } from "@/enums/common.enum";
import { IDepartment } from "../departments/interface";
import { IAssetType } from "../asset-types/interface";
import { IEmployee } from "../employees/interface";

export interface IFixedAsset {
  uuid: string;
  name: string;
  purchase_value: string;
  accumulated_depreciation: string;
  department: IDepartment;
  assetType: IAssetType;
  employee: IEmployee;
  status: StatusEnum;
}

export interface ICreateFixedAsset
  extends Partial<
    Omit<
      IFixedAsset,
      | "uuid"
      | "department"
      | "assetType"
      | "employee"
      | "status"
    >
  > {
  departmentUUID: string;
  assetTypeUUID: string;
  employeeUUID: string;
}

export interface IUpdateFixedAsset extends Partial<ICreateFixedAsset> {}
