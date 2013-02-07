(function ($) {

    // common event handlers and private methods
    var common = {
        fileInputChange: function (evt) {
            var fileName = $(this).val().split('\\').pop();
            $(this).next('input.file').val(fileName);
        },
        globalFormSubmit: function (evt) {
            $(this).find(':submit').addLoadIndicator();
        },
        disabledClick: function (evt) {
            evt.preventDefault();
        },
        showHideInputChange: function (evt) {
            var $input = $(this);
            if ($input.is(':checkbox')) {
                var slider = $input.parent().siblings();
                if (slider.is(':visible') != $input.is(':checked'))
                    slider.slideToggle($input.is(':checked'));
            }
            else {
                $input.parent().siblings().slideToggle();
            }
            $input.siblings('.ui-state-error').slideToggle(0);
        },
        windowUnload: function (evt) {
            $.buttonize('enable');
        },
        tipIcnHover: function (evt) {
            $(this).siblings('div').toggleClass('showTip');
        },
        addrCountrySelectChange: function (evt) {
            $(this).showAddr();
        },
        expandCollapseClick: function (evt) {
            var elem = null;
            if ($(this).is('h4')) {
                elem = $(this);
            }
            else {
                elem = $(this).closest('h3');
            }

            elem.siblings('dl:first, section')
                .slideToggle()
                .closest('.collapse')
                .toggleClass('close');
        },
        navTabClick: function (evt) {
            evt.preventDefault();
            $(this).navTabToggle();
        },
        actionsDropDownButtonClick: function (evt) {
            evt.preventDefault();
            $(this).siblings('ul').toggle();
        },
        sidebarTabsClick: function (evt) {
            $(this)
			    .closest('.panel').addClass('open')
			    .siblings('.panel').removeClass('open');
            $.resizeTabContent();
        },
        sidebarTabLinkClick: function (evt) {
            if (!$(this).closest('.panel').hasClass('open')) {
                //can't fire the click() event because it will cause infinite loop
                window.location = $(this).find('a:visible:first-child').attr('href');
            }
        },
        tableExpandCollapseClick: function (evt) {
            var rowsToToggle = [];
            var table = $(this).closest('table tbody');
            var rows = $('tr', table);
            var clickedIndex = rows.index($(this).parent());

            $(this).parent().toggleClass('close');

            for (var i = clickedIndex + 1; i < rows.length; i++) {
                if (!$(rows[i]).hasClass('toggle') && !$(rows[i]).hasClass('subTotal')) {
                    rowsToToggle.push(rows[i]);
                } else {
                    break;
                }
            }

            $(rowsToToggle).toggle();
        },
        tableAllExpandCollapseClick: function (evt) {
            if ($(this).hasClass('expand')) {
                $('.show-hide .toggle.close .head').click();
            }
            if ($(this).hasClass('collapse')) {
                $('.show-hide .toggle:not(.close) .head').click();
            }
            evt.preventDefault();
        }
    };

    $(document).delegate('.disabled', 'click', common.disabledClick);
    $(document).delegate('form', 'submit', common.globalFormSubmit);
    $(document).delegate('.showhide input', 'change', common.showHideInputChange);
    $(window).unload(common.windowUnload);
    $(document).on('mouseenter mouseleave', '.tip .icn', common.tipIcnHover);
    $(document).delegate('select.address-country', 'change', common.addrCountrySelectChange);
    $(document).delegate('.collapse h3 strong, .collapse h3 strong+span, .collapse h4', 'click', common.expandCollapseClick);
    if ($('.tabContainer > div.current')) {
        $(document).on('click', '.column section nav a, .tabContent nav a, nav.tabsNav li a', common.navTabClick);
    }
    $(document).delegate('.actionsDropDown .button', 'click', common.actionsDropDownButtonClick);
    $(document).delegate('.evr .sidebarTabs .tab h3', 'click', common.sidebarTabsClick); // vertical tab navigation
    $(document).delegate('.evr .sidebarTabs .tabLink h3', 'click', common.sidebarTabLinkClick); // vertical tab navigation
    $(document).delegate('.toggle td.head', 'click', common.tableExpandCollapseClick);
    // Expand/Collapse All Rows
    $(document).delegate('.all a', 'click', common.tableAllExpandCollapseClick);

    // Simplified Toggle Function for nested forms (EVR)
    $(document).delegate('select.toggle', 'change', function () {
        $(this).inputToggleList('blind');
    });

    if (!$.browser.msie) {
        $(document).delegate('input[name=fakeFile], a.browse', 'click', function (evt) {
            evt.preventDefault();
            $(this).siblings('input:file').click();
        });
        $(document).delegate('input:file', 'change', common.fileInputChange);
    }

    // global AJAX
    $(document).ajaxStop(function (evt, jqRequest, ajaxOpts) {
        $.notify();
        $.removeLoadIndicator();
        $.globalDefaults();
    });

    // IE-specific
    if ($('html.ie').length == 1) { // IE button hover (depends on IE9.js)
        $('button').hover(function () {
            $(this).addClass('hover');
        }, function () {
            $(this).removeClass('hover');
        });
    }

    // global initializations
    $('html').removeClass('no-js'); // is this the right place for this?
    $.datepicker.setDefaults({
        showOn: "both",
        buttonImage: $('#dateIcon').attr('href'),
        buttonImageOnly: true,
        changeMonth: true,
        changeYear: true
    });
    // TODO: should we move these to global defaults
    $('.showhide input:checkbox:not(:checked)').parent().siblings().hide();
    $('.showhide input:checked').parent().siblings().show();
    $('.collapse.close dl:first, .collapse.close section:first, .collapse .collapse.close section').hide();
    $('.tabContainer > div.current').siblings('div').hide();


    $.globalDefaults();
    $.notify();

    $.datepicker.setDefaults({
        beforeShow: function () {
            setTimeout(function () {
                $(".ui-datepicker").css("z-index", 999);
            }, 10);
        }
    });
})(jQuery);