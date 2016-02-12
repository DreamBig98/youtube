var EventEmitter = require('events').EventEmitter,
  song = require('app/Song');

(function (angular) {
  'use strict';
  angular
    .module('services', [])
    .factory('songDownloader', [function () {
      return song;
    }]);

})(angular);
