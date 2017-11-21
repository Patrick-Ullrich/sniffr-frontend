(function() {
  "use strict";

  angular.module("app").service("navService", ["$q", navService]);

  function navService($q) {
    var menuItems = [
      {
        name: "Dogs",
        icon: "pets",
        sref: ".dogs"
      },
      {
        name: "Foster",
        icon: "person",
        sref: ".foster"
      }
    ];

    return {
      loadAllItems: function() {
        return $q.when(menuItems);
      }
    };
  }
})();
