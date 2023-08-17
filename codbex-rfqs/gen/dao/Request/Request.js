const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");
const EntityUtils = require("codbex-rfqs/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
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
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setDate(e, "Date");
		EntityUtils.setDate(e, "DueDate");
		return e;
	});
};

exports.get = function(id) {
	let entity = dao.find(id);
	EntityUtils.setDate(entity, "Date");
	EntityUtils.setDate(entity, "DueDate");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "Date");
	EntityUtils.setLocalDate(entity, "DueDate");
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_REQUEST",
		key: {
			name: "Id",
			column: "REQUEST_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	// EntityUtils.setLocalDate(entity, "Date");
	// EntityUtils.setLocalDate(entity, "DueDate");
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_REQUEST",
		key: {
			name: "Id",
			column: "REQUEST_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_REQUEST",
		key: {
			name: "Id",
			column: "REQUEST_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_REQUEST"');
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(operation, data) {
	producer.queue("codbex-rfqs/Request/Request/" + operation).send(JSON.stringify(data));
}