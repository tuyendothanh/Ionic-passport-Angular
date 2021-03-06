(function(){

	'use strict';

	// Agent Routes
	var app = angular.module('starter');

	// Application configuration
	app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

		// ******************** HTTP INTERCEPTER **************************
		var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
			// Initialize a new promise
			var deferred = $q.defer();
			// Make an AJAX call to check if the user is logged in
			$http.get('/api/loggedIn')
				.success(function (data) {
					// Manage session at client end
					if (data.code != 401) {
						if(data.type != 'agent'){
							$timeout(deferred.resolve, 0);
						}else{
							$timeout(deferred.resolve, 0);
							$location.path('/');
						}
					}else{
						$timeout(deferred.resolve, 0);
						$location.path('/');
					}
			});
			return deferred.promise;
		};

		var checkLoggedout = function($q, $timeout, $http, $location, $rootScope,$route) {
			// Initialize a new promise
			var deferred = $q.defer();
			// Make an AJAX call to check if the user is logged in
			$http.get('/api/loggedIn')
				.success(function(data) {
					// Authenticated
					if (data.code != 401){
						$timeout(deferred.resolve, 0);
						if(data.type != 'agent'){
							$location.path('/users/dashboard');
						}else{
							$location.path('/dashboard');
						}
					}else{
						$timeout(deferred.resolve, 0);
						$location.path($route.current.originalPath);
					}
				});
			return deferred.promise;
		};

		//================================================
		// Add an interceptor for AJAX errors
		//================================================
		$httpProvider.interceptors.push(function ($q, $location, $window) {
			return {
				request: function (config) {
					config.headers = config.headers || {};
					if ($window.localStorage.token) {
						config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
					}else{
						if($window.localStorage.satellizer_token){
							config.headers.Authorization = 'Bearer ' + $window.localStorage.satellizer_token;
						}
					}
					return config;
				},
				response: function (response) {
					if (response.status === 401) {
						// handle the case where the user is not authenticated
						$location.path('/');
					}
					return response || $q.when(response);
				}
			};
		});
		// ************************ End ***************************

		// Buyer/seller routes
		$stateProvider
			.state('/users/dashboard', {
				templateUrl:'/modules/dashboards/views/buyersellers/dashboard.html',
				controller : 'buyersellerDashboardCtrl',
				title:'Dashboard',
				resolve : {
					// you can lazy load files for an existing module
					loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							files: [
								'/modules/dashboards/controllers/dashboardCtrl.js',
								'/modules/dashboards/services/dashboardService.js',
								'/modules/dashboards/directives/dashboardDirective.js'
							]
						});
					}],
					loggedin: checkLoggedin
				}
			})
			.state('/users/profile/:id', {
				templateUrl:'/modules/profiles/views/buyersellers/profile.html',
				controller : 'buyersellerProfileCtrl',
				resolve : {
					// you can lazy load files for an existing module
					loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							name : 'UpdateModule',
							files: [
								'/modules/profiles/controllers/profileCtrl.js',
								'/modules/profiles/services/profileService.js'
							]
						});
					}],
					loggedin: checkLoggedin
				}
			})
			.state('/404',{
				templateUrl:'/views/error/404.html'
			});
	}])

})();
