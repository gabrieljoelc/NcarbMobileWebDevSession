(function ($) {
    var $jQval = $.validator;
    var $jQvalUnob = $jQval.unobtrusive;

    function setValidationValues(options, ruleName, value) {
        options.rules[ruleName] = value;
        if (options.message) {
            options.messages[ruleName] = options.message;
        }
    }

    function splitAndTrim(value) {
        return value.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/g);
    }

    function getModelPrefix(fieldName) {
        return fieldName.substr(0, fieldName.lastIndexOf(".") + 1);
    }

    function appendModelPrefix(value, prefix) {
        if (value.indexOf("*.") === 0) {
            value = value.replace("*.", prefix);
        }
        return value;
    }
    
    $jQval.addMethod('requiredif',
        function (value, element, parameters) {
            // get the target value (as a string,
            // as that's what actual value will be)
            var targetvalue = parameters['targetvalue'];
            targetvalue =
              (targetvalue == null ? '' : targetvalue).toString();

            // get the actual value of the target control
            // note - this probably needs to cater for more
            // control types, e.g. radios
            var control = $(element).closest('form').find('[name="' + parameters['dependentproperty'] + '"]');
            var controltype = control.attr('type');
            var actualvalue =
                controltype === 'checkbox' ?
                control.is(':checked').toString() :
                control.val();

            // if the condition is true, reuse the existing
            // required field validator functionality
            if (targetvalue === actualvalue)
                return $jQval.methods.required.call(
                  this, value, element, parameters);

            return true;
        }
    );

    $jQval.addMethod("enforcetrue", function (value, element, param) {
        return element.checked;
    });
    $jQvalUnob.adapters.addBool("enforcetrue");



    $jQvalUnob.adapters.add(
    'requiredif',
    ['dependentproperty', 'targetvalue'],
    function (options) {
        options.rules['requiredif'] = {
            dependentproperty: options.params['dependentproperty'],
            targetvalue: options.params['targetvalue']
        };
        options.messages['requiredif'] = options.message;
    });



    $jQvalUnob.adapters.add(
    'datenotfuture', {}, function (options) {
        options.rules['datenotfuture'] = {};
        options.messages['datenotfuture'] = options.message;
    });


    $jQval.addMethod('datenotfuture', function (value, element) {
        if (this.optional(element))
            return "dependency-mismatch";
        var theDate = Date.parse((value == null ? '1/1/0001' : value.toString()));

        if (theDate > new Date())
            return false;
        return true;
    });

    $jQvalUnob.adapters.add(
        'dategreaterthan', ['other'], function (options) {
            options.rules['dategreaterthan'] = {
                other: options.params['other']
            };
            options.messages['dategreaterthan'] = options.message;
        });


    $jQval.addMethod('dategreaterthan', function (value, element, param) {
        var prefix = getModelPrefix(element.name),
            other = param['other'],
            fullOtherName = appendModelPrefix(other, prefix),
            $other = $(element).closest('form').find(':input[name="' + fullOtherName + '"]');

        // bind to the blur event of the target in order to revalidate whenever the target field is updated
        $other.die(".validate-dategreaterthan").live("blur.validate-dategreaterthan", function () {
            $(element).valid();
        });
        var theDate = Date.parse((value == null ? '1/1/0001' : value.toString()));
        return theDate >= Date.parse($other.val());
    });

})(jQuery);