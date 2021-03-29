const api_url = "http://denemedomain.epizy.com/api";

function* iterate_object(o) {
    var keys = Object.keys(o);
    for (var i = 0; i < keys.length; i++) {
        yield [keys[i], o[keys[i]]];
    }
}

$.ajax = function (arr = {}) {
    let xhr = new XMLHttpRequest();
    xhr.open(arr.type ? arr.type : "GET", arr.url ? arr.url : document.URL, true);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log(this);
        }
    }

    xhr.onload = function (e) {
        console.log(e);
    };

    let data = "";

    for (var [index, item] of iterate_object(arr.data)) {
        data += `${index}=${item}&`;
    }

    xhr.send(data.substr(0, (data.length - 1)));
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

    importTableColorCode(code) {

        $.dos.deleteTables();

        let arr = code.val().split(';');
        arr.forEach(function (item, index) {
            let val = item.split('=');

            let result = "";

            val.forEach(function (sd, sdd) {
                if (sdd != 0) {
                    result += sd;
                }
            });
        });

        $.dos.loadTables();
    },

    loadTables: function () {

        let title = "";
        let color = "";

        $(`.table-header title`).filter(function () {
            return $(this).html() == title
        }).parent().attr('style', `fill: ${color} !important;`);


    },

    saveTables: function () {
        let data = {
            type: "table",
            url: document.URL,
            tables: this.exportCode()
        };

        $.ajax({
            type: "GET",
            url: api_url,
            data: data
        });

    },

    deleteTables: function () {
        $('.table .table-header').removeAttr('style');
        this.saveTables();
    },

    exportCode: function () {
        let code = "";

        $('.table-header').each(function (index, s) {
            let item = $(s);
            let fill = item.css('fill');
            if (fill)
                code += `${item.find('title').html()}=${fill};`;
        });

        return code;
    }
};

$.dos.restart();

let leftMenu = $('.left-menu');

leftMenu.append(`
    <div class="badge badge-secondary btn-md">Active Crack</div>
    <button class="btn btn-danger btn-sm ml-1 text-light" onclick="$.dos.deleteTables();">Reset Colors</button>
`);