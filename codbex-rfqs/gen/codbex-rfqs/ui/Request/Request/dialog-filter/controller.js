angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-rfqs.Request.Request';
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', function ($scope, messageHub, ViewParameters) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			if (params?.entity?.DateFrom) {
				params.entity.DateFrom = new Date(params.entity.DateFrom);
			}
			if (params?.entity?.DateTo) {
				params.entity.DateTo = new Date(params.entity.DateTo);
			}
			if (params?.entity?.DueDateFrom) {
				params.entity.DueDateFrom = new Date(params.entity.DueDateFrom);
			}
			if (params?.entity?.DueDateTo) {
				params.entity.DueDateTo = new Date(params.entity.DueDateTo);
			}
			$scope.entity = params.entity ?? {};
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsProduct = params.optionsProduct;
			$scope.optionsBuyer = params.optionsBuyer;
			$scope.optionsTrader = params.optionsTrader;
			$scope.optionsUoM = params.optionsUoM;
			$scope.optionsCurrencyCode = params.optionsCurrencyCode;
			$scope.optionsCountry = params.optionsCountry;
			$scope.optionsRequestStatus = params.optionsRequestStatus;
		}

		$scope.filter = function () {
			let entity = $scope.entity;
			const filter = {
				$filter: {
					equals: {
					},
					notEquals: {
					},
					contains: {
					},
					greaterThan: {
					},
					greaterThanOrEqual: {
					},
					lessThan: {
					},
					lessThanOrEqual: {
					}
				},
			};
			if (entity.Id !== undefined) {
				filter.$filter.equals.Id = entity.Id;
			}
			if (entity.Name) {
				filter.$filter.contains.Name = entity.Name;
			}
			if (entity.DateFrom) {
				filter.$filter.greaterThanOrEqual.Date = entity.DateFrom;
			}
			if (entity.DateTo) {
				filter.$filter.lessThanOrEqual.Date = entity.DateTo;
			}
			if (entity.DueDateFrom) {
				filter.$filter.greaterThanOrEqual.DueDate = entity.DueDateFrom;
			}
			if (entity.DueDateTo) {
				filter.$filter.lessThanOrEqual.DueDate = entity.DueDateTo;
			}
			if (entity.Quantity !== undefined) {
				filter.$filter.equals.Quantity = entity.Quantity;
			}
			if (entity.Price !== undefined) {
				filter.$filter.equals.Price = entity.Price;
			}
			if (entity.Total !== undefined) {
				filter.$filter.equals.Total = entity.Total;
			}
			if (entity.Location) {
				filter.$filter.contains.Location = entity.Location;
			}
			if (entity.Product !== undefined) {
				filter.$filter.equals.Product = entity.Product;
			}
			if (entity.Buyer !== undefined) {
				filter.$filter.equals.Buyer = entity.Buyer;
			}
			if (entity.Trader !== undefined) {
				filter.$filter.equals.Trader = entity.Trader;
			}
			if (entity.UoM !== undefined) {
				filter.$filter.equals.UoM = entity.UoM;
			}
			if (entity.CurrencyCode) {
				filter.$filter.contains.CurrencyCode = entity.CurrencyCode;
			}
			if (entity.Country !== undefined) {
				filter.$filter.equals.Country = entity.Country;
			}
			if (entity.RequestStatus !== undefined) {
				filter.$filter.equals.RequestStatus = entity.RequestStatus;
			}
			messageHub.postMessage("entitySearch", {
				entity: entity,
				filter: filter
			});
			messageHub.postMessage("clearDetails");
			$scope.cancel();
		};

		$scope.resetFilter = function () {
			$scope.entity = {};
			$scope.filter();
		};

		$scope.cancel = function () {
			messageHub.closeDialogWindow("Request-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);