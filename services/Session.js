(function(){
  angular.module('jf').service('Session', function(){
    var username, this$ = this;
    username = null;
    this.applicationScope = {
      currentUser: null,
      fullUserName: null,
      setPendingRequest: function(){}
    };
    this.setPendingRequest = function(pendingRequest){
      this$.applicationScope.setPendingRequest(pendingRequest);
    };
    this.getUsername = function(){
      return username;
    };
    this.setUsername = function(_username,_fullname){
      username = _username;
      this$.applicationScope.currentUser = _username;
      this$.applicationScope.fullUserName = _fullname;
    };
    this.isLoggedIn = function(){
      return !!this$.getUsername();
    };
    this.logout = function(b){
      this$.setUsername(null,null);
    };
    this.login = function(username,fullname){
      this$.setUsername(username,fullname);
    };
    return this;
  });
}).call(this);
