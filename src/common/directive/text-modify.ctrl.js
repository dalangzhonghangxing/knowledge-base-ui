(function () {
    'use strict';

    var Utils = angular.module('Utils');
    Utils.controller("TextModifyCtrl",
                     ["$uibModalInstance", "head", "value", "fields", "labels", "func", TextModifyCtrl]);

    function TextModifyCtrl($uibModalInstance, head, value, fields, labels, func) {
        var vm = this;

        vm.head = head;
        vm.value = value;
        vm.fields = fields;
        vm.labels = labels;

        vm.cancel = cancel;
        vm.submit = submit;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function submit() {
            if (func != null)
                func(value);
            $uibModalInstance.dismiss('cancel');
        }
    }
})();