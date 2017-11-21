(function() {
  angular
    .module("app")
    .controller("MainController", [
      "navService",
      "$state",
      "authService",
      MainController
    ]);

  function MainController(navService, $state, authService) {
    var vm = this;

    vm.menuItems = [];
    vm.title = $state.current.data.title;
    vm.auth = authService;

    navService.loadAllItems().then(function(menuItems) {
      vm.menuItems = [].concat(menuItems);
    });
  }
})();
