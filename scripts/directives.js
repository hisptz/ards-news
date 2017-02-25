'use strict';

/* Directives */

var homeDirectives = angular.module('newsDirectives', []);

homeDirectives.directive("homeRightMenu", ['homeService',function(homeService){
    return {
        restrict: "E",
        replace: true,
        scope: {
            messageObject: "=messageObject",
            chartObject: "=chartObject"
        },
        templateUrl: "views/directives/home_right_menu.html",
        link: function($scope, element, attrs) {
            $scope.errors  = false;
            $scope.errorsThree  = false;
            $scope.errorSms  = false;
            $scope.chartBaseUrl = dhis2.settings.baseUrl;


            $scope.$watch('messageObject', function(newmessageObject, oldmessageObject){

                $scope.messages = newmessageObject;
                if(!$scope.messages){
                    $scope.errorSms = true;
                }
            }, true);

            $scope.$watch('chartObject', function(newChartObject, oldChartObject){
                if(typeof newChartObject != "undefined"){

                }
            }, true);


            $scope.checkStatus = function( messages ) {
                var status = true;
                var messageLength = 0;
                if(messages){
                    messageLength = messages.length;
                }


                if(messageLength==1){
                    if(messages[0].hidden){
                        return false;
                    }
                }if(messageLength==0){
                    return false;
                }else{
                    var test = 0;
                    angular.forEach(messages,function(valueS,indexS){
                        if(valueS.hidden){
                            test++;
                        }
                    })

                    if(test==2){
                        return false;
                    }
                }



                return status;
            }


        }
    };
}]);

homeDirectives.directive("homeLeftMenu", ['homeService','utilityService','$location',function(homeService,utilityService,$location){
    return {
        restrict: "E",
        replace: true,
        scope: {
            reportTables: "=reportTables",
            documentObject: "=documentObject",
            tab: "=tabs",
            menu: "=menu",
            favourite: "=favourite"
        },
        templateUrl: "views/directives/home_left_menu.html",
        link: function($scope, element, attrs) {
            $scope.error  = false;
            $scope.errorMessage  = "no document found";



            $scope.openTab = {};
            $scope.openChildTab = {};
            $scope.statusClass = {};
            $scope.openTab['analysis'] = true;
            $scope.openAccordion = function(parentElement,childElement){

                if ( !$scope.openTab[parentElement] ) {
                    $scope.openTab = {};
                    $scope.statusClass = {};
                    $scope.openTab[parentElement] = true;
                    $scope.statusClass[$scope.favourite] = "alert-success";
                }

                if ( !$scope.openChildTab[childElement] && childElement != "" ) {
                    $scope.openChildTab = {};
                    $scope.statusClass = {};
                    $scope.openChildTab[childElement] = true;
                    $scope.statusClass[$scope.favourite] = "alert-success";
                    console.log(childElement);
                }

                $location.path('/'+parentElement+'/menu/'+childElement);
            }

            $scope.$watch($scope.tab,function(newTab,oldTab){
                $scope.openTab[$scope.tab] = true;
                $scope.openChildTab[$scope.menu] = true;
                $scope.statusClass[$scope.favourite] = "alert-success";
                //$location.path('/'+scope.tab+'/menu/'+scope.menu);
            });


            $scope.loadExternalLinks = function(){

                homeService.listExternalLink().then(function(response){
                    $scope.externalLinks = response;
                });
            }


            $scope.loadExternalLinks = function(){

                homeService.listExternalLink().then(function(response){
                    $scope.externalLinks = response;
                });
            }


            $scope.loadExternalLinks();

        }
    };
}]);

homeDirectives.directive("homeTabs", function(){
    return {
        restrict: "E",
        replace: true,
        scope: {
            currentTab: "=currentTab",
            tabObject: "=tabObject",
            tabContentObject: "=tabContentObject",
        },
        templateUrl: "views/directives/home_tabs.html",
        link: function($scope, element, attrs) {
            $scope.error  = false;
            $scope.errorMessage  = "no chart found";
            $scope.homeTabActiveClass = {};

            $scope.$watch('tabContentObject', function(newtabContentObject, oldtabContentObject){
                $scope.tabContents = newtabContentObject;
            }, true);

            $scope.$watch('tabObject', function(newtabObject, oldtabObject){

                if(newtabObject!=null){
                    $scope.tabs = orderTabs(newtabObject);
                    angular.forEach($scope.tabs,function(tab){
                        var name = tab.value.toLowerCase();
                        tab.name = name;
                        $scope.homeTabActiveClass[tab.value] = {active:""};
                        if(name==$scope.currentTab){
                            $scope.homeTabActiveClass[tab.value].active = "current";
                        }
                    })

                }


            }, true);



            $scope.toggleableTab = function(tabIndex,tab){
                angular.forEach($scope.tabs,function(tab){
                    $scope.activeClass[tab.value].active = "";

                })
                $scope.activeClass[tab.value].active = "current";
            }

            function orderTabs(tabArray){
                var tabs = []
                var tabs = [{value: "All",active:"current"}]
                angular.forEach(tabArray,function(value){
                    if(value=="All"){
                        tabs[0].value=value;
                    }

                    if(value=="Agriculture"){
                        tabs[1]={value: value,active:""};
                        if(tabs[0]==null){
                            tabs[0] = {value: "All",active:"current"}
                        }
                    }
                    if(value=="Livestock"){
                        tabs[2]={value: value,active:""};
                        if(tabs[1]==null){
                            tabs[1] = {value: "Agriculture",active:""}
                        }
                    }
                    if(value=="Fisheries"){
                        tabs[3]={value: value,active:""};
                        if(tabs[2]==null){
                            tabs[2] = {value: "Livestock",active:""}
                        }
                    }if(value=="Trade"){
                        tabs[4]={value: value,active:""};
                        if(tabs[3]==null){
                            tabs[3] = {value: "Fisheries",active:""}
                        }
                    }

                })

                return tabs;
            }


            $scope.switchPage = function(){
                window.location.href = '/demo/api/apps/cms/index.html';
            }


        }
    };
});

homeDirectives.directive("newsContainer", function($http){
    return {
        restrict: "E",
        replace: true,
        scope: {

        },
        templateUrl: "views/directives/news_container.html",
        link: function($scope, element, attrs) {
            $scope.feeds = null;
            var feedUrl = "https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Fwww.fao.org%2Fnews%2Fen%2F%3Fno_cache%3D1%26feed_id%3D16872%26key%3D33%26type%3D334"
            $http.get(feedUrl).then(function(data){
                if ( data.status == 200 )
                {
                    $scope.feeds =data.data;
                }
            },function(error){
                console.log(error);
            })

        }
    };
});
