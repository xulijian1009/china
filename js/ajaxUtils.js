(function ($) {
    var loadIndex;
    var _beforeSend = function () {
        loadIndex = layer.load();
    };
    var _completeSend = function () {
        layer.close(loadIndex);
    };
    var _error = function (data) {
        setTimeout(function () {
            layer.msg("数据加载失败");
        },300);
        if (loadIndex){
            layer.close(loadIndex);
        }
        throw "数据加载失败";
    };

    var _get = function (url,params,options) {
        return new Promise(function (resolve,reject) {
            var defaultAjaxOptions = {
                type: "get",
                url: url,
                contentType: "application/json",
                dataType: "json",
                beforeSend: _beforeSend,
                complete: _completeSend,
                error: _error
            };
            if (params){
                defaultAjaxOptions.data = params;
            }
            defaultAjaxOptions = $.extend({},defaultAjaxOptions,options);
                $.ajax(defaultAjaxOptions)
                    .done(function (data) {
                        if (!$.isEmptyObject(data)){
                            resolve(data);
                        }else{
                            _error(data);
                        }
                        // if (data.code==0) {
                        //     if (data.data && !$.isEmptyObject(data.data)) {
                        //         resolve(data.data);
                        //     } else {
                        //         resolve();
                        //     }
                        // } else {
                        //     _error("数据加载失败");
                        // }
                    })
        })
    };

    var _post = function (url,requestPayload,options) {
        return new Promise(function (resolve,reject) {
            var defaultAjaxOptions = {
                type: "post",
                url: url,
                contentType: "application/json",
                data: JSON.stringify(requestPayload),
                dataType: "json",
                beforeSend: _beforeSend,
                complete: _completeSend,
                error: _error
            };
                defaultAjaxOptions = $.extend({},defaultAjaxOptions,options);
                $.ajax(defaultAjaxOptions)
                    .done(function (data) {
                        if (!$.isEmptyObject(data)){
                            resolve(data);
                        }else{
                            _error(data);
                        }
                    })
        })
    };

    var _delete = function (url,options) {
        return new Promise(function (resolve,reject) {
            var defaultAjaxOptions = {
                type: "delete",
                url: url,
                dataType: "json",
                beforeSend: _beforeSend,
                complete: _completeSend,
                error: _error
            };
            defaultAjaxOptions = $.extend({},defaultAjaxOptions,options);
            $.ajax(defaultAjaxOptions)
                .done(function (data) {
                    if (!$.isEmptyObject(data)){
                        resolve(data);
                    }else{
                        _error(data);
                    }
                })
        })
    };

    var _put = function (url,requestPayload,options) {
        return new Promise(function (resolve,reject) {
            var defaultAjaxOptions = {
                type: "put",
                url: url,
                contentType: "application/json",
                data: JSON.stringify(requestPayload),
                dataType: "json",
                beforeSend: _beforeSend,
                complete: _completeSend,
                error: _error
            };
            defaultAjaxOptions = $.extend({},defaultAjaxOptions,options);
            $.ajax(defaultAjaxOptions)
                .done(function (data) {
                    if (!$.isEmptyObject(data)){
                        resolve(data);
                    }else{
                        _error(data);
                    }
                })
        })
    };
    $.HTTP = {
        "get":_get,
        "put":_put,
        "post":_post,
        "delete":_delete
    };

})(jQuery);
//全站ajax加载提示
(function ($) {
    $(document).ajaxStart(function () {
        var index = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
    });
    $(document).ajaxStop(function () {
        layer.closeAll('loading');
    });
    //登录过期，shiro返回登录页面
    $.ajaxSetup({
        complete: function (xhr, status,dataType) {
            if('text/html;charset=UTF-8'==xhr.getResponseHeader('Content-Type')){
                top.location.href = '/login';
            }
        }
    });
})(jQuery);