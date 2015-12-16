(function () {
  'use strict';

  angular
      .module('msm.components.ui')
      .service('msmModal', msmModal);

  /**
   * @ngdoc service
   * @name components.ui.msmModal
   *
   * @description
   *     Renders styled modals.
   */
  function msmModal($window, $document, $modal) {
    return {
      open: open,
      note: note,
      confirm: confirm,
      select: select
    };

    /**
     * @ngdoc method
     * @name components.ui.msmModal#open
     * @methodOf components.ui.msmModal
     *
     * @description
     *     Display a modal dialog.
     * @param {object=} parameters
     *     The modal's scope parameters. All parameters will automatically
     *     converted to resolvable functions and bound to the controller
     *     instance using the object's key name.
     * @param {object=} controller
     *     The modal's controller. A default controller will be provided
     *     with all parameter bindings.
     * @param {string=} size
     *     The modal's size.
     * @param {string=} templateUrl
     *     The modal's template URL.
     */
    function open(parameters, controller, size, templateUrl) {

      parameters = parameters || {};

      // auto-generate controller if missing
      if (angular.isUndefined(controller)) {
        var keys = Object.keys(parameters);
        var args = keys.join(',');
        var assign =
          'var vm = this;' +
          keys.map(function (arg) {
            return 'this[\'' + arg + '\'] = ' + arg + ';';
          }).join('');
        eval('controller = function (' + args + ') {' + assign + '};');
      }

      // convert parameters to functions
      angular.forEach(parameters, function (value, key) {
        parameters[key] = angular.isFunction(value) ? value : function () {
          return value;
        };
      });

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: templateUrl || 'components/ui/msm-modal/msm-modal.html',
        controller: controller,
        controllerAs: 'vm',
        size: size || '',
        resolve: parameters,
        bindToController: true,
        windowClass: 'app-modal-window'
      });
      
//      modalInstance.opened['finally'](function() {
//        modalInstance.pageXOffset = $window.pageXOffset;
//        modalInstance.pageYOffset = $window.pageYOffset;
//        angular.element($document[0].body).css('position', 'fixed');
//      });
//      
//      modalInstance.result['finally'](function() {
//        angular.element($document[0].body).css('position', 'inherit');
//        $window.scrollTo(modalInstance.pageXOffset, modalInstance.pageYOffset);
//      })
      
      return modalInstance;
    }

    /**
     * @ngdoc method
     * @name components.ui.msmModal#note
     * @methodOf components.ui.msmModal
     *
     * @description
     *     Display a modal notification dialog.
     * @param {string} title
     *     The modal's title.
     * @param {string} text
     *     The modal's text.
     * @param {string=} size
     *     The modal's size.
     */
    function note(title, text, size) {
      return open(null, function ($modalInstance) {
        var vm = angular.extend(this, {
          title: title,
          text: text,
          buttons: [{
            icon: 'check-circle',
            title: 'Ok',
            context: 'primary',
            onClick: $modalInstance.close
          }]
        });
      }, size);
    }

    /**
     * @ngdoc method
     * @name components.ui.msmModal#confirm
     * @methodOf components.ui.msmModal
     *
     * @description
     *     Display a modal confirmation dialog.
     * @param {string} title
     *     The modal's title.
     * @param {string} text
     *     The modal's text.
     * @param {string=} size
     *     The modal's size.
     * @param {string=Ok} closeTitle
     *     The label of the modal's confirm button.
     * @param {string=Cancel} dismissTitle
     *     The label of the modal's cancel button.
     */
    function confirm(title, text, size, closeTitle, dismissTitle) {
      return open(null, function ($modalInstance) {
        var vm = angular.extend(this, {
          title: title,
          text: text,
          buttons: [{
            icon: 'check-circle',
            title: closeTitle || 'Ok',
            context: 'primary',
            onClick: $modalInstance.close
          }, {
            icon: 'close-circle',
            title: dismissTitle || 'Cancel',
            context: 'default',
            onClick: $modalInstance.dismiss
          }]
        });
      }, size);
    }

    /**
     * @ngdoc method
     * @name components.ui.msmModal#select
     * @methodOf components.ui.msmModal
     *
     * @description
     *     Display a modal selection dialog.
     * @param {string} title
     *     The modal's title.
     * @param {string} text
     *     The modal's text.
     * @param {array} options
     *     The modal's selection options.
     * @param {string=} size
     *     The modal's size.
     * @param {string=Ok} closeTitle
     *     The label of the modal's confirm button.
     * @param {string=Cancel} dismissTitle
     *     The label of the modal's cancel button.
     */
    function select(title, text, options, size, closeTitle, dismissTitle) {
      return open({ options: options }, function ($modalInstance, options) {
        var vm = angular.extend(this, {
          title: title,
          text: text,
          buttons: [{
            icon: 'check-circle',
            title: closeTitle || 'Select',
            context: 'primary',
            onClick: select,
            hideMobile: true
          }, {
            icon: 'close-circle',
            title: dismissTitle || 'Cancel',
            context: 'default',
            onClick: $modalInstance.dismiss
          }]
        });

        vm.select = select;
        vm.options = {
          values: options.values,
          selected: options.selected ? options.selected : null
        };

        function select(option) {
          $modalInstance.close(option || vm.options.selected);
        };
      }, size, 'components/ui/msm-modal/msm-modal-select.html');
    }
  }

})();
