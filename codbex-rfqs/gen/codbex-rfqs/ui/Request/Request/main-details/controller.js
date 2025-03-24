angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-rfqs.Request.Request';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-rfqs/gen/codbex-rfqs/api/Request/RequestService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'Extensions', 'messageHub', 'entityApi', function ($scope,  $http, Extensions, messageHub, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "Request Details",
			create: "Create Request",
			update: "Update Request"
		};
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-rfqs-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "Request" && e.view === "Request" && e.type === "entity");
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
				$scope.optionsProduct = [];
				$scope.optionsBuyer = [];
				$scope.optionsTrader = [];
				$scope.optionsUoM = [];
				$scope.optionsCurrency = [];
				$scope.optionsCountry = [];
				$scope.optionsStatus = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				if (msg.data.entity.DueDate) {
					msg.data.entity.DueDate = new Date(msg.data.entity.DueDate);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsProduct = msg.data.optionsProduct;
				$scope.optionsBuyer = msg.data.optionsBuyer;
				$scope.optionsTrader = msg.data.optionsTrader;
				$scope.optionsUoM = msg.data.optionsUoM;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsCountry = msg.data.optionsCountry;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsProduct = msg.data.optionsProduct;
				$scope.optionsBuyer = msg.data.optionsBuyer;
				$scope.optionsTrader = msg.data.optionsTrader;
				$scope.optionsUoM = msg.data.optionsUoM;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsCountry = msg.data.optionsCountry;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.action = 'create';
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				if (msg.data.entity.DueDate) {
					msg.data.entity.DueDate = new Date(msg.data.entity.DueDate);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsProduct = msg.data.optionsProduct;
				$scope.optionsBuyer = msg.data.optionsBuyer;
				$scope.optionsTrader = msg.data.optionsTrader;
				$scope.optionsUoM = msg.data.optionsUoM;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsCountry = msg.data.optionsCountry;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.action = 'update';
			});
		});

		$scope.serviceProduct = "/services/ts/codbex-products/gen/codbex-products/api/entities/ProductService.ts";
		$scope.serviceBuyer = "/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts";
		$scope.serviceTrader = "/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts";
		$scope.serviceUoM = "/services/ts/codbex-uoms/gen/codbex-uoms/api/entities/UoMService.ts";
		$scope.serviceCurrency = "/services/ts/codbex-currencies/gen/codbex-currencies/api/entities/CurrencyService.ts";
		$scope.serviceCountry = "/services/ts/codbex-countries/gen/codbex-countries/api/entities/CountryService.ts";
		$scope.serviceStatus = "/services/ts/codbex-rfqs/gen/codbex-rfqs/api/entities/RequestStatusService.ts";

		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("Request", `Unable to create Request: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Request", "Request successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Request", `Unable to update Request: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Request", "Request successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};
		
		//-----------------Dialogs-------------------//
		
		$scope.createProduct = function () {
			messageHub.showDialogWindow("Product-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createBuyer = function () {
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
		$scope.createUoM = function () {
			messageHub.showDialogWindow("UoM-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createCurrency = function () {
			messageHub.showDialogWindow("Currency-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createCountry = function () {
			messageHub.showDialogWindow("Country-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createStatus = function () {
			messageHub.showDialogWindow("RequestStatus-details", {
				action: "create",
				entity: {},
			}, null, false);
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

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
		$scope.refreshBuyer = function () {
			$scope.optionsBuyer = [];
			$http.get("/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts").then(function (response) {
				$scope.optionsBuyer = response.data.map(e => {
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
		$scope.refreshCurrency = function () {
			$scope.optionsCurrency = [];
			$http.get("/services/ts/codbex-currencies/gen/codbex-currencies/api/entities/CurrencyService.ts").then(function (response) {
				$scope.optionsCurrency = response.data.map(e => {
					return {
						value: e.Code,
						text: e.Code
					}
				});
			});
		};
		$scope.refreshCountry = function () {
			$scope.optionsCountry = [];
			$http.get("/services/ts/codbex-countries/gen/codbex-countries/api/entities/CountryService.ts").then(function (response) {
				$scope.optionsCountry = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshStatus = function () {
			$scope.optionsStatus = [];
			$http.get("/services/ts/codbex-rfqs/gen/codbex-rfqs/api/entities/RequestStatusService.ts").then(function (response) {
				$scope.optionsStatus = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};

		//----------------Dropdowns-----------------//	
		

	}]);