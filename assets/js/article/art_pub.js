$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initCate();// 初始化分类列表

    // 1,获取分类列表方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    };

    // 2,初始化富文本编辑器
    initEditor();

    // 3,实现裁剪效果
    // 3.1 初始化图片裁剪器
    var $image = $('#image')

    // 3.2 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3 初始化裁剪区域
    $image.cropper(options)



    // 4,点击选择文件，为选择封面绑定点击事件
    $('#btnCooseImage').on('click', function () {
        // console.log('ok');
        $('#file').click();
    });


    // 5，修改裁剪图片，获取用户选择的用户列表
    $('#file').on('change', function (e) {
        // 获取用户文件的列表数组(files是个伪数组)
        var files = e.target.files;
        // 判断用户有没有拿到文件
        if (files.length === 0) {
            return layer.msg('请选择文件！');
        }

        // 选择成功，修改图片
        // 1. 拿到用户选择的文件
        var file = e.target.files[0]
        // 2. 根据选择的文件， 创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 3. 先销毁旧的裁剪区域， 再重新设置图片路径， 之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 6定义文章状态
    var state = '已发布';
    $('#btnSave2').on('click', function () {
        state = '草稿';
    })

    // 7, 添加文章
    $('#form-pub').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 创建formdata，收集数据,这里的this指form表单
        var fd = new FormData(this);
        // 放入文章状态
        fd.append('state', state);
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280,
            })
            // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            .toBlob(function (blob) {
                // 得到文件对象
                fd.append('cover_img', blob);
                // console.log(...fd);
                // 发送ajax
                publishArticle(fd);
            })
    });

    // 定义添加文章函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜您，添加文章成功');
                setTimeout(function () {
                    window.parent.document.querySelector('#art_list').click();
                }, 1000);
            }

        })
    }
}); 