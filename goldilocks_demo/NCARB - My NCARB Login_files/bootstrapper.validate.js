(function ($) {
    var $jQval = $.validator;
    var $jQvalUnobExt = $jQval.unobtrusive.ext;

    $jQval.setDefaults({
        // have to override the validClass because of EightShapes .valid selector for valid input checkmarks
        validClass: 'input-validation-valid',
        ignore: ":hidden"

    });

    $.validator.setDefaults({
        highlight: $jQvalUnobExt.highlight,
        unhighlight: $jQvalUnobExt.unhighlight
    });

    $.repositionValidationSummary();

    // this method is a required workaround for the focusout issue with select elements that have
    // sb (select-box) applied to them not focusing out. The forced focusout in this method
    // triggers the validate.unobtrusive.afterError method; thus, ensuring that all error treatments
    // get removed if the select element is valid
    $(document).delegate('form :input:not(:button)', 'focusin', function (evt) {
        if ($jQvalUnobExt.lastActiveSelectElem) {
            $($jQvalUnobExt.lastActiveSelectElem).focusout().keyup().blur();
            $jQvalUnobExt.lastActiveSelectElem = null;
        }
        if ($(this).is('select')) {
            $jQvalUnobExt.lastActiveSelectElem = this;
        }
    });

    $('form').bind('invalid-form.validate', $jQvalUnobExt.afterOnErrors);

    $(document).delegate('.form-reset', 'click', function (evt) {
        evt.preventDefault();
        $(this).closest('form').formReset();
    });

    $(document).delegate('input[type=reset]', 'click', function () {
        $(this).closest('form').resetValidation();
    });

})(jQuery);