/**
 * Created by ivsi on 9/2/2015.
 */

var app = angular.module('myApp', []);

app.controller("AppController", function ($scope, $http, $interval) {

    $scope.tws = [];
    var feedArray = [];
    var counter = 0;

    function tw(id, tweet) {
        this.id = counter;
        this.tweet = tweet;
    }

    $interval(function getNewDataAndAppendToFeedArray() {
        $http.get('http://192.168.184.58:8080/api/oldestRm/5').
            success(function (data) {
                feedArray = feedArray.concat(data);
            }).
            error(function error() {
                console.log("No connection");
            });
    }, 5000);

    $interval(function animate() {
        if (feedArray.length === 0) {
            return;
        }
        if ($scope.tws.length > 0) {
            var i = 0;
            var tweetToAdd = new tw(i, feedArray[0]);
            feedArray.shift();
            if (!(containsTweet($scope.tws, tweetToAdd))) {
                $scope.tws.push(tweetToAdd);
                for (; i < $scope.tws.length - 1; ++i) {
                    $scope.tws[i].id = $scope.tws[i].id + 1;
                    if ($scope.tws[i].id > 6) {
                        $scope.tws[i].id = 0;
                        $scope.tws.shift();
                    }
                }
            }
        }
        else {
            $scope.tws.push(new tw(0, feedArray[0]));
            feedArray.shift();
        }
    }, 5000);

    function containsTweet(array, twObject) {
        var found = false;
        for (var i = 0; i < array.length; i++) {
            if (array[i].tweet == twObject.tweet) {
                found = true;
                break;
            }
        }
        return found;
    }
});


