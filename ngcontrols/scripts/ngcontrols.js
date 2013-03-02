/*
 * ngControls build 0.0.0
 * Licensed under GPLv3
 * Author: Milosz Lewandowski
 */

// ngControls namespace
var NG$C = {};

// ngControls Angular module.
// Use ng-app="controls" to bind to the controls module.
NG$C.Controls = angular.module("controls", []);

// <tabs>
NG$C.Controls.directive("tabs", function() {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {},
        controller: function($scope, $element) {
            var panes = $scope.panes = [];

            $scope.select = function(pane) {
                angular.forEach(panes, function(pane) {
                    pane.selected = false;
                });
                pane.selected = true;
            };

            this.select = $scope.select;

            this.addPane = function(pane) {
                if (panes.length == 0) $scope.select(pane);
                panes.push(pane);
            };

        },
        template:
            '<div class="ng-tabs">'+
            '    <ul class="ng-nav">'+
            '        <li class="ng-nav-item" ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
            '            <a href="" ng-click="select(pane)">{{pane.title}}</a>'+
            '        </li>'+
            '    </ul>'+
            '    <div class="ng-content" ng-transclude></div>'+
            '</div>'
    };
});

// <tabs><pane>
NG$C.Controls.directive("pane", function() {
    return {
        require: "^tabs",
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {title: "@"},
        link: function($scope, $element, $attrs, tabs) {
            var pane = $scope;
            tabs.addPane(pane);
            if ($attrs.open === "true") {
                tabs.select(pane);
            }
        },
        template:
            '<div class="ng-pane" ng-class="{active: selected}">'+
            '    <div class="ng-inner" ng-transclude>'+
            '    </div>'+
            '</div>'
    };
});


// <accordion>

NG$C.Controls.directive("accordion", function() {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {},
        controller: function($scope, $element, $attrs) {
            var foldingItems = $scope.foldingItems = [];

            this.select = function(foldingItem) {
                var current = foldingItem;
                angular.forEach(foldingItems, function(foldingItem) {
                    if (foldingItem != current) {
                        foldingItem.set(false);
                    }
                });
                current.turn();
            };

            this.addFoldingItem = function(foldingItem) {
                foldingItems.push(foldingItem);
            };
        },
        template:
            '<div class="ng-accordion" ng-transclude></div>'
    }
});

// <folding-item>
NG$C.Controls.directive("foldingItem", function() {
    return {
        require: "^?accordion",
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {title: "@", open: "@"},
        link: function($scope, $element, $attrs, accordion) {
            if (accordion) {
                $scope.accordion = accordion;
                $scope.accordion.addFoldingItem($scope);
            }
        },
        controller: function($scope, $element, $attrs) {
            var that = this;

            $scope.selected = ($attrs.open === "true");
            
            $scope.select = function() {
                if ($scope.accordion !== undefined) {
                    $scope.accordion.select($scope);
                } else {
                    $scope.turn();
                }
            }
            
            $scope.set = function(status) {
                $scope.selected = status;
            }

            $scope.turn = function() {
                $scope.set(!$scope.selected);
            }
        },
        template:
            '<div class="ng-folding-item">'+
            '    <a href="" class="ng-title" ng-class="{active:selected}" ng-click="select()">{{title}}</a>'+
            '    <div class="ng-content" ng-class="{active:selected}"><div class="ng-inner" ng-transclude></div></div>'+
            '</div>'
    };
});


// <list>

// <tabs>
NG$C.Controls.directive("list", function() {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {clickable: "@"},
        controller: function($scope, $element, $attrs) {
            this.clickable = $attrs.clickable;
        },
        template:
            '<ul class="ng-list" ng-transclude>'+
            '</ul>'
    };
});

// <tabs><pane>
NG$C.Controls.directive("item", function() {
    return {
        require: "^list",
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {clickable: "@", href: "@"},
        link: function($scope, $element, $attrs, list) {
            if ($attrs.clickable === undefined && 
                (list.clickable === "true" || 
                list.clickable === "false")) {
                $attrs.clickable = list.clickable;
            }
        },
        template:
            '<ng-switch on="clickable">'+
            '   <li ng-switch-when="true" class="ng-item clickable">'+
            '       <a class="ng-a" ng-transclude href="{{href}}"></a>'+
            '   </li>'+
            '   <li ng-switch-default class="ng-item unclickable" ng-transclude>'+
            '   </li>'+
            '</ng-switch>'
    };
});