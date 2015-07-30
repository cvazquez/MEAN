'use strict';


// ******************************* Angular Portion of JS ***********************

var carlosApp = angular.module("carlosApp", []);


carlosApp.controller("CarlosController", function ($scope, $http) {
        var createSectionsHTML = "";


          $scope.sections = "";
          $scope.sectionsHTTP = "";
          //$scope.sectionsHTTP2 = ajaxServices.getSections();


        // Make an http call to Node.js, that will return the same sections arrary of objects
        // https://docs.angularjs.org/api/ng/service/$http
        
        $http.get('/angular/sections').
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.sectionsHTTP = data.sections;
            $scope.sectionsHTTPngRepeat = data.sections;


            // Loop through Array of Section Objects and Create an html list
            createSectionsHTML += "<ol>";
            angular.forEach($scope.sectionsHTTP, function(value, key) {              
              
              createSectionsHTML += '<li class="section"><a href="' + $scope.sectionsHTTP[key].link + '"> ' + $scope.sectionsHTTP[key].name + '</a></b><br>';
              createSectionsHTML += $scope.sectionsHTTP[key].description + '</li>';

              //console.log(key + ': ' + value);
              //console.log($scope.sectionsHTTP[key].name);
              //console.log($scope.sectionsHTTP[key].description);
              //console.log($scope.sectionsHTTP[key].link);

            });
            createSectionsHTML += "</ol>";

            //Update view with HTML'd sections
            document.getElementById("sectionsHTTP").innerHTML = createSectionsHTML;
            document.getElementById("sectionsLength").innerHTML = $scope.sectionsHTTP.length;

            //console.log(data);
            //console.log($scope.sectionsHTTP.length);

          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert("Get of angular sections returned error: " + status);
          });
          

          // Hard Coded Sections
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

      });



carlosApp.factory('ajaxServices',  function ($http, $q) { 

      return {
          getSections : function () {
              var deferred = $q.defer();

              // http://192.168.11.14:3000/angular/sections
              $http.get('/angular/sections', { data: {} }).success(function(data) {
                    // this callback will be called asynchronously
                    // when the response is available

                    //$scope.sectionsHTTP2 = data.sections; 

                    /*
                    if (window.console && console.log) {
                      console.log("data.sections.length: " + data.sections.length);
                      console.log(data.sections);

                      angular.forEach(data.sections, function(value, key) {
                          console.log('Deferred name: ' + data.sections[key].name);
                          console.log('Deferred description: ' + data.sections[key].description);
                          console.log('Deferred link: ' + data.sections[key].link);


                      });
                    }*/
                  
                    deferred.resolve(data);
                });
              return deferred.promise;
            
        }
    }
});


carlosApp.controller("StockController", function ($scope, $http) {
  $scope.stockSymbolLookup = function(){
    //console.log($scope.stockSymbol);

    // http://stackoverflow.com/questions/31420763/angular-jsonp-yahoo-finance-symbolsuggest
    //var stockAPIURL = 'http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=' + $scope.stockSymbol + '&callback=YAHOO.Finance.SymbolSuggest.ssCallback';

    //http://dev.markitondemand.com/#doc_lookup
    var markitOnDemandAPIURL = 'http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input=' + $scope.stockQuery + '&callback=MarkItOnDemand';

   
    MarkItOnDemand = function(data){
          var markitOnDemandFullAPIURL = 'http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=' + data[0].Symbol + '&callback=MarkItOnDemandFull';

          $http.jsonp(markitOnDemandFullAPIURL).
            success(function(data, status, headers, config) {
            }).
           error(function(data, status, headers, config) {});


          $scope.stock = {};
          $scope.stock.symbol = data[0].Symbol;
          $scope.stock.name = data[0].Name;
          $scope.stock.exchange = data[0].Exchange;


        };    

    MarkItOnDemandFull = function(data){

          $scope.stock.lastPrice = data.LastPrice;
        };

    //http://fdietz.github.io/recipes-with-angular-js//consuming-external-services/consuming-jsonp-apis.html


        $http.jsonp(markitOnDemandAPIURL).
          success(function(data, status, headers, config) {
          }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          //console.log("error:" + status);
        });

      /*
      $http.jsonp('http://finance.google.com/finance/info?client=ig&q=NASDAQ%3a' + $scope.stockSymbol + '&callback=JSON_CALLBACK').
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(data);


          }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log("error:" + data);
        });
        */        
        
  }
});


var MarkItOnDemand, MarkItOnDemandFull;

// If using the yahoo API
var YAHOO = {
    Finance: {
        SymbolSuggest: {
            ssCallback: function(r) {
                console.log("Yahoo Result: ");
                console.log(r);
            }
        }
    }
}