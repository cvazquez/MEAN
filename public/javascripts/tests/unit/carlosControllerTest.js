'use strict';

describe('CarlosController', function() {
  beforeEach(module('carlosApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.sections', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('CarlosController', { $scope: $scope });
    });

    it('it returns the length of sections', function() {
     
      expect($scope.sections.length).toEqual(4);
    });


  });
});