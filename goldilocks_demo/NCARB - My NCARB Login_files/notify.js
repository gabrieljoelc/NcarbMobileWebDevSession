(function ($) {

    var _defaultCookieKey = '__myncarb.notifications';
    var type = ['success', 'info', 'error'];
    var duration = ['temporary', 'permanent', 'permanentCanClose'];
    var container = $('.notifyContainer');

    $.extend($.fn, {
        unnotify: function () {
            var fadeSpeed = this.data('fadeSpeed'); // try get fade speed option
            // if fade speed is set, then use it. otherwise use default fade speed
            this.fadeOut(fadeSpeed ? fadeSpeed : $.notify.defaults.fadeSpeed, function () {
                //$(this).hide().undelegate('.close', 'click');
                $(this).hide().remove();
                hideNotifyIfAllNotifsAreHidden();
            });
        }
    });

    $.extend({
        notify: function (opts) {
            opts = $.extend({}, $.notify.defaults, opts || {});
            // array of elements (not a jquery object)
            var notifyLiArr = []; // $.makeArray($('.notify').find('li'));
            var cookieKey = opts.cookieKey ? opts.cookieKey : _defaultCookieKey;

            var notifys = $.jCookies({ get: cookieKey });
            if (notifys && $.isArray(notifys) && notifys.length > 0) {
                notifyLiArr = buildHtml(notifys);
                $.jCookies({ erase: cookieKey });
            }
            else if(notifys && $.isArray(notifys) && notifys.length === 0) {
                container.empty();
            }

            function innerNotify(notifyLiArr, opts) {
                var $notify = $(notifyLiArr.pop());
                $notify.data(opts); // attach options to elem
                if ($notify.is('.temporary')) { // if temporary class, then set timeout
                    $notify.data('setTimeout', setTimeout(function () { $notify.unnotify(); }, opts.timeout));
                }
                $notify.fadeIn(opts.fadeSpeed, function () {
                    innerNotify(notifyLiArr, opts); // when fadeIn is complete, make recursive call with remaining notifications
                });
            }

            innerNotify(notifyLiArr, opts); // base call to start fading in notifications
        }
    });

    function hideNotifyIfAllNotifsAreHidden() {
        if ($('.notify').find('li:visible').length == 0) {
            $('.notify').hide();
        }
    }

    function buildHtml(notifys) {
        var notifyLiArr = [];
        if (container.length == 0) return;
        var ul = container.find('ul:first-child');
        var ulExists = ul.length == 1;
        if (!ulExists) {
            ul = $('<ul />');
        }

        ul.empty().addClass('notify');

        $.each(notifys, function (index, elem) {
            var notify = notifys[index];
            var li = $('<li />').addClass(type[notify.Type]).addClass('alert');
            var mainSpan = $('<span />').addClass(type[notify.Type] != 'error' ? 'ui-state-highlight' : 'ui-state-error');
            if (notify.Duration == 0 || notify.Duration == 2) { // temporary or permanentCanClose
                mainSpan.append(
                    $('<a href="#" />')
                        .addClass('close')
                        .append($('<span />').addClass('ui-icon ui-icon-close')));
            }
            if (notify.Title && notify.Title != '') {
                mainSpan.append($('<strong />').text(notify.Title));
            }
            if (notify.Duration == 0) { // temporary
                li.addClass(duration[notify.Duration]);
            }
            notifyLiArr.push(li.append(mainSpan.append($('<span />').html(notify.Message))));
            ul.append(notifyLiArr[index]);
        });

        if (!ulExists) {
            container.html(ul);
        }

        return notifyLiArr;
    }

    $('.notifyContainer').delegate('.close', 'click', function (evt) {
        evt.preventDefault();
        var $notify = $(this).closest('li');
        var setTimeout = $notify.data('setTimeout');
        if (setTimeout) { clearTimeout(setTimeout); }
        $notify.unnotify();
    });

    $.notify.defaults = {
        fadeSpeed: 400,
        timeout: 10000
    };

})(jQuery);