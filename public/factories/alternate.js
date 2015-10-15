angular
  .module('app')
  .factory('myInterceptor', myInterceptor);

function myInterceptor($injector, $q, config) {
  var host = config.authHost;
  var alternateHost = config.permissionHost;
  var alternateToken = window.localStorage.getItem('permissiontoken');

  return {
    request: function(config) {
      var $http = $injector.get('$http');
      if (!(config.method === 'PUT' && config.url.indexOf(host) === 0)) {
        return config;
      }

      var alternateConfig = angular.copy(config);

      alternateConfig.url = alternateConfig.url.replace(host, alternateHost);
      alternateConfig.headers['cm-api-key'] = alternateToken;
      console.log('after:', alternateConfig);

      return $http(alternateConfig).then(function() {
        return config;
      });
    },
    response: function(response) {
      var $http = $injector.get('$http');
      var config = response.config;

      if (!(config.method === 'GET' && config.url.indexOf(host) === 0)) {
        return response;
      }

      function getRoles(user) {
        console.log('get roles', user);
        return $http
          .get(alternateHost + 'api/users/' + user.id + '/roles', {
            headers: {'cm-api-key': alternateToken}
          })
          .then(function(result) {
            var roles = result.data;
            console.log('reply roles:', roles);
            return {
              userId: user.id,
              roles: roles
            }
          });
      }

      if (Array.isArray(response.data)) {
        var tasks = response.data.map(getRoles);
      } else {
        var tasks = [getRoles(response.data)];
      }

      return Promise
        .all(tasks)
        .then(function(userRoles) {
          console.log('userRoles', userRoles);
          var roleMap = userRoles.reduce(function(memo, roles) {
            memo[roles.userId] = roles.roles;
            return memo;
          }, {});
          console.log('role map:', roleMap);
          console.log(response);

          function setRoles(user) {
            console.log('set roles', user);
            console.log(roleMap);
            user.roles = roleMap[user.id];
          }

          if (Array.isArray(response.data)) {
            response.data.forEach(setRoles);
          } else {
            setRoles(response.data);
          }

          return response;
        });
    }
  };
}
