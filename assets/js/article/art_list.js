$(function () {
    var layer = layui.layer;
    var form = layui.form;

    // 定义时间过滤器
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };

    // 定义补零
    function padZero(n) {
        return n > 9 ? n : '0' + n;

    }
    // 定义查询参数
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: "", //文章分类的 Id
        state: "",   //文章的状态，可选值有：已发布、草稿
    }

    initTable();//初始化文章分类
    // 2,获取文章分类方法

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                // 使用模板引擎渲染数据
                var str = template('tpl-table', res);
                $('tbody').html(str);
                // 渲染列表数据，同时渲染分页
                renderPage(res.total);

            }
        })
    };

    initCate();// 初始化分类列表

    // 3,获取分类列表方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
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

    // 4,筛选按钮
    $('#form-search').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();

        // 获取数据
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();

        // 给q赋值
        q.state = state;
        q.cate_id = cate_id;

        //初始化文章分类
        initTable();
    });

    // 5,定义分页函数
    var laypage = layui.laypage;
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox',//注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//在第几页
            // 分页模块，显示那些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 每页显示多少条数据
            limits: [2, 3, 5, 10],
            // 触发jump两种方式:页面初始化的时候；点击页码改变的时候；
            jump: function (obj, first) {
                // console.log(obj);//所有参数所在的对象
                // console.log(first);//是否是第一次初始化
                // 改变当前页码
                q.pagenum = obj.curr;
                // 每页显示多少条赋值给当前页
                q.pagesize = obj.limit;
                // 判断不是第一次初始化分页，重新调用初始化文章列表
                if (!first) {
                    initTable();
                }
            }
        });
    };

    // 6,删除按钮(事件委托)
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮个数
        var len = $('.btn-delete').length;

        // 获取Id值
        var id = $(this).attr('data-id');
        // console.log(id);
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something

            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    // 删除成功
                    layer.msg('删除成功！');
                    if (len === 1) {
                        // 判断页码的值等于1 ，如果没有剩余的数据，则让页码值-1之后
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }

                    // 页面汇总删除按钮个数等于1，页码大于1
                    // if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    //重新渲染文章分类
                    initTable();

                }
            })

            layer.close(index);
        });
    })



});