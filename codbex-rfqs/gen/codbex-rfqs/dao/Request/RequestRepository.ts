import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface RequestEntity {
    readonly Id: number;
    Name?: string;
    Date?: Date;
    DueDate?: Date;
    Quantity?: number;
    Price?: number;
    Total?: number;
    Location?: string;
    Product?: number;
    Buyer?: number;
    Trader?: number;
    UoM?: number;
    CurrencyCode?: string;
    Country?: number;
    RequestStatus?: number;
}

export interface RequestCreateEntity {
    readonly Name?: string;
    readonly Date?: Date;
    readonly DueDate?: Date;
    readonly Quantity?: number;
    readonly Price?: number;
    readonly Total?: number;
    readonly Location?: string;
    readonly Product?: number;
    readonly Buyer?: number;
    readonly Trader?: number;
    readonly UoM?: number;
    readonly CurrencyCode?: string;
    readonly Country?: number;
    readonly RequestStatus?: number;
}

export interface RequestUpdateEntity extends RequestCreateEntity {
    readonly Id: number;
}

export interface RequestEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Date?: Date | Date[];
            DueDate?: Date | Date[];
            Quantity?: number | number[];
            Price?: number | number[];
            Total?: number | number[];
            Location?: string | string[];
            Product?: number | number[];
            Buyer?: number | number[];
            Trader?: number | number[];
            UoM?: number | number[];
            CurrencyCode?: string | string[];
            Country?: number | number[];
            RequestStatus?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Date?: Date | Date[];
            DueDate?: Date | Date[];
            Quantity?: number | number[];
            Price?: number | number[];
            Total?: number | number[];
            Location?: string | string[];
            Product?: number | number[];
            Buyer?: number | number[];
            Trader?: number | number[];
            UoM?: number | number[];
            CurrencyCode?: string | string[];
            Country?: number | number[];
            RequestStatus?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Date?: Date;
            DueDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            Location?: string;
            Product?: number;
            Buyer?: number;
            Trader?: number;
            UoM?: number;
            CurrencyCode?: string;
            Country?: number;
            RequestStatus?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Date?: Date;
            DueDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            Location?: string;
            Product?: number;
            Buyer?: number;
            Trader?: number;
            UoM?: number;
            CurrencyCode?: string;
            Country?: number;
            RequestStatus?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Date?: Date;
            DueDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            Location?: string;
            Product?: number;
            Buyer?: number;
            Trader?: number;
            UoM?: number;
            CurrencyCode?: string;
            Country?: number;
            RequestStatus?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Date?: Date;
            DueDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            Location?: string;
            Product?: number;
            Buyer?: number;
            Trader?: number;
            UoM?: number;
            CurrencyCode?: string;
            Country?: number;
            RequestStatus?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Date?: Date;
            DueDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            Location?: string;
            Product?: number;
            Buyer?: number;
            Trader?: number;
            UoM?: number;
            CurrencyCode?: string;
            Country?: number;
            RequestStatus?: number;
        };
    },
    $select?: (keyof RequestEntity)[],
    $sort?: string | (keyof RequestEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface RequestEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<RequestEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface RequestUpdateEntityEvent extends RequestEntityEvent {
    readonly previousEntity: RequestEntity;
}

export class RequestRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_REQUEST",
        properties: [
            {
                name: "Id",
                column: "REQUEST_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "REQUEST_NAME",
                type: "VARCHAR",
            },
            {
                name: "Date",
                column: "REQUEST_DATE",
                type: "DATE",
            },
            {
                name: "DueDate",
                column: "REQUEST_DUEDATE",
                type: "DATE",
            },
            {
                name: "Quantity",
                column: "REQUEST_QUANTITY",
                type: "DOUBLE",
            },
            {
                name: "Price",
                column: "REQUEST_PRICE",
                type: "DOUBLE",
            },
            {
                name: "Total",
                column: "REQUEST_TOTAL",
                type: "DOUBLE",
            },
            {
                name: "Location",
                column: "REQUEST_LOCATION",
                type: "VARCHAR",
            },
            {
                name: "Product",
                column: "REQUEST_PRODUCT",
                type: "INTEGER",
            },
            {
                name: "Buyer",
                column: "REQUEST_BUYER",
                type: "INTEGER",
            },
            {
                name: "Trader",
                column: "REQUEST_TRADER",
                type: "INTEGER",
            },
            {
                name: "UoM",
                column: "REQUEST_UOM",
                type: "INTEGER",
            },
            {
                name: "CurrencyCode",
                column: "REQUEST_CURRENCYCODE",
                type: "VARCHAR",
            },
            {
                name: "Country",
                column: "REQUEST_COUNTRY",
                type: "INTEGER",
            },
            {
                name: "RequestStatus",
                column: "REQUEST_REQUESTSTATUS",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(RequestRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: RequestEntityOptions): RequestEntity[] {
        return this.dao.list(options).map((e: RequestEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "DueDate");
            return e;
        });
    }

    public findById(id: number): RequestEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "DueDate");
        return entity ?? undefined;
    }

    public create(entity: RequestCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "DueDate");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_REQUEST",
            entity: entity,
            key: {
                name: "Id",
                column: "REQUEST_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: RequestUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "DueDate");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_REQUEST",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "REQUEST_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: RequestCreateEntity | RequestUpdateEntity): number {
        const id = (entity as RequestUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as RequestUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_REQUEST",
            entity: entity,
            key: {
                name: "Id",
                column: "REQUEST_ID",
                value: id
            }
        });
    }

    public count(options?: RequestEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__REQUEST"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: RequestEntityEvent | RequestUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-rfqs-Request-Request", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-rfqs-Request-Request").send(JSON.stringify(data));
    }
}
