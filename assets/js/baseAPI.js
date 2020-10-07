var baseURL = 'http://ajax.frontend.itheima.net';
// 拦截ajax请求：get/post/ajax;
$.ajaxPrefilter(function (options) {
    // alert(options.url)
    options.url = baseURL + options.url;
    // alert(options.url)

});