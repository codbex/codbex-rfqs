const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");
const EntityUtils = require("codbex-rfqs/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
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
			name: "CurrencyCode",
			column: "QUOTATION_CURRENCYCODE",
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
			name: "QuotationStatus",
			column: "QUOTATION_QUOTATIONSTATUSID",
			type: "INTEGER",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setDate(e, "Date");
		EntityUtils.setDate(e, "ValidityDate");
		return e;
	});
};

exports.get = function(id) {
	let entity = dao.find(id);
	EntityUtils.setDate(entity, "Date");
	EntityUtils.setDate(entity, "ValidityDate");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "Date");
	EntityUtils.setLocalDate(entity, "ValidityDate");
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_QUOTATION",
		key: {
			name: "Id",
			column: "QUOTATION_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	// EntityUtils.setLocalDate(entity, "Date");
	// EntityUtils.setLocalDate(entity, "ValidityDate");
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_QUOTATION",
		key: {
			name: "Id",
			column: "QUOTATION_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_QUOTATION",
		key: {
			name: "Id",
			column: "QUOTATION_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_QUOTATION"');
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
	producer.queue("codbex-rfqs/Quotation/Quotation/" + operation).send(JSON.stringify(data));
}