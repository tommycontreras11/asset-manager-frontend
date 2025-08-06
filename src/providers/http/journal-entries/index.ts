import { config } from "@/lib/config";
import Base from "@/providers/base";
import { ICreateJournalEntry, IJournalEntry, IUpdateJournalEntry } from "./interface";

export class JournalEntriesProvider extends Base {
    constructor() {
        super(`${config.apiURL}/journal-entries`);
    }

    public getAll(from?: string, to?: string): Promise<IResponse<IJournalEntry[]>> {
        return this.get(`/?from=${from}&to=${to}`);
    }

    public getOne(uuid: string): Promise<IResponse<IJournalEntry>> {
        return this.get(`/${uuid}`);
    }

    public create(data: ICreateJournalEntry) {
        return this.post("/", data);
    }

    public update(uuid: string, data: IUpdateJournalEntry) {
        return this.patch(`/${uuid}`, data);
    }

    public destroy(uuid: string) {
        return this.delete(`/${uuid}`);
    }
}

const journalEntriesProvider = new JournalEntriesProvider();

export default journalEntriesProvider;