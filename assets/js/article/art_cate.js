$(function () {
    // 文章分类列表展示
    initArtCateList();
    // 1,获取文章分类列表函数
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);

                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    };

    // 2，显示添加文章分类列表
    var layer = layui.layer;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html(),
        });
    });

    // $('#spn').on('click', function () {
    //     location.href = "/index.html";
    // });
    // 3,新增文章分类(事件委托)
    var indexAdd = null;
    $('body').on('submit', '#form-add', function (e) {
        // 阻止默认提交
        e.preventDefault()
        // 发送ajax提交
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 提示成功
                layer.msg('提交成功！');
                // 重新获取文章分类
                initArtCateList();
                // 关闭添加的索引值
                layer.close(indexAdd);
            }
        })
    });

    // 4,编辑弹出层
    var indexEdit = null;
    var form = layui.form;
    // 给tbody绑定，编辑按钮触发事件
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html(),
        });

        //获取ID值，发送ajax,渲染到页面
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                // 为表单赋值，重新渲染
                form.val('form-edit', res.data);
            },
        })
    });

    // 4，修改-提交
    $('body').on('submit', '#form-edit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 展示页面
                initArtCateList();
                layer.msg('更新成功');
                // 关闭修改的弹出层
                layer.close(indexEdit);

            }
        })
    });


    // 5,修改，删除
    $('tbody').on('click', '.btn-delete', function () {
        //先获取id 
        var id = $(this).attr('data-id');
        // console.log(id);
        layer.confirm('是否确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something

            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    // 更新分类列表
                    initArtCateList();
                    layer.msg('删除成功！');
                    layer.close(index);
                }
            });
        });
    });


});