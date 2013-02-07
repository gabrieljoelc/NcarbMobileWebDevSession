(function ($) {
    var $jQval = $.validator;

    $jQval.unobtrusive.ext = {
        afterOnErrors: function (form, validator) {
            if (validator.errorList.length > 0) {
                $.removeLoadIndicator();
            }
            $(form).repositionValidationSummary();
        },
        highlight: function (element, errorClass, validClass) {
            var $input = $(element);

            $input
                .addClass(errorClass).addClass('error').removeClass(validClass)
                .prev('.selectbox').find('.display').addClass('sbError'); // for selectbox containers
            $input.next('span.valid').hide();

            $(element.form).find("span[data-valmsg-for='" + element.name + "']")
                .addClass('ui-state-error');
        },
        unhighlight: function (element, errorClass, validClass) {
            var $input = $(element);

            $input
                .removeClass(errorClass).removeClass('error').addClass(validClass)
                .prev('.selectbox').find('.display').removeClass('sbError'); // for selectbox containers
            if ($(element.form).is('.showValid') && $(element.form).find("span[data-valmsg-for='" + element.name + "']").length > 0
                && $input.next('span.valid').show().length == 0) {
                $input.after('<span class="valid">Entry Accepted</span>');
            }

            $(element.form).find("span[data-valmsg-for='" + element.name + "']")
                .removeClass('ui-state-error');
        },
        lastActiveSelectElem: null
    };

    $.extend({
        repositionValidationSummary: function () {
            $('form[action]').repositionValidationSummary();
        }
    });

    $.extend($.fn, {
        showValidationTreatments: function () {
            this.each(function (index, formElem) {
                var $form = $(formElem);

                // add error css
                $form.find('.input-validation-error:input').each(function (i, inputErrorElem) {
                    $(inputErrorElem).addClass('error').prev('.selectbox').find('.display').addClass('sbError'); // for selectbox containers
                });
                $form.find('.field-validation-error').addClass('ui-state-error');

                // add valid css
                if ($form.is('.showValid')) {
                    $form.find('.field-validation-valid').each(function (i, fieldValidElem) {
                        var input = $form.find("[name='" + $(fieldValidElem).attr('data-valmsg-for') + "']");
                        if (input.next('span.valid').show().length == 0) {
                            input.after('<span class="valid">Entry Accepted</span>');
                        }
                    });
                }
            });
        },
        repositionValidationSummary: function () {
            this.find('.validation-summary-errors').each(function (index, elem) {
                var summary = $(elem);
                if (summary.find('li').length > summary.find('li:empty').length) {
                    if (summary.is('.headerValidationSummaryErrors')) {
                        $('.screen header .validation-summary-errors').remove();
                        summary = summary.clone().insertAfter('.screen header div:first');
                    }
                    if (summary.addClass('alert').show().find('span:first-child:first').addClass('ui-state-error').length == 0) {
                        summary.find('ul:first').addClass('ui-state-error');
                    }
                }
            });
        },
        resetValidation: function () {
            var $form = this;

            //reset jQuery Validate's internals
            $form.validate().resetForm();

            //reset unobtrusive validation summary, if it exists
            $form.find('[data-valmsg-summary=true]')
                .removeClass('validation-summary-errors')
                .removeClass('ui-state-error')
                .addClass('validation-summary-valid')
                .find('ul').empty();

            //reset unobtrusive field level, if it exists
            $form.find('[data-valmsg-replace]')
                .removeClass('field-validation-error')
                .removeClass('ui-state-error')
                .addClass('field-validation-valid')
                .empty();

            $form.find(':visible:input')
                .removeClass('error');

            if ($form.is('.showValid')) {
                $('.valid').hide();
            }
            return $form;
        },
        //reset a form given a jQuery selected form or a child
        //by default validation is also reset
        formReset: function (resetValidation) {
            var $form = this;

            $form[0].reset();

            if (resetValidation == undefined || resetValidation) {
                $form.resetValidation();
            }

            return $form;
        },
        jQValParse: function () {
            $.validator.unobtrusive.parse(this.closest('form').removeData("validator").removeData("unobtrusiveValidation")[0]);
            return this;
        },
        validateClosestForm: function () {
            return this.closest('form').data('validator').form();
        }
    });

})(jQuery);