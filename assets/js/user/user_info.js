$(function () {
    // 1,自定义校验规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1~6之间!";
            }
        },
    });

    // 2,初始化用户基本信息
    initUserInfo();
    // 封装初始化用户信息的函数
    var layer = layui.layer;

    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.mag(res.message);
                }
                // console.log(res);

                // 调用 form.val() 方法为表单赋值,成功后渲染
                form.val('formUserInfo', res.data);
            },
        });
    };

    // 3，实现表单重置效果
    // 重置表单本身就会重置到input初始化的值，所以得用js实现重置效果
    // 给form表单绑定用reset事件，给按钮绑定用click事件
    $('#btnRest').on('click', function (e) {
        // 阻止表单默认重置行为
        e.preventDefault();
        // 从新用户渲染
        initUserInfo();
    });

    // 4,给表单绑定点击事件，
    $('.layui-form').on('submit', function (e) {
        // 阻止浏览器的重置行为，下的表单默认提交
        e.preventDefault();
        // 发起更新用户的ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                layer.msg('恭喜您，更新用户信息成功！');

                // 调用父浏览器的getUserInfo()获取用户信息的方法
                window.parent.getUserInfo();
                // 重置表单
                // $('.layui-form')[0].reset();

            }
        })
    })


});