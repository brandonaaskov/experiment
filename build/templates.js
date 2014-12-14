angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("home.html","<div class=\"page-header\">\n  <h1>Experiment: An Angular Playground</h1>\n</div>\n");
$templateCache.put("speech.html","<div class=\"drum-machine row\">\n  <div class=\"page-header\">\n    <h1 class=\"clickable\"\n        speech=\"Welcome to the jungle! We\'ve got fun and games. We\'ve got everything you want, including angular shtuff.\">\n      Click here for speech synthesis\n      <speech-toggle class=\"pull-right\"></speech-toggle>\n    </h1>\n  </div>\n</div>\n");
$templateCache.put("splice.html","<div class=\"splice\">\n  <div class=\"page-header\">\n    <h1>Drum Machine</h1>\n  </div>\n\n  <drum-machine></drum-machine>\n</div>\n");
$templateCache.put("drum-loop.html","");
$templateCache.put("drum-machine.html","<div class=\"drum-machine\">\n  <div class=\"controls row\">\n    <button class=\"btn btn-lg btn-success col-md-2\"\n            ng-show=\"!isPlaying\"\n            ng-click=\"play()\">Play</button>\n\n    <button class=\"btn btn-lg btn-danger col-md-2\"\n            ng-show=\"isPlaying\"\n            ng-click=\"stop()\">Stop</button>\n\n    <form class=\"form-inline col-md-2\" role=\"form\">\n      <div class=\"form-group\">\n        <div class=\"input-group\">\n          <div class=\"input-group-addon\">BPM</div>\n          <input type=\"text\"\n                 class=\"form-control bpm\"\n                 ng-model=\"song.bpm\">\n        </div>\n      </div>\n    </form>\n  </div>\n\n  <div class=\"beat-numbers row\">\n    <ol class=\"col-md-offset-2 col-md-10\">\n      <li class=\"btn btn-default\"\n          ng-repeat=\"model in kickCollection.models\">{{$index + 1}}</li>\n    </ol>\n  </div>\n\n  <div class=\"loop row\">\n    <button class=\"btn btn-info sample col-md-2\">\n      Kick <icon glyph=\"music\"></icon>\n    </button>\n\n    <span class=\"bar col-md-10\">\n      <instrument ng-repeat=\"model in kickCollection.models\" model=\"model\"></instrument>\n    </span>\n  </div>\n</div>\n");
$templateCache.put("icon.html","<i class=\"icon glyphicon glyphicon-{{glyph}}\"></i>\n");
$templateCache.put("instrument.html","<button class=\"instrument btn\"\n        ng-class=\"{\n          \'btn-primary\': enabled,\n          \'btn-default\': !enabled,\n          \'active\': model.active\n        }\">\n  inst.\n</button>\n");
$templateCache.put("navigation.html","<nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n  <div class=\"container-fluid\">\n    <!-- brand and toggle get grouped for better mobile display -->\n    <div class=\"navbar-header\">\n      <button type=\"button\"\n              class=\"navbar-toggle collapsed\"\n              data-toggle=\"collapse\"\n              data-target=\"#navbar-collapse\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" ng-href=\"/#/\">Experiment</a>\n    </div>\n\n    <ul class=\"nav navbar-nav navbar-left\">\n      <li>\n        <a ng-href=\"#speech\">Speech</a>\n      </li>\n      <li>\n        <a ng-href=\"#splice\">Drum Machine</a>\n      </li>\n    </ul>\n\n    <ul class=\"nav navbar-nav navbar-right\">\n      <li class=\"btn-group\" dropdown>\n        <button type=\"button\" class=\"btn btn-default\">\n          <span ng-hide=\"user\">Login</span>\n          <span ng-show=\"user\">{{user.displayName}}</span>\n        </button>\n        <button type=\"button\" class=\"btn btn-default dropdown-toggle\" dropdown-toggle>\n          <span class=\"caret\"></span>\n        </button>\n        <ul class=\"dropdown-menu\" role=\"menu\">\n          <li><a ng-click=\"auth.login(\'facebook\')\">Facebook</a></li>\n          <li><a ng-click=\"auth.login(\'twitter\')\">Twitter</a></li>\n          <li><a ng-click=\"auth.login(\'github\')\">Github</a></li>\n          <li class=\"divider\"></li>\n          <li><a ng-click=\"auth.logout()\">Sign Out</a></li>\n        </ul>\n      </li>\n    </ul>\n  </div><!-- /.container-fluid -->\n</nav>\n");
$templateCache.put("player.html","<video\n  id=\"player\"\n  class=\"player video-js vjs-default-skin\"\n  controls\n  preload=\"auto\"\n  poster=\"\"\n  width=\"960\"\n  height=\"540\"\n  data-setup=\'{\"techOrder\": [\"html5\"]}\'>\n</video>");
$templateCache.put("speech-toggle.html","<i class=\"speech-toggle clickable glyphicon\"\n   ng-class=\"{\n          \'glyphicon-volume-up\': speechEnabled,\n          \'glyphicon-volume-off\': !speechEnabled,\n          \'speaking\': speaking}\"></i>\n");}]);