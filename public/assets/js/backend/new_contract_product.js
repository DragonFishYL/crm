define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'new_contract_product/index' + location.search,
                    add_url: 'new_contract_product/add',
                    edit_url: 'new_contract_product/edit',
                    del_url: 'new_contract_product/del',
                    multi_url: 'new_contract_product/multi',
                    table: 'new_contract_product',
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
                        {field: 'contractid', title: __('Contractid')},
                        {field: 'productid', title: __('Productid')},
                        {field: 'ltype', title: __('Ltype')},
                        {field: 'price', title: __('Price'), operate:'BETWEEN'},
                        {field: 'trueprice', title: __('Trueprice'), operate:'BETWEEN'},
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