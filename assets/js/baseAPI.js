var baseURL = 'http://ajax.frontend.itheima.net';
// 拦截ajax请求：get/post/ajax;
$.ajaxPrefilter(function (options) {
    // alert(options.url)
    options.url = baseURL + options.url;
    // alert(options.url)

    // 统一为有权限的接口，设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || "",
        }
    };

    // 拦截所有响应，判断身份认证信息
    // 无论成功失败，都会触发complete方法
    options.complete = function (res) {
        console.log(res);
        // 判断，如果是认证失败，就返回登录页面
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {

            // 删除token值
            localStorage.removeItem('token');
            // 跳转登录页面
            location.href = '/login.html';
        }
    }

});