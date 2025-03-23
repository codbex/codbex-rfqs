angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-rfqs.Request.Request';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-rfqs/gen/codbex-rfqs/api/Request/RequestService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', 'Extensions', function ($scope, $http, messageHub, entityApi, Extensions) {

		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataLimit = 20;

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-rfqs-custom-action').then(function (response) {
			$scope.pageActions = response.filter(e => e.perspective === "Request" && e.view === "Request" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.filter(e => e.perspective === "Request" && e.view === "Request" && e.type === "entity");
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
					messageHub.showAlertError("Request", `Unable to count Request: '${response.message}'`);
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
						messageHub.showAlertError("Request", `Unable to list/filter Request: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
						if (e.DueDate) {
							e.DueDate = new Date(e.DueDate);
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
			messageHub.showDialogWindow("Request-details", {
				action: "select",
				entity: entity,
				optionsProduct: $scope.optionsProduct,
				optionsBuyer: $scope.optionsBuyer,
				optionsTrader: $scope.optionsTrader,
				optionsUoM: $scope.optionsUoM,
				optionsCurrencyCode: $scope.optionsCurrencyCode,
				optionsCountry: $scope.optionsCountry,
				optionsRequestStatus: $scope.optionsRequestStatus,
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("Request-filter", {
				entity: $scope.filterEntity,
				optionsProduct: $scope.optionsProduct,
				optionsBuyer: $scope.optionsBuyer,
				optionsTrader: $scope.optionsTrader,
				optionsUoM: $scope.optionsUoM,
				optionsCurrencyCode: $scope.optionsCurrencyCode,
				optionsCountry: $scope.optionsCountry,
				optionsRequestStatus: $scope.optionsRequestStatus,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("Request-details", {
				action: "create",
				entity: {},
				optionsProduct: $scope.optionsProduct,
				optionsBuyer: $scope.optionsBuyer,
				optionsTrader: $scope.optionsTrader,
				optionsUoM: $scope.optionsUoM,
				optionsCurrencyCode: $scope.optionsCurrencyCode,
				optionsCountry: $scope.optionsCountry,
				optionsRequestStatus: $scope.optionsRequestStatus,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("Request-details", {
				action: "update",
				entity: entity,
				optionsProduct: $scope.optionsProduct,
				optionsBuyer: $scope.optionsBuyer,
				optionsTrader: $scope.optionsTrader,
				optionsUoM: $scope.optionsUoM,
				optionsCurrencyCode: $scope.optionsCurrencyCode,
				optionsCountry: $scope.optionsCountry,
				optionsRequestStatus: $scope.optionsRequestStatus,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete Request?',
				`Are you sure you want to delete Request? This action cannot be undone.`,
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
							messageHub.showAlertError("Request", `Unable to delete Request: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsProduct = [];
		$scope.optionsBuyer = [];
		$scope.optionsTrader = [];
		$scope.optionsUoM = [];
		$scope.optionsCurrencyCode = [];
		$scope.optionsCountry = [];
		$scope.optionsRequestStatus = [];


		$http.get("/services/ts/codbex-products/gen/codbex-products/api/entities/ProductService.ts").then(function (response) {
			$scope.optionsProduct = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts").then(function (response) {
			$scope.optionsBuyer = response.data.map(e => {
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

		$http.get("/services/ts/codbex-countries/gen/codbex-countries/api/entities/CountryService.ts").then(function (response) {
			$scope.optionsCountry = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-rfqs/gen/codbex-rfqs/api/entities/RequestStatusService.ts").then(function (response) {
			$scope.optionsRequestStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.optionsProductValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsProduct.length; i++) {
				if ($scope.optionsProduct[i].value === optionKey) {
					return $scope.optionsProduct[i].text;
				}
			}
			return null;
		};
		$scope.optionsBuyerValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsBuyer.length; i++) {
				if ($scope.optionsBuyer[i].value === optionKey) {
					return $scope.optionsBuyer[i].text;
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
		$scope.optionsCountryValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCountry.length; i++) {
				if ($scope.optionsCountry[i].value === optionKey) {
					return $scope.optionsCountry[i].text;
				}
			}
			return null;
		};
		$scope.optionsRequestStatusValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsRequestStatus.length; i++) {
				if ($scope.optionsRequestStatus[i].value === optionKey) {
					return $scope.optionsRequestStatus[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
