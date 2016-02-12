var _ = require('lodash');

(function (angular) {
  'use strict';

  angular
    .module('app', ['services'])
    .filter('ytEmbed', [function () {
      return function (url) {
        url = url || "";
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length > 10)
          return "http://www.youtube.com/embed/" + match[2] + "?rel=0&amp;controls=0";
        else
          return "";
      };
    }])
    .filter('trustUrl', ['$sce', function ($sce) {
      return function (url) {
        return $sce.trustAsResourceUrl(url);
      };
    }])
    .controller('mainCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
      $scope.songs = [];
      $scope.progress = 0;
      $scope.state = 'Download';

      $scope.parse = function () {
        $scope.songs.splice(0, $scope.songs.length);
        $scope.list.split("\n").forEach(function (line) {
          if (line)
            $scope.songs.push({
              fullTitle: line,
              control: {}
            });
        });
      };

      $scope.$watchCollection('songs', function () {
        $scope.list = $scope.songs.map(function (song) {
          return song.fullTitle
        }).join("\n");
      });

      $scope.addSong = function () {
        $scope.songs.splice(0, 0, {control: {}});
      };

      $scope.removeSong = function (song) {
        $scope.songs.splice($scope.songs.indexOf(song), 1);
      };

      $scope.download = function () {
        if ($scope.state != 'Download')
          return;
        if ($scope.songs.length < 1)
          return;

        var downloaded = 0;

        $scope.state = 'Downloading';
        $scope.songs.forEach(function (song) {
          song.control.downloader
            .on('progress', function progressUpdate(progress) {
              //do something with progress
              console.log(progress);
              $timeout(function () {
                $scope.progress = $scope.songs.reduce(function (a, b) {
                    return a + b.control.progress;
                  }, 0) / $scope.songs.length;
              }, 500);
            })
            .on('done', function done() {
              downloaded++;
              if (downloaded >= $scope.songs.length) {
                $scope.progress = 100;
                $scope.state = 'Done'
              }
            })
            .options({
              directory: $scope.directoryPath
            })
            .download();
        });
      };

      $scope.setDirectoryPath = function (input) {
        console.log('path:', input.value);
      };
      
    }])
    .directive('nwdirectory', ['$timeout', function ($timeout) {
      return {
        restrict: "A",
        scope: {
          directoryPath: "=nwdirectory"
        },
        link: function (scope, element) {

          element.data('old-value', scope.directoryPath);

          element.bind('change', function (blurEvent) {
            if (element.data('old-value') != element.val()) {
              $timeout(function () {
                scope.directoryPath = element.val();
                element.data('old-value', element.val());
              });
            }
          });
        }
      };
    }])
    .directive('song', ['$timeout', 'songDownloader', function ($timeout, Downloader) {
      return {
        templateUrl: 'templates/song.html',
        replace: true,
        scope: {
          song: "=data",
          remove: "&"
        },
        link: function (scope, element) {

          scope.song.control.downloader = new Downloader();
          scope.song.control.progress = 0;


          scope.song.control.downloader
            .on('data', function songData(data) {
              //do something with data
              console.log(data);
              $timeout(function () {
                _.assign(scope.song, data);
              });
            })
            .on('progress', function progressUpdate(progress) {
              //do something with progress
              $timeout(function () {
                scope.song.control.progress = progress;
              });
            })
            .on('done', function done(data) {
              //report to frontend
              $timeout(function () {
                scope.song.control.progress = 100;
              });
            });

          scope.fullTitle = {
            get: function () {
              var fullTitle = "";
              if (scope.song.artist && scope.song.title)
                fullTitle = scope.song.artist + " - " + scope.song.title;
              else if (scope.song.artist || scope.song.title)
                fullTitle = scope.song.artist || scope.song.title;

              if (scope.song.tags)
                fullTitle += " (" + scope.song.tags + ")";
              if (scope.song.album)
                fullTitle += " - " + scope.song.album;
              if (scope.song.url)
                fullTitle += " - " + scope.song.url;
              scope.song.fullTitle = fullTitle;

              scope.song.control.downloader.query({
                artist: scope.song.artist,
                title: scope.song.title,
                album: scope.song.album,
                tags: scope.song.tags,
                url: scope.song.url
              })
                .getData();
            },
            set: function () {
              scope.song.artist =
                scope.song.title =
                  scope.song.album =
                    scope.song.url =
                      scope.song.tags = "";
              var fullTitle = scope.song.fullTitle;
              var tagsStart = fullTitle.indexOf("(") + 1,
                tagsEnd = fullTitle.indexOf(")");
              if (tagsStart > -1 && tagsEnd > -1) {
                scope.song.tags = fullTitle.substring(fullTitle.indexOf("(") + 1, fullTitle.indexOf(")"));
                scope.song.tags = scope.song.tags.trim();
                fullTitle = fullTitle.replace(fullTitle.substring(fullTitle.indexOf("("), fullTitle.indexOf(")") + 1), "");
              }
              var parts = fullTitle.split(" - ");
              if (parts[0])
                scope.song.artist = parts[0].trim();
              if (parts[1])
                scope.song.title = parts[1].trim();
              if (parts[2])
                scope.song.album = parts[2].trim();
              if (parts[3])
                scope.song.url = parts[3].trim();

              scope.song.control.downloader.query({
                artist: scope.song.artist,
                title: scope.song.title,
                album: scope.song.album,
                tags: scope.song.tags,
                url: scope.song.url
              })
                .getData();
            }
          };

          if (scope.song.fullTitle)
            scope.fullTitle.set();

          scope.cardOpened = false;

        }
      };
    }]);
})(angular);