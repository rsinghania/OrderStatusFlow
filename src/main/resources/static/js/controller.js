app.controller('usersController', function($scope) {
	$scope.headingTitle = "User List";
});

app.controller('rolesController', function($scope) {
	$scope.headingTitle = "Roles List";
});

app.controller('hotelController', function($scope, $resource, $http) {
	$scope.headingTitle = "hotel List";

	$scope.btnStage = 0;
	$scope.totalOrderCount=0;
	$scope.preparingOrderCount=0;
	$scope.preparedOrderCount=0;
	$scope.deliveredOrderCount=0;
	$scope.orderData ='';
	
	$scope.doPoll =function(){
	    $.get('/latestOrders', function(data) {
	        //alert(data);  // process results here
	    	$scope.orderData=data;
	        //setTimeout($scope.doPoll,30000);
	    });
	};
	
	$scope.totalOrders= function () {
		$scope.totalOrderCount = $('.allOrders').length;
		$("#order-count").text($scope.totalOrderCount); 
	};
	
	$scope.getOrderStatus= function () {
	    if ($scope.btnStage==0) {
	        return 'btn btn-danger proceedOrder';
	    } else if ($scope.btnStage==1) { 
	    	$("#preparing button" ).removeClass("btn btn-danger").addClass('btn btn-warning');
	    } else if ($scope.btnStage==2) {
	    	$("#prepared button" ).removeClass("btn btn-warning").addClass('btn btn-primary');
	    }else{
	    	$("#delivered button" ).removeClass("btn btn-primary").addClass('btn btn-success');
	    }
	};
	
	$scope.orderButtonClicked = function() {

		//order palce to preparing
		if ($scope.btnStage == 0) {

			$("#order-count").html($scope.totalOrderCount-1);
			$("#preparing-count").html($scope.preparingOrderCount+1);
			$scope.preparingOrderCount=$scope.preparingOrderCount+1;
			
			$("#preparing").html($("#orderPlaced").html());
			//binding 
			$('#preparing').on('click', 'button', function () {
				$scope.orderButtonClicked();
	        });
			$("#orderPlaced").html('');
			$scope.btnStage = 1;
			
		
		}
		//preparing to prepared

		else if ($scope.btnStage == 1) {
			
			$("#preparing-count").html($scope.preparingOrderCount-1);
			$("#prepared-count").html($scope.preparedOrderCount+1);
			$scope.preparedOrderCount=$scope.preparedOrderCount+1;
			$("#prepared").html($("#preparing").html());
			//binding 
			$('#prepared').on('click', 'button', function () {
				$scope.orderButtonClicked();
	        });

			
			$("#preparing").html('');
			$scope.btnStage = 2;
			$scope.getOrderStatus();
		} 
		//prepared to delivered

		else if ($scope.btnStage == 2) {
			
			$("#prepared-count").html($scope.preparedOrderCount-1);
			$("#delivered-count").html($scope.deliveredOrderCount+1);
			$scope.deliveredOrderCount=$scope.deliveredOrderCount+1;
			$("#delivered").html($("#prepared").html());
			//binding 
			$('#delivered').on('click', 'button', function () {
				$scope.orderButtonClicked();
	        });
			$("#prepared").html('');
			$scope.btnStage = 3;
			document.querySelector('.proceedOrder');
			
			$("#delivered").removeClass("deliveryPending").addClass('deliveryComplete');
				
			$scope.getOrderStatus();
		}
	}

});
