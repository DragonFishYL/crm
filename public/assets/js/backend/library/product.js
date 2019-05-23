define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'library/product/index' + location.search,
                    add_url: 'library/product/add',
                    edit_url: 'library/product/edit',
                    del_url: 'library/product/del',
                    multi_url: 'library/product/multi',
                    table: 'new_sys_product',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'name', title: __('Name')},
                        {field: 'sname', title: __('Sname')},
                        {field: 'images', title: __('Images'), events: Table.api.events.image, formatter: Table.api.formatter.images},
                        {field: 'mtype', title: __('Mtype')},
                        {field: 'ltype', title: __('Ltype')},
                        {field: 'btype', title: __('Btype')},
                        {field: 'xtype', title: __('Xtype')},
                        {field: 'price', title: __('Price'), operate:'BETWEEN'},
                        {field: 'sprice', title: __('Sprice'), operate:'BETWEEN'},
                        {field: 'discribe', title: __('Discribe')},
                        {field: 'status', title: __('Status')},
                        {field: 'ctime', title: __('Ctime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'cid', title: __('Cid')},
                        {field: 'etime', title: __('Etime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'eid', title: __('Eid')},
                        {field: 'remark', title: __('Remark')},
                        {field: 'state', title: __('State')},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});