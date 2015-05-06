var page = 1;

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('TimelineCtrl', function($scope, $http, $sce) {

  $scope.refreshTimeline = function() {
    $http.get('http://insekai.com/api/latest')
      .success(function(data) {
        for (var i = 0; i < data.length; i++) {
          data[i].timeago = moment(data[i].addtime, 'X', 'zh-cn').fromNow();
          data[i].avatar = avatar(data[i].email_hash);
        }
        $scope.timeline = data;
        page = 2;
      })
      .finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  };
  $scope.loadMore = function() {
    $http.get('http://insekai.com/api/latest?page=' + page)
      .success(function(data) {
        for (var i = 0; i < data.length; i++) {
          data[i].timeago = moment(data[i].addtime, 'X', 'zh-cn').fromNow();
          data[i].avatar = avatar(data[i].email_hash);
          data[i].content_rendered = $sce.trustAsHtml(data[i].content_rendered);
        }
        $scope.timeline = $scope.timeline ? $scope.timeline.concat(data) : data;
        page++;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.resize')
      });
  };



})

.controller('PlaylistCtrl', function($scope, $stateParams) {});

function avatar(hash, size) {
  size = size || 73;
  return 'http://gravatar.duoshuo.com/avatar/' + hash + '?s=' + size + '&d=retro&v=3';
}
