$(function () {
    var layer = layui.layer
    var form = layui.form
    // 给art-template定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 1.定义提交参数
    var p = {
        pagenum: 1,   //页码值
        pagesize: 2,  //每页显示多少条数据
        cate_id: '',  //文章分类的 Id
        state: '',	  //文章的状态，可选值有：已发布、草稿
    }

    // 2.初始化文章列表
    initTable()
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: p,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用分页
                renderPage(res.total)
            }
        })
    }

    // 3.初始化分类
    initCate()
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 4.筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        p.state = state
        p.cate_id = cate_id
        initTable()
    })

    // 5.分页
    var laypage = layui.laypage
    function renderPage(total) {
        // 执行一个laypage实例
        laypage.render({
            elem: 'pageBox',  // 指向存放分页的容器
            count: total,  // 数据总数，从服务端得到
            limit: p.pagesize, // 每页几条
            curr: p.pagenum, // 第几页

            // 分页模块设置, 显示了哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 每页显示多少条数据的选择器

            // 触发jump: 分页初始化的时候， 页面改变的时候
            jump: function (obj, first) {
                // obj: 所有参数所在的对象; first: 是否是第一次初始化分页
                // 改变当前页;
                p.pagenum = obj.curr
                p.pagesize = obj.limit
                // 判断， 不是第一次初始化页面，才能重新调用初始化文章列表
                if (!first) {
                    // 初始化文章列表
                    initTable()
                }
            }
        })
    }

    // 6.删除
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除文章成功')
                    // 页面汇总删除按钮个数等于1, 页码值大于1
                    if ($('.btn-delete').length == 1 && p.pagenum > 1) p.pagenum--
                    initTable()

                }

            })

            layer.close(index);
        });
    })
})