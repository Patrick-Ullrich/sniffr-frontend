(function() {
  angular
    .module("app")
    .filter("dogTypeFilter", function() {
      return function(x, dogTypes) {
        for (var i = 0; i < dogTypes.length; i++) {
          if (dogTypes[i].dogTypeId === x) {
            return dogTypes[i].description;
          }
        }
      };
    })
    .filter("adoptionStatusFilter", function() {
      return function(x, adoptionStatuses) {
        for (var i = 0; i < adoptionStatuses.length; i++) {
          if (adoptionStatuses[i].adoptionStatusId === x) {
            return adoptionStatuses[i].description;
          }
        }
      };
    })
    .filter("incidentStatusFilter", function() {
      return function(x, incidentStatuses) {
        for (var i = 0; i < incidentStatuses.length; i++) {
          if (incidentStatuses[i].incidentStatusId === x) {
            return incidentStatuses[i].description;
          }
        }
      };
    })
    .filter("incidentTypeFilter", function() {
      return function(x, incidentTypes) {
        for (var i = 0; i < incidentTypes.length; i++) {
          if (incidentTypes[i].incidentTypeId === x) {
            return incidentTypes[i].description;
          }
        }
      };
    })
    .filter("severityTypeFilter", function() {
      return function(x, severityTypes) {
        for (var i = 0; i < severityTypes.length; i++) {
          if (severityTypes[i].severityTypeId === x) {
            return severityTypes[i].description;
          }
        }
      };
    })
    .controller("DogsController", [
      "$firebaseObject",
      "$firebaseArray",
      "$http",
      DogsController
    ])
    .filter("userFilter", function() {
      return function(x, users) {
        if (users) {
          for (var i = 0; i < users.length; i++) {
            if (users[i].userId === x) {
              return users[i].firstName + " " + users[i].lastName;
            }
          }
        }
      };
    });

  function DogsController($firebaseObject, $firebaseArray, $http) {
    var vm = this;

    vm.dogs = [];
    vm.selectedDog = null;
    vm.dogChat = null;
    vm.newDog = null;
    vm.users = [];
    vm.newVaccination = null;
    vm.newTraining = null;
    vm.newMedicals = null;
    vm.medicalInformation = [];
    vm.errors = {};

    vm.fitness = [];
    vm.vaccination = [];
    vm.medicals = [];
    vm.incidents = [];
    vm.severityTypes = [];
    vm.incidentStatuses = [];
    vm.incidentTypes = [];

    $http.get("/api/incidents").then(function(response) {
      vm.incidents = response.data;
    });

    $http.get("/api/severity_types").then(function(response) {
      vm.severityTypes = response.data;
    });

    $http.get("/api/incident_statuses").then(function(response) {
      vm.incidentStatuses = response.data;
    });

    $http.get("/api/incident_types").then(function(response) {
      vm.incidentTypes = response.data;
    });

    vm.addVaccination = function() {
      var newItem = {
        dogId: vm.selectedDog.dogId,
        medicalInfoTypeId: 1,
        info: vm.newVaccination
      };
      vm.vaccination.push(newItem);
      $http.post("/api/medical_infos", newItem).then(
        function(response) {
          vm.newVaccination = null;
        },
        function(response) {
          vm.vaccination.pop();
          vm.errors.vaccination = response.data.errors[0];
        }
      );
    };
    vm.addTraining = function() {
      var newItem = {
        dogId: vm.selectedDog.dogId,
        medicalInfoTypeId: 3,
        info: vm.newTraining
      };
      vm.fitness.push(newItem);
      $http.post("/api/medical_infos", newItem).then(
        function(response) {
          vm.newTraining = null;
        },
        function(response) {
          vm.fitness.pop();
          vm.errors.training = response.data.errors[0];
        }
      );
    };
    vm.addMedicals = function() {
      var newItem = {
        dogId: vm.selectedDog.dogId,
        medicalInfoTypeId: 2,
        info: vm.newMedicals
      };
      vm.medicals.push(newItem);
      $http.post("/api/medical_infos", newItem).then(
        function(response) {
          vm.newMedicals = null;
        },
        function(response) {
          vm.medicals.pop();
          vm.errors.medicals = response.data.errors[0];
        }
      );
    };

    $http.get("/api/users").then(function(response) {
      vm.users = response.data;
    });

    vm.saveNewDog = function() {
      $http.post("/api/dogs", vm.newDog).then(
        function(response) {
          vm.newDog = null;
          vm.isNewDog = false;
          $http.get("/api/dogs").then(function(response) {
            vm.dogs = [].concat(response.data);
          });
        },
        function(response) {
          formatErrors(response.data.errors);
        }
      );
    };

    vm.updateDog = function() {
      $http.put("/api/dogs/" + vm.selectedDog.dogId, vm.selectedDog).then(
        function(response) {
          vm.selectedDog = null;
          vm.fitness = [];
          vm.vaccination = [];
          vm.medicals = [];
          $http.get("/api/dogs").then(function(response) {
            vm.dogs = [].concat(response.data);
          });
        },
        function(response) {
          formatErrors(response.data.errors);
        }
      );
    };

    function formatErrors(errors) {
      for (var i = 0; i < errors.length; i++) {
        var path = errors[i].path;
        vm.errors[path] = {
          message: errors[i].message
        };
      }
    }

    vm.selectDog = function(index) {
      for (var i = 0; i < vm.dogs.length; i++) {
        if (vm.dogs[i].dogId == index) {
          vm.selectedDog = vm.dogs[i];
          vm.selectedDog.incidents = [];

          for (var j = 0; j < vm.incidents.length; j++) {
            if (vm.incidents[j].dogId === vm.selectedDog.dogId) {
              vm.selectedDog.incidents.push(vm.incidents[j]);
            }
          }

          $http.get("/api/medical_infos").then(function(response) {
            var data = response.data;
            for (var i = 0; i < data.length; i++) {
              if (data[i].dogId == index) {
                switch (data[i].medicalInfoTypeId) {
                  case 1:
                    vm.vaccination.push(data[i]);
                    break;
                  case 2:
                    vm.medicals.push(data[i]);
                    break;
                  case 3:
                    vm.fitness.push(data[i]);
                    break;
                }
              }
            }
            vm.medicalInformation = data;
          });
        }
      }
    };

    vm.chatDog = function(index) {
      for (var i = 0; i < vm.dogs.length; i++) {
        if (vm.dogs[i].dogId == index) {
          vm.dogChat = vm.dogs[i];
          vm.selectedDog = null;
        }
      }

      if (vm.dogChat) {
        function getLocation() {
          var ref = firebase
            .database()
            .ref()
            .child("users")
            .child(vm.dogChat.dogId)
            .child("conversations")
            .child(vm.dogChat.dogId);
          return $firebaseObject(ref);
        }

        getLocation()
          .$loaded()
          .then(function(obj) {
            var messageFirebase = firebase
              .database()
              .ref()
              .child("conversations")
              .child(obj.location);
            vm.messages = $firebaseArray(messageFirebase);
          });
      }
    };

    vm.addNewDog = function() {
      vm.isNewDog = true;
    };

    vm.isImage = function(content) {
      var res = content.substring(0, 4);
      return res === "http";
    };

    vm.newMessage = "";

    vm.dogTypes = [];
    $http.get("/api/dog_types").then(function(response) {
      vm.dogTypes = response.data;
    });

    vm.adoptionStatuses = [];
    $http.get("/api/adoption_statuses").then(function(response) {
      vm.adoptionStatuses = response.data;
    });

    vm.sendMessage = function() {
      var timeStamp = Math.floor(Date.now() / 1000);
      vm.messages.$add({
        content: vm.newMessage,
        fromID: vm.dogChat.dogId,
        isRead: false,
        timestamp: timeStamp,
        toID: vm.dogChat.dogId,
        type: "text"
      });

      vm.newMessage = "";
    };

    $http.get("/api/dogs").then(function(response) {
      vm.dogs = [].concat(response.data);
    });
  }
})();
