(function() {
    var app = angular.module('boggle', [])
    app.controller('AppController', ['$scope', function($scope){

       /* alert('this alert');*/
        $scope.lumen_options =[555,500,55,84984];
        $scope.current_lumens= 55;
        $scope.cur_cost = 13;
        $scope.cur_hours=4;
        $scope.total_days=365;
        $scope.alphabet =['a','b','c','d','e'];
    }]);

} ) ();

