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
        link: function(scope, element, attrs, tabsCtrl) {
            tabsCtrl.addPane(scope);
        },
        template:
            '<div class="ng-pane" ng-class="{active: selected}" ng-transclude>'+
            '</div>'
    };
});


// <folding-item>
NG$C.Controls.directive("foldingitem", function() {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {title: "@"},
        controller: function($scope, $element) {
            $scope.selected = false;
            $scope.select = function() {
                $scope.selected = !$scope.selected;
            }
        },
        template:
            '<div class="ng-folding-item">'+
            '    <div class="ng-title" ng-class="{active:selected}" ng-click="select()">{{title}}</div>'+
            '    <div class="ng-content" ng-class="{active:selected}" ng-transclude></div>'+
            '</div>'
    };
});

NG$C.Controls.directive("content", function() {
    return {
        require: "^folding-item",
        restrict: "E",
        transclude: true,
        replace: true,
        template:
            '<div class="ng-inner" ng-transclude></div>'
    };
});