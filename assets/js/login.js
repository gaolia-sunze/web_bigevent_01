$(function () {

    // 1,点击去注册页面，隐藏登录区域，显示注册区域
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });

    // 2,点击去登陆，显示登录页面，隐藏注册区域
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });


    // 3，自定义校验规则
    // 通过layui导出form对象
    var form = layui.form;
    // console.log(form);
    // 效验规则
    form.verify({
        // 自定义密码规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 自定义重复密码规则
        // 判断密码pwd的值和确认密码的值value的值一致
        repwd: function (value) {
            // .reg-box后边必须带空格，选择的后代中的input,name属性值为password的那一个标签
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    });

    // 4，注册功能
    var layer = layui.layer;

    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        // 发送ajax请求注册信息
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 提交成功后处理代码
                layer.msg('注册成功！');
                // 模拟人的点击行为，触发注册a连接的切换行为
                $('#link_login').click();
            }
        })

    });

    // 5,登录功能
    $('#form_login').submit(function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取表单的数据，这里的this指代理的#form_login表单
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜您，登陆成功');
                // 将token数据保存到到本地
                localStorage.setItem('token', res.token);
                // console.log(res.token);
                // 跳转到首页
                location.href = '/index.html';
            }
        })
    });
});