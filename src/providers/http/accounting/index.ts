import { config } from "@/lib/config";
import Base from "@/providers/base";
import { ICreateAccountingList } from "./interface";

export class AccountingProvider extends Base {
    constructor() {
        super(`${config.apiURL}/accounting`)
    }

    public create(data: ICreateAccountingList) {
        return this.post(`/`, data);
    }
}

const accountingProvider = new AccountingProvider();

export default accountingProvider;