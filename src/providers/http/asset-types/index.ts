import { config } from "@/lib/config";
import Base from "@/providers/base";
import { ICreateAssetType, IAssetType, IUpdateAssetType } from "./interface";

export class AssetTypesProvider extends Base {
    constructor() {
        super(`${config.apiURL}/asset-types`);
    }

    public getAll(): Promise<IResponse<IAssetType[]>> {
        return this.get("/");
    }

    public getOne(uuid: string): Promise<IResponse<IAssetType>> {
        return this.get(`/${uuid}`);
    }

    public create(data: ICreateAssetType) {
        return this.post("/", data);
    }

    public update(uuid: string, data: IUpdateAssetType) {
        return this.patch(`/${uuid}`, data);
    }

    public destroy(uuid: string) {
        return this.delete(`/${uuid}`);
    }
}

const assetTypesProvider = new AssetTypesProvider();

export default assetTypesProvider;