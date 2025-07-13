import { StatusEnum } from "@/enums/common.enum";
import { IStatusTableDefinitions } from "@/interfaces/table.interface";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

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