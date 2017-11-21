(function() {
  "use strict";

  angular.module("app").service("authService", authService);

  authService.$inject = ["$state", "$http", "angularAuth0", "$timeout"];

  function authService($state, $http, angularAuth0, $timeout) {
    var userProfile;
    var userList;

    function login() {
      angularAuth0.authorize();
    }

    function handleAuthentication() {
      angularAuth0.parseHash(function(err, authResult) {
        if (authResult && authResult.idToken) {
          $http.get("/api/users").then(function(response) {
            for (var i = 0; i < response.data.length; i++) {
              var userExists = false;
              if (authResult.idTokenPayload.sub === response.data[i].auth0Key) {
                userExists = true;
              }
            }

            if (!userExists) {
              $http.post("/api/users", {
                firstName: authResult.idTokenPayload.given_name,
                lastName: authResult.idTokenPayload.family_name,
                auth0Key: authResult.idTokenPayload.sub,
                userTypeId: 4
              });
            }
          });
          setSession(authResult);
          var profile = authResult.idTokenPayload;
          $state.go("home.dogs");
        } else if (err) {
          $timeout(function() {
            $state.go("home.dogs");
          });
          console.log(err);
          alert(
            "Error: " + err.error + ". Check the console for further details."
          );
        }
      });
    }

    function getProfile(cb) {
      var accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access token must exist to fetch profile");
      }
      angularAuth0.client.userInfo(accessToken, function(err, profile) {
        if (profile) {
          setUserProfile(profile);
        }
        cb(err, profile);
      });
    }

    function setUserProfile(profile) {
      userProfile = profile;
    }

    function getCachedProfile() {
      return userProfile;
    }

    function setSession(authResult) {
      // Set the time that the access token will expire at
      var expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );
      localStorage.setItem("access_token", authResult.accessToken);
      localStorage.setItem("id_token", authResult.idToken);
      localStorage.setItem("expires_at", expiresAt);
    }

    function logout() {
      // Remove tokens and expiry time from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
      $state.go("home.dogs");
    }

    function isAuthenticated() {
      // Check whether the current time is past the
      // access token's expiry time
      var expiresAt = JSON.parse(localStorage.getItem("expires_at"));
      return new Date().getTime() < expiresAt;
    }

    return {
      login: login,
      getProfile: getProfile,
      getCachedProfile: getCachedProfile,
      handleAuthentication: handleAuthentication,
      logout: logout,
      isAuthenticated: isAuthenticated
    };
  }
})();
