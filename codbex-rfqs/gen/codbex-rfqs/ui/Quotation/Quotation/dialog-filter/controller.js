angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-rfqs.Quotation.Quotation';
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
			if (params?.entity?.ValidityDateFrom) {
				params.entity.ValidityDateFrom = new Date(params.entity.ValidityDateFrom);
			}
			if (params?.entity?.ValidityDateTo) {
				params.entity.ValidityDateTo = new Date(params.entity.ValidityDateTo);
			}
			$scope.entity = params.entity ?? {};
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
			if (entity.Request !== undefined) {
				filter.$filter.equals.Request = entity.Request;
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
			if (entity.ValidityDateFrom) {
				filter.$filter.greaterThanOrEqual.ValidityDate = entity.ValidityDateFrom;
			}
			if (entity.ValidityDateTo) {
				filter.$filter.lessThanOrEqual.ValidityDate = entity.ValidityDateTo;
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
			if (entity.Product !== undefined) {
				filter.$filter.equals.Product = entity.Product;
			}
			if (entity.UoM !== undefined) {
				filter.$filter.equals.UoM = entity.UoM;
			}
			if (entity.Currency) {
				filter.$filter.contains.Currency = entity.Currency;
			}
			if (entity.Supplier !== undefined) {
				filter.$filter.equals.Supplier = entity.Supplier;
			}
			if (entity.Trader !== undefined) {
				filter.$filter.equals.Trader = entity.Trader;
			}
			if (entity.Status !== undefined) {
				filter.$filter.equals.Status = entity.Status;
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
			messageHub.closeDialogWindow("Quotation-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);