import { LedgerAccountTypeEnum, StatusEnum } from "@/enums/common.enum";
import { IStatusTableDefinitions } from "@/interfaces/table.interface";
import { ArchiveIcon, CheckCircledIcon, CrossCircledIcon, FileTextIcon } from "@radix-ui/react-icons";
import { CreditCardIcon } from "lucide-react";

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