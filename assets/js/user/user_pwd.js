$(function () {

    // 1，自定义校验规则

    var form = layui.form;
    form.verify({
        // 原密码规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 新密码和原密码规则
        samePwd: function (value) {
            // value是新密码，$().val()是原密码
            if (value === $('[name=oldPwd]').val())
                return "新密码和原密码不能相同！"
        },
        // 确认密码规则
        rePwd: function (value) {
            // value是确认密码密码，$().val()是新密码

            if (value !== $('[name=newPwd]').val()) {
                return "两次新密码输入不一致"
            }
        },
    });

    // 2，提交更新密码
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            // 这里this指form表单
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('密码更新失败！')
                }
                layui.layer.msg('密码更新成功！')

                // 原生DOM获取表单,重置表单，这里不能用this，这里的this指ajax函数
                $('.layui-form')[0].reset();
            }
        })


    })

});