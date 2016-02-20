import angular from 'angular';

const FormChange = [
  '$timeout',
  $timeout => {
    return {
      restrict: 'A',
      link(scope, $element) {
        // Get all editable inputs
        const $inputs = $element[0].getElementsByClassName('matrix-item__input_editable');
        let   changed = 0;
        let   empty   = 0;

        $timeout(() => { // $timeout there is for digist
          [].forEach.call($inputs, $input => { // Iterate html collection
            $input.addEventListener('change', () => { // On each input change
              scope.$parent.$parent.$root.serviceType = 'edit';
              scope.$parent.$parent.$root.service.multiplyError = false;
              scope.$parent.$parent.$root.$apply();
              if ($input.value) {
                changed++;
              } else {
                empty++;
              }
              if (changed === empty) { // Compare number of edited and empty inputs
                scope.$parent.$parent.$root.serviceType = 'default';
                scope.$parent.$parent.$root.$apply();
              }
            });
          });
        });
      }
    };
  }
];

export default angular.module('Matrix.Home.FormChange', []).directive('formChange', FormChange).name;
