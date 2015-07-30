'use strict';


// ******************************* Angular Portion of JS ***********************

// Using Explicit Annotation, which allows us to minify: https://docs.angularjs.org/error/$injector/strictdi
// http://bartwullems.blogspot.com/2014/10/angularjs-13-ng-strict-di-directive.html
// https://docs.angularjs.org/guide/di


/*carlosApp.factory('ajaxServices', function ($http) {
         return {
            getProjects : function () {
                return $http.get('/angular/sections', { data: {} })           
            }
         }       
      });
*/

var CarlosApp = (function(){

      // GoodController1 can be invoked because it
        // had an $inject property, which is an array
        // containing the dependency names to be
        // injected.
      CarlosController.$inject = ["$scope", "$http", "$filter"];
      var carlosApp = angular.module("carlosApp", []);
      carlosApp.controller("CarlosController", CarlosController);


      carlosApp.factory('ajaxServices',  function ($http, $q) { 

            return {
                getSections : function () {
                    var deferred = $q.defer();


                    $http.get('/angular/sections', { data: {} }).success(function(data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          $scope.sectionsHTTP2 = data.sections; 

                          if (window.console && console.log) {
                            console.log("objects returned: " + data.length);
                            console.log("sectionsHTTP2 returned: " + $scope.sectionsHTTP2);
                          }
                        
                          deferred.resolve(data);
                        
                    return deferred.promise;
                })}}});




      function CarlosController($scope, $http, ajaxServices) {

          $scope.sections = "";
          $scope.sectionsHTTP = "";
         // $scope.sectionsHTTP2 = ajaxServices.getSections();

          var createSectionsHTML = "";

          /*ajaxServices.getProjects().success(function (data) {
                if (window.console && console.log) {
                    console.log("objects returned: " + data.length);
                }                          
                $scope.projects = data
            });
        */

        // Make an http call to Node.js, that will return the same sections arrary of objects
        // https://docs.angularjs.org/api/ng/service/$http
        $http.get('/angular/sections').
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.sectionsHTTP = data.sections;            

            // Loop through Array of Section Objects
            angular.forEach($scope.sectionsHTTP, function(value, key) {
              
              createSectionsHTML += "<p>";
              createSectionsHTML += '<b><a href="' + $scope.sectionsHTTP[key].link + '"> ' + $scope.sectionsHTTP[key].name + '</a></b><br>';
              createSectionsHTML += $scope.sectionsHTTP[key].description + '</p>';

              console.log(key + ': ' + value);
              console.log($scope.sectionsHTTP[key].name);
              console.log($scope.sectionsHTTP[key].description);
              console.log($scope.sectionsHTTP[key].link);



              /*angular.forEach($scope.sectionsHTTP[key].value, function(value2, key2) {
                  console.log(key2 + ': ' + value2);
              });*/
            });

            document.getElementById("sectionsHTTP").innerHTML = createSectionsHTML;
            document.getElementById("sectionsLength").innerHTML = $scope.sectionsHTTP.length;

            console.log(data);
            console.log($scope.sectionsHTTP.length);

          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert("Get of angular sections returned error: " + status);
          });


        /*
        $scope.sections = [
              { name: "Stocks",
                description: "Retrieve stock quotes from a 3rd party API call",
                link: "/stocks"
              },
              { name: "Running",
                description: "Retrieve history of running mileage.",
                link: "/running"
              },
              {
                name: "Turing Omnibus",
                description: "Work out examples in Turning Omnibus book.",
                link: "/turing-omnibus"
              },
              {
                name: "Algorithms",
                description: "Work out examples in Introduction to Computing and Algorithms book.",
                link: "/algorithms"
              }
            ];
          */  
      }


      

      return true;

})();



/* // Non-strict method
var carlosApp = angular.module('carlosApp', []);

carlosApp.controller('CarlosController', function ($scope) {
  $scope.sections = [
  			{	name: "Stocks",
  				description: "Retrieve stock quotes from a 3rd party API call",
  				link: "/stocks"
  			},
  			{	name: "Running",
  				description: "Retrieve history of running mileage.",
  				link: "/running"
  			},
  			{
  				name: "Turing Omnibus",
  				description: "Work out examples in Turning Omnibus book.",
  				link: "/turing-omnibus"
  			},
  			{
  				name: "Algorithms",
  				description: "Work out examples in Introduction to Computing and Algorithms book.",
  				link: "/algorithms"
  			}
  		];

  });
*/

// To change the angular symbols used, to prevent conflict with handlebars
// http://stackoverflow.com/questions/13671701/angularjs-twig-conflict-with-double-curly-braces
//app.config(function($interpolateProvider){
    //$interpolateProvider.startSymbol('[[').endSymbol(']]')});