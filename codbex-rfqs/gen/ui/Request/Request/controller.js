angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-rfqs.Request.Request';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-rfqs/gen/api/Request/Request.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber) {
			$scope.dataPage = pageNumber;
			entityApi.count().then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Request", `Unable to count Request: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.list(offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Request", `Unable to list Request: '${response.message}'`);
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
		$scope.loadPage($scope.dataPage);

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
						$scope.loadPage($scope.dataPage);
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

		$http.get("/services/js/codbex-rfqs/gen/api/entities/Product.js").then(function (response) {
			$scope.optionsProduct = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-rfqs/gen/api/entities/Partner.js").then(function (response) {
			$scope.optionsBuyer = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-rfqs/gen/api/entities/Partner.js").then(function (response) {
			$scope.optionsTrader = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-rfqs/gen/api/entities/UoM.js").then(function (response) {
			$scope.optionsUoM = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-rfqs/gen/api/entities/Currency.js").then(function (response) {
			$scope.optionsCurrencyCode = response.data.map(e => {
				return {
					value: e.Code,
					text: e.Code
				}
			});
		});

		$http.get("/services/js/codbex-rfqs/gen/api/entities/Country.js").then(function (response) {
			$scope.optionsCountry = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-rfqs/gen/api/entities/RequestStatus.js").then(function (response) {
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
