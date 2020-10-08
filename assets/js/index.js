// 入口函数
$(function () {
    // 1,获取用户基本信息
    getUserInfo();
    // 获取layui 的layer对象
    var layer = layui.layer;

    // 2,为退出按钮绑定点击事件
    $('#btnLogout').on('click', function () {
        // 提示用户是否退出
        layer.confirm('是否确定退出?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            // 删除本地存储的token
            localStorage.removeItem('token');
            // 跳转到登录页面
            location.href = '/login.html';

            layer.close(index);
        });
    });
});

// 获取用户基本信息
// 因为后面的页面要调用，所以写到入口函数外面
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers是请求头配置对象
        // headers: {
        //   Authorization: localStorage.getItem("token") || "",
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                //   不成功返回的信息
                return layer.msg(res.message);
            }
            // 请求成功，渲染用户头像信息
            renderAvatar(res.data);
        },

        // // 无论成功失败，都会触发complete方法
        // complete: function (res) {
        //     console.log(res);
        //     // 判断，如果是认证失败，就返回登录页面
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {

        //         // 删除token值
        //         localStorage.removeItem('token');
        //         // 跳转登录页面
        //         location.href = '/login.html';
        //     }
        // }
    });
}

// 封装渲染用户头像信息函数
function renderAvatar(user) {
    // 1，用户名
    var name = user.nickname || user.username;
    // 2,设置欢迎文本
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    // 3,渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $(".layui-nav-img").show().attr("src", user.user_pic);
        $(".text_avatar").hide();
    } else {
        // 渲染文本头像
        $(".layui-nav-img").hide();
        // 获取用户输入的首字母，转换成大写
        var first = name[0].toUpperCase();
        $(".text_avatar").show(first);
    }
}