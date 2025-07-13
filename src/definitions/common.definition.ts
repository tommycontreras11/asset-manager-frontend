import { LedgerAccountTypeEnum, PersonTypeEnum, StatusEnum } from "@/enums/common.enum";
import { IStatusTableDefinitions } from "@/interfaces/table.interface";
import { ArchiveIcon, CheckCircledIcon, CrossCircledIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BuildingIcon, CreditCardIcon, IdCardIcon } from "lucide-react";

export const commonStatusTableDefinitions: IStatusTableDefinitions[] = [
  {
    value: StatusEnum.ACTIVE,
    label: "Active",
    icon: CheckCircledIcon,
  },
  {
    value: StatusEnum.INACTIVE,
    label: "Inactive",
    icon: CrossCircledIcon,
  },
];

export const ledgerAccountStatusTableDefinitions: IStatusTableDefinitions[] = [
  {
    value: LedgerAccountTypeEnum.GENERAL,
    label: "General",
    icon: FileTextIcon, 
  },
  {
    value: LedgerAccountTypeEnum.DEPRECIATION,
    label: "Depreciation",
    icon: ArchiveIcon, 
  },
  {
    value: LedgerAccountTypeEnum.PURCHASE,
    label: "Purchase",
    icon: CreditCardIcon, 
  },
];

export const personTypeStatusTableDefinitions: IStatusTableDefinitions[] = [
  {
    value: PersonTypeEnum.INDIVIDUAL,
    label: "Individual",
    icon: IdCardIcon,
  },
  {
    value: PersonTypeEnum.JURIDIC,
    label: "Juridic",
    icon: BuildingIcon,
  }
];