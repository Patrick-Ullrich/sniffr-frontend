(function() {
  angular
    .module("app")
    .controller("FosterController", ["$http", FosterController])
    .filter("houseTypeFilter", function() {
      return function(x, houseTypes) {
        for (var i = 0; i < houseTypes.length; i++) {
          if (houseTypes[i].houseTypeId === x) {
            return houseTypes[i].description;
          }
        }
      };
    });

  function FosterController($http) {
    var vm = this;
    vm.users = [];
    vm.selectedUser = null;
    vm.selectedUserDogs = [];

    vm.dogTypes = [];
    $http.get("/api/dog_types").then(function(response) {
      vm.dogTypes = response.data;
    });

    vm.houseTypes = [];
    $http.get("/api/house_types").then(function(response) {
      vm.houseTypes = response.data;
    });

    $http.get("/api/users").then(function(response) {
      var data = response.data;
      for (var i = 0; i < data.length; i++) {
        if (data[i].userTypeId == 1) {
          vm.users.push(data[i]);
        }
      }
    });

    vm.selectFoster = function(userId) {
      vm.selectedUserDogs = [];

      $http.get("/api/dogs").then(function(response) {
        var data = response.data;
        for (var i = 0; i < data.length; i++) {
          if (data[i].careGiverId == userId) {
            vm.selectedUserDogs.push(data[i]);
          }
        }
      });

      for (var i = 0; i < vm.users.length; i++) {
        if (vm.users[i].userId == userId) {
          vm.selectedUser = vm.users[i];

          $http.get("/api/houses").then(function(response) {
            var data = response.data;
            for (var i = 0; i < data.length; i++) {
              if (data[i].houseId == vm.selectedUser.houseId) {
                vm.property = data[i];
              }
            }
          });

          $http.get("/api/addresses").then(function(response) {
            var data = response.data;
            for (var i = 0; i < data.length; i++) {
              if (data[i].addressId == vm.selectedUser.addressId) {
                vm.address = data[i];
              }
            }
          });

          $http.get("/api/phones").then(function(response) {
            var data = response.data;
            for (var i = 0; i < data.length; i++) {
              if (data[i].phoneId == vm.selectedUser.phoneId) {
                vm.phone = data[i];
              }
            }
          });
        }
      }
    };
  }
})();
