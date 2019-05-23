define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'library/contract/index' + location.search,
                    add_url: 'library/contract/add',
                    edit_url: 'library/contract/edit',
                    del_url: 'library/contract/del',
                    multi_url: 'library/contract/multi',
                    table: 'new_contract',
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
                        {field: 'sign', title: __('Sign')},
                        {field: 'hpsign', title: __('Hpsign')},
                        {field: 'printname', title: __('Printname')},
                        {field: 'price', title: __('Price'), operate:'BETWEEN'},
                        {field: 'trueprice', title: __('Trueprice'), operate:'BETWEEN'},
                        {field: 'stage', title: __('Stage')},
                        {field: 'signdate', title: __('Signdate')},
                        {field: 'ctime', title: __('Ctime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'cid', title: __('Cid')},
                        {field: 'sid', title: __('Sid')},
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