"use strict";

angular
  .module("angularMaterialAdmin", [
    "ngAnimate",
    "ngCookies",
    "ngSanitize",
    "ui.router",
    "ngMaterial",
    "nvd3",
    "app",
    "md.data.table",
    "auth0.auth0"
  ])
  .config(function(
    $stateProvider,
    $urlRouterProvider,
    $mdThemingProvider,
    $mdIconProvider,
    angularAuth0Provider
  ) {
    $stateProvider
      .state("home", {
        url: "",
        templateUrl: "app/views/main.html",
        controller: "MainController",
        controllerAs: "vm",
        abstract: true
      })
      .state("home.foster", {
        url: "/foster",
        templateUrl: "app/views/foster.html",
        controller: "FosterController",
        controllerAs: "vm",
        data: {
          title: "Foster"
        }
      })
      .state("home.callback", {
        url: "/callback",
        controller: "CallbackController",
        templateUrl: "app/views/callback.html",
        controllerAs: "vm"
      })
      .state("home.dogs", {
        url: "/dogs",
        controller: "DogsController",
        controllerAs: "vm",
        templateUrl: "app/views/dogs.html",
        data: {
          title: "Dogs"
        }
      });

    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN,
      responseType: "token id_token",
      audience: "https://" + AUTH0_DOMAIN + "/userinfo",
      redirectUri: AUTH0_CALLBACK_URL,
      scope: "openid profile"
    });

    $urlRouterProvider.otherwise("/dogs");

    $mdThemingProvider
      .theme("default")
      .primaryPalette("grey", {
        default: "600"
      })
      .accentPalette("teal", {
        default: "500"
      })
      .warnPalette("defaultPrimary");

    $mdThemingProvider
      .theme("dark", "default")
      .primaryPalette("defaultPrimary")
      .dark();

    $mdThemingProvider.theme("grey", "default").primaryPalette("grey");

    $mdThemingProvider
      .theme("custom", "default")
      .primaryPalette("defaultPrimary", {
        "hue-1": "50"
      });

    $mdThemingProvider.definePalette("defaultPrimary", {
      "50": "#FFFFFF",
      "100": "rgb(255, 198, 197)",
      "200": "#E75753",
      "300": "#E75753",
      "400": "#E75753",
      "500": "#E75753",
      "600": "#E75753",
      "700": "#E75753",
      "800": "#E75753",
      "900": "#E75753",
      A100: "#E75753",
      A200: "#E75753",
      A400: "#E75753",
      A700: "#E75753"
    });

    $mdIconProvider.icon("user", "assets/images/user.svg", 64);
  });
