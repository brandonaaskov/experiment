angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("navigation.html","<nav class=\"navbar navbar-default row\" role=\"navigation\">\n  <div class=\"container-fluid\">\n    <!-- brand and toggle get grouped for better mobile display -->\n    <div class=\"navbar-header\">\n      <button type=\"button\"\n              class=\"navbar-toggle collapsed\"\n              data-toggle=\"collapse\"\n              data-target=\"#navbar-collapse\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">Experiment</a>\n    </div>\n\n    <ul class=\"nav navbar-nav navbar-right\">\n      <li class=\"btn-group\" dropdown>\n        <button type=\"button\" class=\"btn btn-default\">\n          <span ng-if=\"!user\">Login</span>\n          <span ng-if=\"user\">{{user.displayName}}</span>\n        </button>\n        <button type=\"button\" class=\"btn btn-default dropdown-toggle\" dropdown-toggle>\n          <span class=\"caret\"></span>\n        </button>\n        <ul class=\"dropdown-menu\" role=\"menu\">\n          <li><a ng-click=\"auth.login(\'facebook\')\">Facebook</a></li>\n          <li><a ng-click=\"auth.login(\'twitter\')\">Twitter</a></li>\n          <li><a ng-click=\"auth.login(\'github\')\">Github</a></li>\n          <li class=\"divider\"></li>\n          <li><a href=\"#\">Sign Out</a></li>\n        </ul>\n      </li>\n      <li class=\"speech-toggle\">\n        <speech-toggle></speech-toggle>\n      </li>\n    </ul>\n  </div><!-- /.container-fluid -->\n</nav>\n");
$templateCache.put("player.html","<video\n  id=\"player\"\n  class=\"player video-js vjs-default-skin\"\n  controls\n  preload=\"auto\"\n  poster=\"\"\n  width=\"960\"\n  height=\"540\"\n  data-setup=\'{\"techOrder\": [\"html5\"]}\'>\n</video>");
$templateCache.put("speech-toggle.html","<i class=\"speech-toggle clickable glyphicon\"\n   ng-class=\"{\n          \'glyphicon-volume-up\': speechEnabled,\n          \'glyphicon-volume-off\': !speechEnabled,\n          \'speaking\': speaking}\"></i>\n");
$templateCache.put("speech.html","<div class=\"row\">\n  <h1 class=\"clickable\"\n      speech=\"Welcome to the jungle! We\'ve got fun and games. We\'ve got everything you want, including angular shtuff.\">Welcome to the Experiment</h1>\n</div>\n");}]);