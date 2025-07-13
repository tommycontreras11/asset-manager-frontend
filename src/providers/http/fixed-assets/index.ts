import { config } from "@/lib/config";
import Base from "@/providers/base";
import { ICreateFixedAsset, IFixedAsset, IUpdateFixedAsset } from "./interface";

export class FixedAssetsProvider extends Base {
    constructor() {
        super(`${config.apiURL}/fixed-assets`);
    }

    public getAll(): Promise<IResponse<IFixedAsset[]>> {
        return this.get("/");
    }

    public getOne(uuid: string): Promise<IResponse<IFixedAsset>> {
        return this.get(`/${uuid}`);
    }

    public create(data: ICreateFixedAsset) {
        return this.post("/", data);
    }

    public update(uuid: string, data: IUpdateFixedAsset) {
        return this.patch(`/${uuid}`, data);
    }

    public destroy(uuid: string) {
        return this.delete(`/${uuid}`);
    }
}

const fixedAssetsProvider = new FixedAssetsProvider();

export default fixedAssetsProvider;