define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'new_opptunity_product/index' + location.search,
                    add_url: 'new_opptunity_product/add',
                    edit_url: 'new_opptunity_product/edit',
                    del_url: 'new_opptunity_product/del',
                    multi_url: 'new_opptunity_product/multi',
                    table: 'new_opptunity_product',
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
                        {field: 'costomerid', title: __('Costomerid')},
                        {field: 'oppotunityid', title: __('Oppotunityid')},
                        {field: 'productid', title: __('Productid')},
                        {field: 'price', title: __('Price'), operate:'BETWEEN'},
                        {field: 'sprice', title: __('Sprice'), operate:'BETWEEN'},
                        {field: 'ctime', title: __('Ctime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
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