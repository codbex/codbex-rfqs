angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-rfqs.Quotation.Quotation';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-rfqs/gen/codbex-rfqs/api/Quotation/QuotationService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'messageHub', 'ViewParameters', 'entityApi', function ($scope,  $http, messageHub, ViewParameters, entityApi) {

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

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			if (params.entity.Date) {
				params.entity.Date = new Date(params.entity.Date);
			}
			if (params.entity.ValidityDate) {
				params.entity.ValidityDate = new Date(params.entity.ValidityDate);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsRequest = params.optionsRequest;
			$scope.optionsProduct = params.optionsProduct;
			$scope.optionsUoM = params.optionsUoM;
			$scope.optionsCurrency = params.optionsCurrency;
			$scope.optionsSupplier = params.optionsSupplier;
			$scope.optionsTrader = params.optionsTrader;
			$scope.optionsStatus = params.optionsStatus;
		}

		$scope.create = function () {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					$scope.errorMessage = `Unable to create Quotation: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("Quotation", "Quotation successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					$scope.errorMessage = `Unable to update Quotation: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("Quotation", "Quotation successfully updated");
			});
		};

		$scope.serviceRequest = "/services/ts/codbex-rfqs/gen/codbex-rfqs/api/Request/RequestService.ts";
		
		$scope.optionsRequest = [];
		
		$http.get("/services/ts/codbex-rfqs/gen/codbex-rfqs/api/Request/RequestService.ts").then(function (response) {
			$scope.optionsRequest = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceProduct = "/services/ts/codbex-products/gen/codbex-products/api/entities/ProductService.ts";
		
		$scope.optionsProduct = [];
		
		$http.get("/services/ts/codbex-products/gen/codbex-products/api/entities/ProductService.ts").then(function (response) {
			$scope.optionsProduct = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceUoM = "/services/ts/codbex-uoms/gen/codbex-uoms/api/entities/UoMService.ts";
		
		$scope.optionsUoM = [];
		
		$http.get("/services/ts/codbex-uoms/gen/codbex-uoms/api/entities/UoMService.ts").then(function (response) {
			$scope.optionsUoM = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceCurrency = "/services/ts/codbex-currencies/gen/codbex-currencies/api/entities/CurrencyService.ts";
		
		$scope.optionsCurrency = [];
		
		$http.get("/services/ts/codbex-currencies/gen/codbex-currencies/api/entities/CurrencyService.ts").then(function (response) {
			$scope.optionsCurrency = response.data.map(e => {
				return {
					value: e.Code,
					text: e.Code
				}
			});
		});
		$scope.serviceSupplier = "/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts";
		
		$scope.optionsSupplier = [];
		
		$http.get("/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts").then(function (response) {
			$scope.optionsSupplier = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceTrader = "/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts";
		
		$scope.optionsTrader = [];
		
		$http.get("/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts").then(function (response) {
			$scope.optionsTrader = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceStatus = "/services/ts/codbex-rfqs/gen/codbex-rfqs/api/entities/QuotationStatusService.ts";
		
		$scope.optionsStatus = [];
		
		$http.get("/services/ts/codbex-rfqs/gen/codbex-rfqs/api/entities/QuotationStatusService.ts").then(function (response) {
			$scope.optionsStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("Quotation-details");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);