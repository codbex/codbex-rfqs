import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface RequestStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface RequestStatusCreateEntity {
    readonly Name?: string;
}

export interface RequestStatusUpdateEntity extends RequestStatusCreateEntity {
    readonly Id: number;
}

export interface RequestStatusEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
    },
    $select?: (keyof RequestStatusEntity)[],
    $sort?: string | (keyof RequestStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface RequestStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<RequestStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface RequestStatusUpdateEntityEvent extends RequestStatusEntityEvent {
    readonly previousEntity: RequestStatusEntity;
}

export class RequestStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_REQUESTSTATUS",
        properties: [
            {
                name: "Id",
                column: "REQUESTSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "REQUESTSTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(RequestStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: RequestStatusEntityOptions): RequestStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): RequestStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: RequestStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_REQUESTSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "REQUESTSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: RequestStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_REQUESTSTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "REQUESTSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: RequestStatusCreateEntity | RequestStatusUpdateEntity): number {
        const id = (entity as RequestStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as RequestStatusUpdateEntity);
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
            table: "CODBEX_REQUESTSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "REQUESTSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: RequestStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__REQUESTSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: RequestStatusEntityEvent | RequestStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-rfqs-entities-RequestStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-rfqs-entities-RequestStatus").send(JSON.stringify(data));
    }
}
