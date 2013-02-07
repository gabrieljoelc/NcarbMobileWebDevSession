(function ($) {

    // chrome userAgent
    $.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());

    // common custom jQuery plugin methods
    $.extend($.fn, {
        addJquiOverlay: function () {
            return this.each(function (index, elem) {
                $('<div class="ui-overlay"></div>')
                    .appendTo(elem)
                    .fadeIn();
            });
        },
        removeJquiOverlay: function () {
            return this.each(function (index, elem) {
                $(elem).find('.ui-overlay')
                    .fadeOut()
                    .remove();
            });
        },
        addLoadIndicator: function () {
            $.blockUI({
                css: { cursor: 'default' },
                overlayCSS: { opacity: 0, cursor: 'default' },
                message: ''
            });
            if ($.browser.msie && $.browser.version < 8) return;
            return this.each(function (index, elem) {
                if ($(elem).isButtonizable()) {
                    $(elem).append('<span class="loading"></span>'); // appends the span.loading to button and anchor elements
                } else {
                    $(elem).after('<span class="loading"></span>'); // TODO: add the ability to override styles for non-button spinner
                }
            });
        },
        removeLoadIndicator: function () {
            $.unblockUI();
            if ($.browser.msie && $.browser.version < 8) return;
            return this.each(function (index, elem) {
                if ($(elem).isButtonizable()) {
                    $(elem).button('destroy').buttonize(); // this jQuery UI function will remove any non-jqueryUI added content (i.e. the span.loading that is appended)
                } else {
                    $(elem).next('.loading').remove(); // TODO: add the ability to override styles for non-button spinner
                }
            });
        },
        isButtonizable: function () {
            return this.is('.showhide input, button, a.button');
        },
        buttonize: function (opts) {
            var buttonOpts = {};
            if (opts && typeof (opts) == 'string') {
                buttonOpts = opts;
            } else {
                buttonOpts = $.extend(buttonOpts, opts);
            }

            return this.each(function (index, elem) {
                var $elem = $(elem);
                if ($elem.is('.disabled') || $elem.attr('disabled') == 'disabled') {
                    $elem.button($.extend({}, buttonOpts, { disabled: true }));
                } else {
                    $elem.button(buttonOpts);
                }

            });
        },
        showAddr: function () {
            return this.each(function (index, elem) {
                var select = $(elem);
                var countryType = '.US';
                if (select.val() != 840 && select.val() != 124) {
                    countryType = '.FN';
                } else if (select.val() == 124) {
                    countryType = '.CA';
                }
                var allOptions = select.closest('li').siblings('.option').hide();
                allOptions.find(':input').attr('disabled', true);
                var selectedOption = allOptions.filter(countryType);
                selectedOption.show().find(':input').removeAttr('disabled');
                selectedOption.find('.disabled').removeClass('disabled');
                selectedOption.find('select.provinces, select.states').sb('refresh');

                
                
                
            });
        },
        datify: function (opts, noPlcHldr) {
            var options = {};
            if (opts && typeof (opts) == 'string') {
                options = opts;
            } else if (opts) {
                options = $.extend(options, opts);
            }
            this.each(function (index, elem) {
                var max = null;
                var $elem = $(elem);
                var preventFuture = $elem.is('[data-val-datenotfuture]');
                if (preventFuture) {
                    max = new Date();
                }
                var optsSpecific = $.extend(options, { maxDate: max });

                $elem.datepicker(options);

                if (!noPlcHldr) {
                    $elem.attr('placeholder', 'MM/DD/YYYY');
                }
            });
            return $(this);
        },
        disable: function () {
            return this.each(function (index, elem) {
                var $elem = $(elem);
                $elem.attr('disabled', true);

                if ($elem.is('select')) {
                    $elem.sb('refresh');
                }
                else if ($elem.is('button, .button')) {
                    $elem.buttonize();
                }
            });
        },
        disableExceptInner: function () {
            return this.find('a:not(:hidden), :input:not(:hidden)').disableExcept();
        },
        disableExcept: function (parent) {
            if (parent) {
                $(parent).find('a:not(:hidden), :input:not(:hidden)').not(this).disable();
            } else {
                $('a:not(:hidden), :input:not(:hidden)').not(this).disable();
            }
            return this;
        },
        enable: function () {
            return this.each(function (index, elem) {
                var $elem = $(elem);
                $elem.removeAttr('disabled');
                $elem.removeClass('disabled');

                if ($elem.is('select')) {
                    $elem.sb('refresh');
                }
                if ($elem.is('button, .button')) {
                    $elem.buttonize();
                }
                // TODO: enable disabled events on non-input elements
            });
        },
        sortSelect: function (prop) {
            prop = prop ? prop : 'text';
            var options = this.find('option');
            options.sort(function (a, b) {
                if (a[prop] > b[prop]) return 1;
                else if (a[prop] < b[prop]) return -1;
                else return 0;
            });
            return this.empty().append(options);
        },
        sortSelectListByText: function () {
            var myOptions = $("#" + this.attr('id') + ' option');
            myOptions.sort(function (a, b) {
                if (a.text > b.text) return 1;
                else if (a.text < b.text) return -1;
                else return 0;
            });
            $(this).empty().append(myOptions);
        },
        sortSelectListByValue: function () {
            var myOptions = $("#" + this.attr('id') + ' option');
            myOptions.sort(function (a, b) {
                var aValue = parseInt(a.value);
                var bValue = parseInt(b.value);
                return aValue == bValue ? 0 : aValue < bValue ? -1 : 1;
            });
            $(this).empty().append(myOptions);
        },
        inputToggleList: function (fx, value) {
            var select = this;
            return select.each(function (index, elem) {
                var $elem = $(elem);
                var collapseSelector = '.collapse';
                //                if (value) {
                //                    collapseSelector += '[data-collapse-val=' + value + ']';
                //                }
                if ($elem.val() == (value ? value : '')) {
                    $elem.siblings(collapseSelector).show(fx).removeClass('close');
                } else {
                    fx = $elem.siblings(collapseSelector).hasClass('close') ? null : fx;
                    $elem.siblings(collapseSelector).hide(fx).addClass('close');
                }
            });
        },
        populateFromJson: function (jsonData, prefix) {
            var form = $(this);
            prefix = prefix ? prefix : '';

            if (typeof jsonData === 'string') {
                jsonData = JSON.parse(jsonData);
            }

            for (var item in jsonData) {
                if (jsonData[item] == null) {
                    continue;
                }

                if ($.isPlainObject(jsonData[item])) {
                    form.populateFromJson(jsonData[item], prefix + '.' + item);
                }

                var formElement = this.find('[name="' + prefix + '.' + item + '"]');

                if (formElement.is(':checkbox, :radio')) {
                    formElement.attr('checked', jsonData[name]);
                } else {
                    formElement.val(jsonData[item]);
                }
            }
            return this;
        },
        serializeToJS: function () {
            var obj = {};
            $.each(this.serializeArray(), function (index, elem) {
                obj[elem.name] = elem.value;
            });
            return obj;
        },
        serializeToJSON: function () {
            var obj = this.serializeToJS();
            return JSON.stringify(obj);
        },
        filize: function () {
            if ($.browser.msie) {
                return this.addClass('full');
            } else {
                return this.each(function (index, elem) {
                    var file = $(elem);
                    if (!file.data('filized')) {
                        file.css({
                            visibility: 'hidden',
                            position: 'absolute',
                            left: '-9999em'
                        }).data('filized', true).after('<input type="text" name="fakeFile" class="file" readonly /><a href="#" class="button secondary browse auto">Browse</span>');
                    }
                });
            }
        },
        navTabToggle: function () {
            this.closest('ul').find('a').removeClass('current');
            var panelId;
            if (this.addClass('current').is('[data-tab-panelId]')) {
                panelId = '#' + this.attr('data-tab-panelId');
            }
            else {
                panelId = this.attr('href');
            }
            $(panelId)
                .show()
                .addClass('current')
                .siblings('div')
                .hide()
                .removeClass('current');
            return this;
        }
    });

    // common custom global jQuery plugin methods
    $.extend({
        removeLoadIndicator: function () {
            $('button').removeLoadIndicator();
        },
        debug: function (msg) {
            var debug = $('#debug');
            if (debug.length == 0) {
                debug = $('<div id="debug" class="debugStatus"></div>').appendTo('body');
            }
            if (!msg || msg == '') {
                msg = '(msg is empty)';
            }
            debug.append('<p>' + msg + '</p>');
        },
        buttonize: function (opts) {
            if (!opts) opts = { disabled: false };
            $('.showhide input, button, a.button').buttonize(opts);
        },
        globalDefaults: function () {
            $.buttonize();
            $(".label label").inFieldLabels();
            $('.inline.report-hours input:text').prev('label').inFieldLabels().addClass('infield');
            $('label[for=search]').inFieldLabels().addClass('infield'); // TODO: refactor when we get the EightShapes search UI Tech deliverable
            $('select:not(.chosen,.ui-datepicker-month,.ui-datepicker-year,.nosb)').sb({ fixedWidth: true, useTie: true });
            $(".chosen").chosen();
            $('input.date').datify();
            $('select.address-country').showAddr();
            $('input:file').filize();
            $(".tip .icn").button({
                icons: {
                    primary: "ui-icon-help"
                },
                text: false
            });
        },
        enable: function () {
            $('.disabled').enable();
        },
        resizeTabContent: function () {
            var height = $('.tabContent:visible').outerHeight();
            var padding = parseInt($('.screen .evr article').css('padding-top')) + parseInt($('.screen .evr article').css('padding-bottom'));
            $('.screen .evr article').animate({
                height: height + padding
            });
        },
        createSelect: function (aData, c) {
            var r = '<select multiple data-placeholder="' + $('table th:nth-child(' + c + ')').text() + '">', i, iLen = aData.length;
            for (i = 0; i < iLen; i++) {
                r += '<option value="' + aData[i] + '">' + aData[i] + '</option>';
                //console.log(aData);
            }
            return r + '</select>';
        },
        getQueryStrObjFromUrl: function (url) {
            var urlSplit = url.split('?');
            if (urlSplit.length < 2) return;
            return getQueryStrObjFromQueryStrSplitArray(urlSplit[1].split('&'));
        },
        emptyGuid: function () {
            return '00000000-0000-0000-0000-000000000000';
        },
        parseMsJsonDate: function (msJsonDate) {
            if (!msJsonDate) return null;
            var intDate = parseInt(msJsonDate.substring(6));
            if (!intDate || intDate === NaN) return null;
            return new Date(intDate);
        },
        // http://stackoverflow.com/questions/643782/how-to-know-if-an-object-is-a-date-or-not-with-javascript (answer with the most votes)
        isDateType: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Date]';
        },
        //Column-finding helper method.
        //Restricts a set of elements to those having data-columnTag={columnTag}. This is used instead of a
        //   cell index because colspan and rowspan would complicate which column an element belongs to.
        //   It also allows this code to be used on non-tabular data, or to grab rows instead of columns.
        getColumn: function (columnTag) {
            return columnTag
                ? function (sequence) {
                    return sequence.filter('[data-columnTag="' + columnTag + '"]');
                }
                : function (sequence) {
                    return sequence;
                };
        },
        getOneDayTicks: (function () {
            var day = (24 * 60 * 60 * 1000);
            return day;
        })(),
        threeLetterDayNames: (function () {
            var dayNames = new Array();
            dayNames[dayNames.length] = "Sun";
            dayNames[dayNames.length] = "Mon";
            dayNames[dayNames.length] = "Tue";
            dayNames[dayNames.length] = "Wed";
            dayNames[dayNames.length] = "Thu";
            dayNames[dayNames.length] = "Fri";
            dayNames[dayNames.length] = "Sat";

            return function (index) {
                return dayNames[index];
            };
        })(),
        queryString: (getQueryStrObjFromQueryStrSplitArray)(window.location.search.substr(1).split('&'))
    });

    function getQueryStrObjFromQueryStrSplitArray(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    }

    $.fn.dataTableExt.oApi.fnGetColumnData = function (oSettings, iColumn, bUnique, bFiltered, bIgnoreEmpty) {
        // check that we have a column id
        if (typeof iColumn == "undefined") return new Array();

        // by default we only wany unique data
        if (typeof bUnique == "undefined") bUnique = true;

        // by default we do want to only look at filtered data
        if (typeof bFiltered == "undefined") bFiltered = true;

        // by default we do not wany to include empty values
        if (typeof bIgnoreEmpty == "undefined") bIgnoreEmpty = true;

        // list of rows which we're going to loop through
        var aiRows;

        // use only filtered rows
        if (bFiltered == true) aiRows = oSettings.aiDisplay;
        // use all rows
        else aiRows = oSettings.aiDisplayMaster; // all row numbers

        // set up data array    
        var asResultData = new Array();

        for (var i = 0, c = aiRows.length; i < c; i++) {
            iRow = aiRows[i];
            var aData = this.fnGetData(iRow);
            var sValue = aData[iColumn];

            // ignore empty values?
            if (bIgnoreEmpty == true && sValue.length == 0) continue;

            // ignore unique values?
            else if (bUnique == true && jQuery.inArray(sValue, asResultData) > -1) continue;

            // else push the value onto the result data array
            else asResultData.push(sValue);
        }

        return asResultData;

    };

})(jQuery);


// http://erraticdev.blogspot.com/2010/12/converting-dates-in-json-strings-using.html
/*!
* jQuery.parseJSON() extension (supports ISO & Asp.net date conversion)
*
* Version 1.0 (13 Jan 2011)
*
* Copyright (c) 2011 Robert Koritnik
* Licensed under the terms of the MIT license
* http://www.opensource.org/licenses/mit-license.php
*/
(function ($) {

    // JSON RegExp
    var rvalidchars = /^[\],:{}\s]*$/;
    var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
    // this ISO 8601 date regex didn't seem to work, so I used the on from this blog: http://underground.infovark.com/2008/07/22/iso-date-validation-regex/ 
    //var dateISO = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.,]\d+)?Z/i;
    var dateISO = /^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])(\D?([01]\d|2[0-3])\D?([0-5]\d)\D?([0-5]\d)?\D?(\d{3})?([zZ]|([\+-])([01]\d|2[0-3])\D?([0-5]\d)?)?)?$/i;
    var dateNet = /\/Date\((\d+)(?:-\d+)?\)\//i;

    // replacer RegExp
    var replaceISO = /"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:[.,](\d+))?Z"/i;
    var replaceNet = /"\\\/Date\((\d+)(?:-\d+)?\)\\\/"/i;

    // determine JSON native support
    var nativeJSON = (window.JSON && window.JSON.parse) ? true : false;
    var extendedJSON = nativeJSON && window.JSON.parse('{"x":9}', function (k, v) { return "Y"; }) === "Y";
    var innerIncludeISOTime = true;

    var jsonDateConverter = function (key, value) {
        if (typeof (value) === "string") {
            var a = dateISO.exec(value);
            if (a) {
                var date = new Date(+a[1], +a[2] - 1, +a[3], 0, 0, 0, 0);
//                date.setYear(+a[1]);
//                date.setMonth(+a[2] - 1);
//                date.setDate(+a[3]);
                if (innerIncludeISOTime) {
                    date.setHours(+a[5]);
                    date.setMinutes(+a[6]);
                    date.setSeconds(+a[7]);
                }
                return date;
            }
            if (dateNet.test(value)) {
                return new Date(parseInt(dateNet.exec(value)[1], 10));
            }
        }
        return value;
    };
    
//    var jsonDateConverter = function (key, value) {
//        var a;
//        if (typeof value === 'string') {
//            a = dateISO.exec(value);
//            if (a) {
//                new Date(Date.UTC(+a[1], +a[2], +a[3], +a[5], +a[6], +a[7]));
//            }
//        }
//        return value;
//    };

    $.extend({
        isJsonString: function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        },
        parseJSON: function (data, convertDates, includeISOTime) {
            /// <summary>Takes a well-formed JSON string and returns the resulting JavaScript object.</summary>
            /// <param name="data" type="String">The JSON string to parse.</param>
            /// <param name="convertDates" optional="true" type="Boolean">Set to true when you want ISO/Asp.net dates to be auto-converted to dates.</param>

            if (typeof data !== "string" || !data) {
                return null;
            }
            innerIncludeISOTime = includeISOTime;
            // Make sure leading/trailing whitespace is removed (IE can't handle it)
            data = $.trim(data);

            // Make sure the incoming data is actual JSON
            // Logic borrowed from http://json.org/json2.js
            if (rvalidchars.test(data
                .replace(rvalidescape, "@")
                .replace(rvalidtokens, "]")
                .replace(rvalidbraces, ""))) {
                // Try to use the native JSON parser
                if (extendedJSON || (nativeJSON && convertDates !== true)) {
                    return window.JSON.parse(data, convertDates === true ? jsonDateConverter : undefined);
                }
                else {
                    data = convertDates === true ?
                        data.replace(replaceISO, "new Date(parseInt('$1',10),parseInt('$2',10)-1,parseInt('$3',10),parseInt('$4',10),parseInt('$5',10),parseInt('$6',10),(function(s){return parseInt(s,10)||0;})('$7'))")
                            .replace(replaceNet, "new Date($1)") :
                        data;
                    return (new Function("return " + data))();
                }
            } else {
                $.error("Invalid JSON: " + data);
            }
        }
    });
})(jQuery);
