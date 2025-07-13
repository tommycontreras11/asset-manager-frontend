import { config } from "@/lib/config";
import Base from "@/providers/base";
import { ICreateDepreciationCalculation, IDepreciationCalculation, IUpdateDepreciationCalculation } from "./interface";

export class DepreciationCalculationsProvider extends Base {
    constructor() {
        super(`${config.apiURL}/depreciation-calculations`);
    }

    public getAll(): Promise<IResponse<IDepreciationCalculation[]>> {
        return this.get("/");
    }

    public getOne(uuid: string): Promise<IResponse<IDepreciationCalculation>> {
        return this.get(`/${uuid}`);
    }

    public create(data: ICreateDepreciationCalculation) {
        return this.post("/", data);
    }

    public update(uuid: string, data: IUpdateDepreciationCalculation) {
        return this.patch(`/${uuid}`, data);
    }

    public destroy(uuid: string) {
        return this.delete(`/${uuid}`);
    }
}

const depreciationCalculationsProvider = new DepreciationCalculationsProvider();

export default depreciationCalculationsProvider;