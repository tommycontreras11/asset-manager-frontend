import { config } from "@/lib/config";
import Base from "@/providers/base";
import { ICreateDepartment, IDepartment, IUpdateDepartment } from "./interface";

export class DepartmentsProvider extends Base {
    constructor() {
        super(`${config.apiURL}/departments`);
    }

    public getAll(): Promise<IResponse<IDepartment[]>> {
        return this.get("/");
    }

    public getOne(uuid: string): Promise<IResponse<IDepartment>> {
        return this.get(`/${uuid}`);
    }

    public create(data: ICreateDepartment) {
        return this.post("/", data);
    }

    public update(uuid: string, data: IUpdateDepartment) {
        return this.patch(`/${uuid}`, data);
    }

    public destroy(uuid: string) {
        return this.delete(`/${uuid}`);
    }
}

const departmentsProvider = new DepartmentsProvider();

export default departmentsProvider;