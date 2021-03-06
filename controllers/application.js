(function(){
  angular.module('jf').controller('ApplicationCtrl', function($scope, CONFIG, Authorization, Authentication, Session, $location, AjaxAction, Spinner){
    var ref$, spinner, x0$, ref1$;
    if (CONFIG.debug) {
      window.appScope = $scope;
      window.CONFIG = CONFIG;
    }
    $scope.CONFIG = CONFIG;
    if ((ref$ = CONFIG.spinner) != null) {
      ref$.delay = CONFIG.common.spinnerDelay;
    }
    spinner = Spinner('spinner', CONFIG.spinner);
    $scope.currentUser = null;
    $scope.fullUserName = null;
    $scope.setPendingRequest = function(pendingRequest){
      console.log("setPendingRequest ->", pendingRequest);
      if (pendingRequest) {
        spinner.start();
      } else {
        spinner.stop();
      }
    };
    Session.applicationScope = $scope;
    x0$ = CONFIG.auth.cookieName;
    if (x0$) {
      Authentication.checkUrlCookie(x0$);
    }
    function handleLocationChange(event, next){
      var nextPath;
      console.log("next ------>", next);
      nextPath = new URI(next).resource();
      return Authorization.isAuthorized(nextPath, function(isAuthorized){
        console.log("isAuthorized", isAuthorized, nextPath);
        if (!isAuthorized) {
          if (CONFIG.common.ssoLoginUrl) {
            return window.location.href = CONFIG.common.ssoLoginUrl;
          } else {
            console.log("redirect --> " + CONFIG.common.loginPath + "?redirectPath=" + nextPath);
            return $location.path(CONFIG.common.loginPath).search({
              redirectPath: encodeURIComponent(nextPath)
            });
          }
        }
      });
    }
    $scope.$on("$locationChangeStart", handleLocationChange);
    $scope.$on("$stateChangeStart", handleLocationChange);
    if ((ref1$ = CONFIG.connectionChecker) != null && ref1$.enabled) {
      ConnectionChecker.start();
      Events.on("connectionChecker:fail", function(){
        console.log("APP failed to connect to backend");
        return Events.emit("alerts:error", CONFIG.text.cannotConnectToBackend);
      });
      Events.on("connectionChecker:ok", function(){
        console.log("APP reconnected to backend");
        return Events.emit("alerts:message", CONFIG.text.connectedToBackendSuccessfully);
      });
    }
    Authentication.discoverLoginState();
  });
}).call(this);
