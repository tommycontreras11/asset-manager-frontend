import { config } from "@/lib/config";
import Base from "@/providers/base";
import { ICreateInventoryType, IInventoryType, IUpdateInventoryType } from "./interface";

export class InventoryTypesProvider extends Base {
    constructor() {
        super(`${config.apiURL}/inventory-types`);
    }

    public getAll(): Promise<IResponse<IInventoryType[]>> {
        return this.get("/");
    }

    public getOne(uuid: string): Promise<IResponse<IInventoryType>> {
        return this.get(`/${uuid}`);
    }

    public create(data: ICreateInventoryType) {
        return this.post("/", data);
    }

    public update(uuid: string, data: IUpdateInventoryType) {
        return this.patch(`/${uuid}`, data);
    }

    public destroy(uuid: string) {
        return this.delete(`/${uuid}`);
    }
}

const inventoryTypesProvider = new InventoryTypesProvider();

export default inventoryTypesProvider;