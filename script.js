$.lang = {
    tr: {
        share_colors: "Renkleri paylaş",
        input_code: "Kodu giriniz",
        input: "Yükle",
        not_there_are_lang: "Böyle bir dil yok!",
        fix: "Düzelt"
    },
    en: {
        share_colors: "Share your colors",
        input_code: "Input the code",
        input: "Import",
        not_there_are_lang: "There are not have this lang!",
        fix: "Fix"
    }
};

$.cookie = {
    getCookie: function (name = null) {
        let cookies = document.cookie.split('; ');
        let _cookies = {};

        cookies.forEach(function (item, index) {
            delete cookies[index];

            let cookie = item.split('=');
            let val = "";

            cookie.forEach(function (_v, _i) {
                if (_i != 0) {
                    val += _v;
                }
            });
            if (val) {
                _cookies[cookie[0]] = val;
            }
        });
        if (name) {
            return _cookies[name];
        } else {
            return _cookies;
        }
    },
    setCookie: function (name, val) {
        if (!$.cookie.getCookie()[name]) {
            document.cookie = `${name}=${val}; expires=Thu, 18 Dec 2040 12:00:00 UTC; path=/`;
        }
    },
    deleteCookie: function (name) {
        document.cookie = `${name}=; expires=Thu, 18 Dec 1970 12:00:00 UTC; path=/`
    }
};

function* iterate_object(o) {
    var keys = Object.keys(o);
    for (var i = 0; i < keys.length; i++) {
        yield [keys[i], o[keys[i]]];
    }
}

$.dos = {
    restart: function () {
        $('.loading-overlay').remove();

        $('body').off('keydown');

        $('body').on('keydown', function (e) {
            if (e.ctrlKey == true && e.key == "s") {
                $.dos.restart();
            }
        });

        setTimeout(function () {

            $('.table').off();
            $('circle').off();
            $('.close-wrapper').off();
            $('.modal-close').off();
            $('.ace_text-input').off('input');

            ['.close-wrapper', '.modal-close'].forEach(function (item, index) {
                $(item).on('click', function () {
                    $(this).parent().parent().remove();
                    if ($.cookie.getCookie().theme == "dark") {
                        $('#dark-mode-btn').click();
                    }

                    $.dos.restart();
                });
            });

            $('.ace_text-input').on('input', function () {
                $.dos.events();
            });

            $('.table').each(function (index, s) {
                let item = $(s);
                let header = item.find('.table-header');
                let table_name = header.find('title').html();

                item.find('circle').on('click', function () {
                    let circle = $(this);
                    //$('.modal-close').click();
                    $('.d-modal').parent().remove();

                    let color = circle.attr('fill');

                    header.attr('style', `fill: ${color} !important;`);
                    $.cookie.deleteCookie(`table|${table_name}`);
                    $.cookie.setCookie(`table|${table_name}`, [document.URL, color]);
                });
            });
            $.dos.events();
        }, 200);
    },
    events: function () {

        let palette = $('.palette');

        palette.off();

        palette.on('click', function () {
            $.dos.restart();
        });

        $.dos.loadTables();
    },

    loadTables: function () {
        for (var [index, s] of iterate_object($.cookie.getCookie())) {
            let item = s.split(",");
            if (document.URL == item[0]) {
                if (index.search('table|') > -1) {
                    let title = index.replace('table|', '');
                    let color = item[1];
                    $(`.table-header title`).filter(function () {
                        return $(this).html() == title
                    }).parent().attr('style', `fill: ${color} !important;`);
                }
            }
        }
    },

    deleteTables: function () {

        $('.table .table-header').removeAttr('style');

        for (var [index, s] of iterate_object($.cookie.getCookie())) {
            let item = s.split(",");
            if (document.URL == item[0]) {
                if (index.search('table|') > -1) {
                    $.cookie.deleteCookie(index);
                }
            }
        }
        $.dos.loadTables();
    }

};


$.dos.restart();

$(function () {
    $.dos.events();

    $('#dark-mode-btn').on('click', function () {
        let modal = $('.toggle-modal');

        if ($('[data-theme]').attr('data-theme') == "dark" || modal.length) {
            modal.parent().remove();
            $.cookie.setCookie('theme', 'dark');
            //$('[data-theme]').attr('data-theme', 'dark');
        } else {
            $.cookie.deleteCookie('theme');
        }

        $.dos.restart();
    });

    if ($.cookie.getCookie().theme == "dark") {
        setTimeout(function () {

            let btn = $('#dark-mode-btn');

            if (!btn.find('input[type="checkbox"]').is(':checked')) {
                btn.click();
            }

            $.dos.restart();
        }, 500);
    }
});

function shareCrackTableColor() {
    let share = "";
    for (var [index, s] of iterate_object($.cookie.getCookie())) {
        let item = s.split(",");
        if (document.URL == item[0]) {
            if (index.search('table|') > -1) {
                share += `${index}=${item};`;
            }
        }
    }
    alert(share);
}

function importTableColorCode() {

    $.dos.deleteTables();

    let code = $('#table-color-code');

    let arr = code.val().split(';');
    arr.forEach(function (item, index) {
        let val = item.split('=');

        let result = "";

        val.forEach(function (sd, sdd) {
            if (sdd != 0) {
                result += sd;
            }
        });

        $.cookie.setCookie(val[0], result);
    });

    $.dos.loadTables();
}

function initLang() {
    $('[data-lang]').each(function (index, s) {
        let item = $(s);
        let val = $.lang[$.cookie.getCookie('lang')][item.data('lang')];
        if (!item.is('[placeholder]')) {
            item.html(val);
        } else {
            item.attr('placeholder', val);
        }
    });
}

function setLang(lang = "tr") {
    if ($.lang[lang]) {
        $.cookie.deleteCookie('lang');
        $.cookie.setCookie('lang', lang);
        initLang(lang);
    } else {
        alert($.lang[$.cookie.getCookie('lang')]["not_there_are_lang"]);
    }
}

if ($.cookie.getCookie().lang == undefined) {
    setLang();
}

let leftMenu = $('.left-menu');

leftMenu.append(`
    <button onclick="shareCrackTableColor();" class="btn btn-danger btn-sm ml-2 mr-3 text-light" data-lang="share_colors"></button>
    <input type="text" placeholder="" style="width: 200px !important;" id="table-color-code" class="form-control text-dark" data-lang="input_code">
    <button onclick="importTableColorCode();" class="btn btn-success btn-sm ml-1 text-light" data-lang="input"></button>
    <button onclick="$.dos.events();" class="btn btn-dark btn-sm ml-1 text-light" data-lang="fix"></button>
`);

for (var [index, item] of iterate_object($.lang)) {
    leftMenu.append(`
        <button class="btn btn-sm btn-secondary ml-2 text-light" onclick="setLang('${index}');">${index}</button>
    `);
}

initLang();