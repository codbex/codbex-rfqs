angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-rfqs.Quotation.Quotation';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-rfqs/gen/codbex-rfqs/api/Quotation/QuotationService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'Extensions', 'messageHub', 'entityApi', function ($scope,  $http, Extensions, messageHub, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "Quotation Details",
			create: "Create Quotation",
			update: "Update Quotation"
		};
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-rfqs-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "Quotation" && e.view === "Quotation" && e.type === "entity");
		});

		$scope.triggerEntityAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{
					id: $scope.entity.Id
				},
				null,
				true,
				action
			);
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsRequest = [];
				$scope.optionsProduct = [];
				$scope.optionsUoM = [];
				$scope.optionsCurrencyCode = [];
				$scope.optionsSupplier = [];
				$scope.optionsTrader = [];
				$scope.optionsQuotationStatus = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				if (msg.data.entity.ValidityDate) {
					msg.data.entity.ValidityDate = new Date(msg.data.entity.ValidityDate);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsRequest = msg.data.optionsRequest;
				$scope.optionsProduct = msg.data.optionsProduct;
				$scope.optionsUoM = msg.data.optionsUoM;
				$scope.optionsCurrencyCode = msg.data.optionsCurrencyCode;
				$scope.optionsSupplier = msg.data.optionsSupplier;
				$scope.optionsTrader = msg.data.optionsTrader;
				$scope.optionsQuotationStatus = msg.data.optionsQuotationStatus;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsRequest = msg.data.optionsRequest;
				$scope.optionsProduct = msg.data.optionsProduct;
				$scope.optionsUoM = msg.data.optionsUoM;
				$scope.optionsCurrencyCode = msg.data.optionsCurrencyCode;
				$scope.optionsSupplier = msg.data.optionsSupplier;
				$scope.optionsTrader = msg.data.optionsTrader;
				$scope.optionsQuotationStatus = msg.data.optionsQuotationStatus;
				$scope.action = 'create';
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				if (msg.data.entity.ValidityDate) {
					msg.data.entity.ValidityDate = new Date(msg.data.entity.ValidityDate);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsRequest = msg.data.optionsRequest;
				$scope.optionsProduct = msg.data.optionsProduct;
				$scope.optionsUoM = msg.data.optionsUoM;
				$scope.optionsCurrencyCode = msg.data.optionsCurrencyCode;
				$scope.optionsSupplier = msg.data.optionsSupplier;
				$scope.optionsTrader = msg.data.optionsTrader;
				$scope.optionsQuotationStatus = msg.data.optionsQuotationStatus;
				$scope.action = 'update';
			});
		});

		$scope.serviceRequest = "/services/ts/codbex-rfqs/gen/codbex-rfqs/api/Request/RequestService.ts";
		$scope.serviceProduct = "/services/ts/codbex-products/gen/codbex-products/api/entities/ProductService.ts";
		$scope.serviceUoM = "/services/ts/codbex-uoms/gen/codbex-uoms/api/entities/UoMService.ts";
		$scope.serviceCurrencyCode = "/services/ts/codbex-currencies/gen/codbex-currencies/api/entities/CurrencyService.ts";
		$scope.serviceSupplier = "/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts";
		$scope.serviceTrader = "/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts";
		$scope.serviceQuotationStatus = "/services/ts/codbex-rfqs/gen/codbex-rfqs/api/entities/QuotationStatusService.ts";

		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("Quotation", `Unable to create Quotation: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Quotation", "Quotation successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Quotation", `Unable to update Quotation: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Quotation", "Quotation successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};
		
		//-----------------Dialogs-------------------//
		
		$scope.createRequest = function () {
			messageHub.showDialogWindow("Request-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createProduct = function () {
			messageHub.showDialogWindow("Product-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createUoM = function () {
			messageHub.showDialogWindow("UoM-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createCurrencyCode = function () {
			messageHub.showDialogWindow("Currency-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createSupplier = function () {
			messageHub.showDialogWindow("Partner-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createTrader = function () {
			messageHub.showDialogWindow("Partner-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createQuotationStatus = function () {
			messageHub.showDialogWindow("QuotationStatus-details", {
				action: "create",
				entity: {},
			}, null, false);
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshRequest = function () {
			$scope.optionsRequest = [];
			$http.get("/services/ts/codbex-rfqs/gen/codbex-rfqs/api/Request/RequestService.ts").then(function (response) {
				$scope.optionsRequest = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshProduct = function () {
			$scope.optionsProduct = [];
			$http.get("/services/ts/codbex-products/gen/codbex-products/api/entities/ProductService.ts").then(function (response) {
				$scope.optionsProduct = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshUoM = function () {
			$scope.optionsUoM = [];
			$http.get("/services/ts/codbex-uoms/gen/codbex-uoms/api/entities/UoMService.ts").then(function (response) {
				$scope.optionsUoM = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshCurrencyCode = function () {
			$scope.optionsCurrencyCode = [];
			$http.get("/services/ts/codbex-currencies/gen/codbex-currencies/api/entities/CurrencyService.ts").then(function (response) {
				$scope.optionsCurrencyCode = response.data.map(e => {
					return {
						value: e.Code,
						text: e.Code
					}
				});
			});
		};
		$scope.refreshSupplier = function () {
			$scope.optionsSupplier = [];
			$http.get("/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts").then(function (response) {
				$scope.optionsSupplier = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshTrader = function () {
			$scope.optionsTrader = [];
			$http.get("/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts").then(function (response) {
				$scope.optionsTrader = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshQuotationStatus = function () {
			$scope.optionsQuotationStatus = [];
			$http.get("/services/ts/codbex-rfqs/gen/codbex-rfqs/api/entities/QuotationStatusService.ts").then(function (response) {
				$scope.optionsQuotationStatus = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};

		//----------------Dropdowns-----------------//	
		

	}]);