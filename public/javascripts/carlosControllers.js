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

  var carlosApp = angular.module("carlosApp", []),
      returnData = {};

  carlosApp.controller("CarlosController", function ($scope, $http) {
    var createSectionsHTML = "";

    $scope.sections = "";
    $scope.sectionsHTTP = "";


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

          createSectionsHTML += '<li class="section"><a href="'
                                + $scope.sectionsHTTP[key].link + '"> '
                                + $scope.sectionsHTTP[key].name + '</a></b><br>'
                                + $scope.sectionsHTTP[key].description + '</li>';
        });
        createSectionsHTML += "</ol>";

        //Update view with HTML'd sections
        document.getElementById("sectionsHTTP").innerHTML = createSectionsHTML;
        document.getElementById("sectionsLength").innerHTML = $scope.sectionsHTTP.length;
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

    $scope.stock  = {
      name      : '',
      symbol    : '',
      lastPrice : '',
      exchange  : ''
    }

    window.onload = function() {
        document.getElementById("stockSymbol").focus();
    }

    // Retrieve the latest stock symbol queries by all users
    /* ;(function() {
      var getClientData = "/stocks/api/clientdata";

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
    })(); */

    $scope.stockSymbolLookup = function(){
        let stockAPIURLs = {};


        // Accepts either the stock name or symbol, and returns the stock name, symbol and exchange.
        // https://iexcloud.io/docs/api/
        ;(function(data){
          $http(
            {
              url:  'https://cloud.iexapis.com/stable/stock/'
                    + $scope.stockQuery
                    + '/batch?types=quote&range=1m&last=10&token=sk_011af741118b4fb7851034a7160fafe2',
              method: 'GET',
              cache: true
           }).
              success(function(data, status, headers, config) {
                //returnData.data;
                var callbackData = {
                  name      : data.quote.companyName,
                  symbol    : data.quote.symbol,
                  lastPrice : data.quote.latestPrice,
                  exchange  : data.quote.primaryExchange
                };

                $scope.stock = callbackData;

                SetPriceCallback(callbackData);
              }).
            error(function(data, status, headers, config) {
              console.log("error")
              console.log(data)
              console.log(status)
              console.log(headers)
              console.log(config)
            });

        })();


        /* This is the callback for PriceCallback
            The price will be saved to a database, and used to be display as a history of stock lookups
        */
        function SetPriceCallback(data) {

          //$scope.stock.lastPrice = data.LastPrice;

          // Store the users network/location information and the stock price, then retrieve it and redisplay in the Stock History sections
          $http.get("/stocks/api/clientdata/" + data.LastPrice + "/" + data.symbol)
            .success(function(data, status, headers, config){
                if(typeof data.errorMessage === "defined"){
                  alert(date.errorMessage);
                   return;
                }

                console.log("ClientData");
                console.log(data);

                // Display in the Stock History section
                $scope.clientData = data;
              }).error(function(data, status, headers, config){
                console.log("error - SetPriceCallback")
                console.log(data)
                console.log(status)
                console.log(headers)
                console.log(config)
            });
        };
    }
  }); // End StockController

    return returnData;

})();