app.controller('usersController', function($scope) {
	$scope.headingTitle = "User List";
});

app.controller('rolesController', function($scope) {
	$scope.headingTitle = "Roles List";
});


app.controller('hotelController', function($scope, $resource, $http,
		$rootScope, $templateCache) {
	$scope.headingTitle = "hotel List";

	$scope.btnStage = 0;
	$scope.totalOrderCount = 0;
	$scope.preparingOrderCount = 0;
	$scope.preparedOrderCount = 0;
	$scope.deliveredOrderCount = 0;
	$scope.orderData = '';

	$scope.doPoll = function() {
		$.get('/latestOrders', function(data) {
			// alert(data); // process results here
			$scope.orderData = data;
			$scope.createOrder(data,$scope);
			setTimeout($scope.doPoll, 10000);
			$scope.totalOrders();
		});
	};

	$scope.createOrder = function(data,$scope) {

		var html = $(".orderTable");

		html+="<tr id='orderNumber_" + data[0].orderId+ "' class='allOrders'>";
		html+="<td scope='row' id='orderPlaced_" + data[0].orderId+ "'>";
		html+="<button type='button' orderId= " + data[0].orderId+ " class='btn btn-danger proceedOrder'";
		html+="ng-Click='orderButtonClicked(this)'>";
		html+="<table class='ng-scope'>";
		html+="<tbody>";
		html+="<tr>";
		html+="<th>Item Name</th>";
		html+="<th>Quantity</th>";
		html+="</tr>";
		html+="<tr'>";

		for (var i = 0; i < data[0].items.length; i++) {
			html+="<td>" + data[0].items[i].itemName + "</td>";
			html+="<td>" + data[0].items[i].itemQuantity + "</td></tr>";
		}
		
		html+="</tbody>" + "</table>" + "</button>" +"</td>";
		html+="<td id='preparing_" + data[0].orderId+ "'></td>" + "	<td id='prepared_" + data[0].orderId+ "'></td>	";
		html+="<td id='delivered_" + data[0].orderId+ "'></td>" + "</tr>";

		$(".orderTable").append(html);

		// binding
		$('#orderNumber_'+data[0].orderId).on('click', 'button', function() {
			$scope.orderButtonClicked(this);
		});
	}

	$scope.totalOrders = function() {
		$scope.totalOrderCount = $('.allOrders').length;
		$("#order-count").text($scope.totalOrderCount);
	};

	$scope.getOrderStatus = function(order) {
		if (order.btnStage == 0) {
			return 'btn btn-danger proceedOrder';
		} else if (order.btnStage == 1) {
			$("#preparing_" + order.orderId+ " button").removeClass("btn btn-danger").addClass(
					'btn btn-warning');
		} else if (order.btnStage == 2) {
			$("#prepared_" + order.orderId+ " button").removeClass("btn btn-warning").addClass(
					'btn btn-primary');
		} else {
			$("#delivered_" + order.orderId+ " button").removeClass("btn btn-primary").addClass(
					'btn btn-success');
		}
	};

	$scope.findOrder =function(event,$rootScope){
		var order={};
		var orderDetails={};
		var orderId=event.attributes.orderid.value;
		if($rootScope.orderState.length>=1){
			orderDetails=angular.forEach($rootScope.orderState, function(value, key) {
				if(orderId==value.orderId){
					//order.id=value.orderId;
					//order.btnStage=value.btnStage;
					return value;
				}
				});
			return orderDetails[0];
		}else{
			order.orderId=event.attributes.orderid.value;
			order.btnStage=0;
			return order;
		}
	}
	
	$scope.orderButtonClicked = function(event) {

		// order palce to preparing
		if($rootScope.orderState==undefined){
			$rootScope.orderState=[];	
		}
		
		var orderId=event.attributes.orderid.value;
		var order ={};
		order = $scope.findOrder(event,$rootScope);
		
		if (order.btnStage == 0) {

			$("#order-count").html($scope.totalOrderCount - 1);
			$("#preparing-count").html($scope.preparingOrderCount + 1);
			$scope.preparingOrderCount = $scope.preparingOrderCount + 1;

			$("#preparing_" + order.orderId+ "").html($("#orderPlaced_" + order.orderId+ "").html());
			// binding
			$('#preparing').on('click', 'button', function() {
				$scope.orderButtonClicked();
			});
			$("#orderPlaced_" + order.orderId+ "").html('');
			order.btnStage = 1;
			$scope.getOrderStatus(order);

		}
		// preparing to prepared

		else if (order.btnStage == 1) {

			$("#preparing-count").html($scope.preparingOrderCount - 1);
			$("#prepared-count").html($scope.preparedOrderCount + 1);
			$scope.preparedOrderCount = $scope.preparedOrderCount + 1;
			$("#prepared_" + order.orderId+ "").html($("#preparing_" + order.orderId+ "").html());
			// binding
			$('#prepared').on('click', 'button', function() {
				$scope.orderButtonClicked();
			});

			$("#preparing_" + order.orderId+ "").html('');
			order.btnStage = 2;
			$scope.getOrderStatus(order);
		}
		// prepared to delivered

		else if (order.btnStage == 2) {

			$("#prepared-count").html($scope.preparedOrderCount - 1);
			$("#delivered-count").html($scope.deliveredOrderCount + 1);
			$scope.deliveredOrderCount = $scope.deliveredOrderCount + 1;
			$("#delivered_" + order.orderId+ "").html($("#prepared_" + order.orderId+ "").html());
			//binding 
			$('#delivered').on('click', 'button', function() {
				$scope.orderButtonClicked();
			});
			$("#prepared_" + order.orderId+ "").html('');
			order.btnStage = 3;

			$("#delivered_" + order.orderId+ "").removeClass("deliveryPending").addClass(
					'deliveryComplete');

			$scope.getOrderStatus(order);
		}

		$rootScope.orderState.push(order);

	}

});
