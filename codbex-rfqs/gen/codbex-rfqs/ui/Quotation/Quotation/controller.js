angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-rfqs.Quotation.Quotation';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-rfqs/gen/codbex-rfqs/api/Quotation/QuotationService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', 'Extensions', function ($scope, $http, messageHub, entityApi, Extensions) {

		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataLimit = 20;

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-rfqs-custom-action').then(function (response) {
			$scope.pageActions = response.filter(e => e.perspective === "Quotation" && e.view === "Quotation" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.filter(e => e.perspective === "Quotation" && e.view === "Quotation" && e.type === "entity");
		});

		$scope.triggerPageAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{},
				null,
				true,
				action
			);
		};

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

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entitySearch", function (msg) {
			resetPagination();
			$scope.filter = msg.data.filter;
			$scope.filterEntity = msg.data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber, filter) {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			$scope.dataPage = pageNumber;
			entityApi.count(filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Quotation", `Unable to count Quotation: '${response.message}'`);
					return;
				}
				if (response.data) {
					$scope.dataCount = response.data;
				}
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				let request;
				if (filter) {
					filter.$offset = offset;
					filter.$limit = limit;
					request = entityApi.search(filter);
				} else {
					request = entityApi.list(offset, limit);
				}
				request.then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Quotation", `Unable to list/filter Quotation: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
						if (e.ValidityDate) {
							e.ValidityDate = new Date(e.ValidityDate);
						}
					});

					$scope.data = response.data;
				});
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("Quotation-details", {
				action: "select",
				entity: entity,
				optionsRequest: $scope.optionsRequest,
				optionsProduct: $scope.optionsProduct,
				optionsUoM: $scope.optionsUoM,
				optionsCurrencyCode: $scope.optionsCurrencyCode,
				optionsSupplier: $scope.optionsSupplier,
				optionsTrader: $scope.optionsTrader,
				optionsQuotationStatus: $scope.optionsQuotationStatus,
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("Quotation-filter", {
				entity: $scope.filterEntity,
				optionsRequest: $scope.optionsRequest,
				optionsProduct: $scope.optionsProduct,
				optionsUoM: $scope.optionsUoM,
				optionsCurrencyCode: $scope.optionsCurrencyCode,
				optionsSupplier: $scope.optionsSupplier,
				optionsTrader: $scope.optionsTrader,
				optionsQuotationStatus: $scope.optionsQuotationStatus,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("Quotation-details", {
				action: "create",
				entity: {},
				optionsRequest: $scope.optionsRequest,
				optionsProduct: $scope.optionsProduct,
				optionsUoM: $scope.optionsUoM,
				optionsCurrencyCode: $scope.optionsCurrencyCode,
				optionsSupplier: $scope.optionsSupplier,
				optionsTrader: $scope.optionsTrader,
				optionsQuotationStatus: $scope.optionsQuotationStatus,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("Quotation-details", {
				action: "update",
				entity: entity,
				optionsRequest: $scope.optionsRequest,
				optionsProduct: $scope.optionsProduct,
				optionsUoM: $scope.optionsUoM,
				optionsCurrencyCode: $scope.optionsCurrencyCode,
				optionsSupplier: $scope.optionsSupplier,
				optionsTrader: $scope.optionsTrader,
				optionsQuotationStatus: $scope.optionsQuotationStatus,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete Quotation?',
				`Are you sure you want to delete Quotation? This action cannot be undone.`,
				[{
					id: "delete-btn-yes",
					type: "emphasized",
					label: "Yes",
				},
				{
					id: "delete-btn-no",
					type: "normal",
					label: "No",
				}],
			).then(function (msg) {
				if (msg.data === "delete-btn-yes") {
					entityApi.delete(id).then(function (response) {
						if (response.status != 204) {
							messageHub.showAlertError("Quotation", `Unable to delete Quotation: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsRequest = [];
		$scope.optionsProduct = [];
		$scope.optionsUoM = [];
		$scope.optionsCurrencyCode = [];
		$scope.optionsSupplier = [];
		$scope.optionsTrader = [];
		$scope.optionsQuotationStatus = [];


		$http.get("/services/ts/codbex-rfqs/gen/codbex-rfqs/api/Request/RequestService.ts").then(function (response) {
			$scope.optionsRequest = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-products/gen/codbex-products/api/entities/ProductService.ts").then(function (response) {
			$scope.optionsProduct = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-uoms/gen/codbex-uoms/api/entities/UoMService.ts").then(function (response) {
			$scope.optionsUoM = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-currencies/gen/codbex-currencies/api/entities/CurrencyService.ts").then(function (response) {
			$scope.optionsCurrencyCode = response.data.map(e => {
				return {
					value: e.Code,
					text: e.Code
				}
			});
		});

		$http.get("/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts").then(function (response) {
			$scope.optionsSupplier = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts").then(function (response) {
			$scope.optionsTrader = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-rfqs/gen/codbex-rfqs/api/entities/QuotationStatusService.ts").then(function (response) {
			$scope.optionsQuotationStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.optionsRequestValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsRequest.length; i++) {
				if ($scope.optionsRequest[i].value === optionKey) {
					return $scope.optionsRequest[i].text;
				}
			}
			return null;
		};
		$scope.optionsProductValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsProduct.length; i++) {
				if ($scope.optionsProduct[i].value === optionKey) {
					return $scope.optionsProduct[i].text;
				}
			}
			return null;
		};
		$scope.optionsUoMValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsUoM.length; i++) {
				if ($scope.optionsUoM[i].value === optionKey) {
					return $scope.optionsUoM[i].text;
				}
			}
			return null;
		};
		$scope.optionsCurrencyCodeValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCurrencyCode.length; i++) {
				if ($scope.optionsCurrencyCode[i].value === optionKey) {
					return $scope.optionsCurrencyCode[i].text;
				}
			}
			return null;
		};
		$scope.optionsSupplierValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSupplier.length; i++) {
				if ($scope.optionsSupplier[i].value === optionKey) {
					return $scope.optionsSupplier[i].text;
				}
			}
			return null;
		};
		$scope.optionsTraderValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsTrader.length; i++) {
				if ($scope.optionsTrader[i].value === optionKey) {
					return $scope.optionsTrader[i].text;
				}
			}
			return null;
		};
		$scope.optionsQuotationStatusValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsQuotationStatus.length; i++) {
				if ($scope.optionsQuotationStatus[i].value === optionKey) {
					return $scope.optionsQuotationStatus[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
