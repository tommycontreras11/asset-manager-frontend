import { config } from "@/lib/config";
import Base from "@/providers/base";
import { ICreateLedgerAccount, ILedgerAccount, IUpdateLedgerAccount } from "./interface";

export class LedgerAccountsProvider extends Base {
    constructor() {
        super(`${config.apiURL}/ledger-accounts`);
    }

    public getAll(): Promise<IResponse<ILedgerAccount[]>> {
        return this.get("/");
    }

    public getOne(uuid: string): Promise<IResponse<ILedgerAccount>> {
        return this.get(`/${uuid}`);
    }

    public create(data: ICreateLedgerAccount) {
        return this.post("/", data);
    }

    public update(uuid: string, data: IUpdateLedgerAccount) {
        return this.patch(`/${uuid}`, data);
    }

    public destroy(uuid: string) {
        return this.delete(`/${uuid}`);
    }
}

const ledgerAccountsProvider = new LedgerAccountsProvider();

export default ledgerAccountsProvider;