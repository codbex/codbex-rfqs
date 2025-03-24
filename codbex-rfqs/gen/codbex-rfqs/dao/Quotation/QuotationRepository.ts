import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface QuotationEntity {
    readonly Id: number;
    Request?: number;
    Name?: string;
    Date?: Date;
    ValidityDate?: Date;
    Quantity?: number;
    Price?: number;
    Total?: number;
    Product?: number;
    UoM?: number;
    Currency?: string;
    Supplier?: number;
    Trader?: number;
    Status?: number;
}

export interface QuotationCreateEntity {
    readonly Request?: number;
    readonly Name?: string;
    readonly Date?: Date;
    readonly ValidityDate?: Date;
    readonly Quantity?: number;
    readonly Price?: number;
    readonly Total?: number;
    readonly Product?: number;
    readonly UoM?: number;
    readonly Currency?: string;
    readonly Supplier?: number;
    readonly Trader?: number;
    readonly Status?: number;
}

export interface QuotationUpdateEntity extends QuotationCreateEntity {
    readonly Id: number;
}

export interface QuotationEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Request?: number | number[];
            Name?: string | string[];
            Date?: Date | Date[];
            ValidityDate?: Date | Date[];
            Quantity?: number | number[];
            Price?: number | number[];
            Total?: number | number[];
            Product?: number | number[];
            UoM?: number | number[];
            Currency?: string | string[];
            Supplier?: number | number[];
            Trader?: number | number[];
            Status?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Request?: number | number[];
            Name?: string | string[];
            Date?: Date | Date[];
            ValidityDate?: Date | Date[];
            Quantity?: number | number[];
            Price?: number | number[];
            Total?: number | number[];
            Product?: number | number[];
            UoM?: number | number[];
            Currency?: string | string[];
            Supplier?: number | number[];
            Trader?: number | number[];
            Status?: number | number[];
        };
        contains?: {
            Id?: number;
            Request?: number;
            Name?: string;
            Date?: Date;
            ValidityDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            Product?: number;
            UoM?: number;
            Currency?: string;
            Supplier?: number;
            Trader?: number;
            Status?: number;
        };
        greaterThan?: {
            Id?: number;
            Request?: number;
            Name?: string;
            Date?: Date;
            ValidityDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            Product?: number;
            UoM?: number;
            Currency?: string;
            Supplier?: number;
            Trader?: number;
            Status?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Request?: number;
            Name?: string;
            Date?: Date;
            ValidityDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            Product?: number;
            UoM?: number;
            Currency?: string;
            Supplier?: number;
            Trader?: number;
            Status?: number;
        };
        lessThan?: {
            Id?: number;
            Request?: number;
            Name?: string;
            Date?: Date;
            ValidityDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            Product?: number;
            UoM?: number;
            Currency?: string;
            Supplier?: number;
            Trader?: number;
            Status?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Request?: number;
            Name?: string;
            Date?: Date;
            ValidityDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            Product?: number;
            UoM?: number;
            Currency?: string;
            Supplier?: number;
            Trader?: number;
            Status?: number;
        };
    },
    $select?: (keyof QuotationEntity)[],
    $sort?: string | (keyof QuotationEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface QuotationEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<QuotationEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface QuotationUpdateEntityEvent extends QuotationEntityEvent {
    readonly previousEntity: QuotationEntity;
}

export class QuotationRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_QUOTATION",
        properties: [
            {
                name: "Id",
                column: "QUOTATION_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Request",
                column: "QUOTATION_REQUEST",
                type: "INTEGER",
            },
            {
                name: "Name",
                column: "QUOTATION_NAME",
                type: "VARCHAR",
            },
            {
                name: "Date",
                column: "QUOTATION_DATE",
                type: "DATE",
            },
            {
                name: "ValidityDate",
                column: "QUOTATION_VALIDITYDATE",
                type: "DATE",
            },
            {
                name: "Quantity",
                column: "QUOTATION_QUANTITY",
                type: "DOUBLE",
            },
            {
                name: "Price",
                column: "QUOTATION_PRICE",
                type: "DOUBLE",
            },
            {
                name: "Total",
                column: "QUOTATION_TOTAL",
                type: "DOUBLE",
            },
            {
                name: "Product",
                column: "QUOTATION_PRODUCT",
                type: "INTEGER",
            },
            {
                name: "UoM",
                column: "QUOTATION_UOMID",
                type: "INTEGER",
            },
            {
                name: "Currency",
                column: "QUOTATION_CURRENCY",
                type: "VARCHAR",
            },
            {
                name: "Supplier",
                column: "QUOTATION_SUPPLIER",
                type: "INTEGER",
            },
            {
                name: "Trader",
                column: "QUOTATION_TRADER",
                type: "INTEGER",
            },
            {
                name: "Status",
                column: "QUOTATION_STATUSID",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(QuotationRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: QuotationEntityOptions): QuotationEntity[] {
        return this.dao.list(options).map((e: QuotationEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "ValidityDate");
            return e;
        });
    }

    public findById(id: number): QuotationEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "ValidityDate");
        return entity ?? undefined;
    }

    public create(entity: QuotationCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "ValidityDate");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_QUOTATION",
            entity: entity,
            key: {
                name: "Id",
                column: "QUOTATION_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: QuotationUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "ValidityDate");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_QUOTATION",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "QUOTATION_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: QuotationCreateEntity | QuotationUpdateEntity): number {
        const id = (entity as QuotationUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as QuotationUpdateEntity);
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
            table: "CODBEX_QUOTATION",
            entity: entity,
            key: {
                name: "Id",
                column: "QUOTATION_ID",
                value: id
            }
        });
    }

    public count(options?: QuotationEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__QUOTATION"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: QuotationEntityEvent | QuotationUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-rfqs-Quotation-Quotation", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-rfqs-Quotation-Quotation").send(JSON.stringify(data));
    }
}
