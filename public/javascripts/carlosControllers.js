'use strict';

//onerror = handleErr;
var txt = "";

function handleErr(msg, url, l) {

  txt = "There was an error on this page.\n\n";
  txt += "Error: " + msg + "\n";
  txt += "URL: " + url + "\n";
  txt += "Line: " + l + "\n\n";
  txt += "Click OK to continue.\n\n";
  alert(txt);

  return true;
}


// ******************************* Angular Portion of JS ***********************


var carlosAppClosure = (function(){

  var carlosApp = angular.module("carlosApp", []);
  var returnData = {};


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



  carlosApp.controller("StockController", function ($scope, $http) {
   
    window.onload = function() {
        document.getElementById("stockSymbol").focus();
    }


    function GetClientData(){
      var getClientData = "/stocks/api/clientdata";

        // Retrieve the latest stock symbol queries by all users
        $http.get(getClientData).success(function(data, status, headers, config){
              if(typeof data.errorMessage === "defined"){
                alert(date.errorMessage);
                 return; 
              }

              console.log("ClientData");
              console.log(data);

              if(data.length > 0){
                // Display in the Stock History section
                $scope.clientData = data;  
              }
              
            }).error(function(data, status, headers, config){
          });
    }

    GetClientData();




    //Autocomplete the stock symbol and name, based on a keypress event
    $scope.stockSynbolAutoComplete = function(){
      //console.log($scope.stockQuery);


      returnData.MarkItOnDemandAutoComplete = function(data){
        console.log(data);
      };

      var MarkItOnDemandAutoCompleteLookup = function(data){

          var markitOnDemandAPIURL = 'http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input=' + $scope.stockQuery + '&callback=carlosAppClosure.MarkItOnDemandAutoComplete';

          $http.jsonp(markitOnDemandAPIURL).
              success(function(data, status, headers, config) {
                  //console.log(data);
                
              }).
            error(function(data, status, headers, config) {
            });

          
        };

        MarkItOnDemandAutoCompleteLookup();
    }


    $scope.stockSymbolLookup = function(){
      //http://dev.markitondemand.com/#doc_lookup

        var stockAPIURLs = {};


        // Accepts either the stock name or symbol, and returns the stock name, symbol and exchange. Then calls MarketOnDemandPrice to get the other information
        var MarkItOnDemandLookup = function(data){
        var markitOnDemandAPIURL = 'http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input=' + $scope.stockQuery + '&callback=carlosAppClosure.MarkItOnDemandPriceCallback';
        

          $http.jsonp(markitOnDemandAPIURL).
              success(function(data, status, headers, config) {                
              }).
            error(function(data, status, headers, config) {
            });

        };
      
      
        // THis is the second call to retrieve the stocks price and other information
        returnData.MarkItOnDemandPriceCallback = function(data){
            var markitOnDemandFullAPIURL = 'http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=' + data[0].Symbol + '&callback=carlosAppClosure.MarkItOnDemandSetPriceCallback';

            // Set these values obtained from the MarketOnDemandLookup call
            $scope.stock = {};
            $scope.stock.symbol = data[0].Symbol;
            $scope.stock.name = data[0].Name;
            $scope.stock.exchange = data[0].Exchange;

            // Call to get the price and other information
            $http.jsonp(markitOnDemandFullAPIURL).
              success(function(data, status, headers, config) {
              }).
             error(function(data, status, headers, config) {});
            
          };


        /* This is the callback for MarkItOnDemandPriceCallback
            The price will be saved to a database, and used to be display as a history of stock lookups 
        */
        returnData.MarkItOnDemandSetPriceCallback = function(data){
          var getClientData = "/stocks/api/clientdata/" + data.LastPrice + "/" + $scope.stock.symbol;
          $scope.stock.lastPrice = data.LastPrice;

          // Store the users network/location information and the stock price, then retrieve it and redisplay in the Stock History sections
          $http.get(getClientData).success(function(data, status, headers, config){
                if(typeof data.errorMessage === "defined"){
                  alert(date.errorMessage);
                   return; 
                }

                console.log("ClientData");
                console.log(data);

                // Display in the Stock History section
                $scope.clientData = data;
              }).error(function(data, status, headers, config){
            });
          
          /*
          $http.post(getClientData, {stockInfo:$scope.stock}).
              then(function(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("ClientData");
                console.log(response);
                $scope.clientData = response;
              }, function(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
        */
        };

        
        // Call to retieve the Name and Symbol, if either the nane or symbol was entered
        MarkItOnDemandLookup();



        var yahooImplementation = function(data){
          var yahooStockAPIURL = 'http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=' + $scope.stockQuery + '&callback=YAHOO.Finance.SymbolSuggest.ssCallback';
          

          // Call to get the price and other information
            $http.jsonp(yahooStockAPIURL).
              success(function(data, status, headers, config) {

              }).
             error(function(data, status, headers, config) {});  
             
        }// End yahooImplementation


        //yahooImplementation();
        
          
    }
  }); // End StockController

    // If using the yahoo API
    returnData.YAHOO = {
        Finance: {
            SymbolSuggest: {
                ssCallback: function(r) {
                    console.log("Yahoo Result: ");
                    console.log(r);
                }
            }
        }
    }
    return returnData;

})();

var YAHOO = carlosAppClosure.YAHOO;