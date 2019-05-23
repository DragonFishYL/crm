define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'new_contract_confirm/index' + location.search,
                    add_url: 'new_contract_confirm/add',
                    edit_url: 'new_contract_confirm/edit',
                    del_url: 'new_contract_confirm/del',
                    multi_url: 'new_contract_confirm/multi',
                    table: 'new_contract_confirm',
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
                        {field: 'costomerid', title: __('Costomerid')},
                        {field: 'contractid', title: __('Contractid')},
                        {field: 'linkid', title: __('Linkid')},
                        {field: 'countryid', title: __('Countryid')},
                        {field: 'ltype', title: __('Ltype')},
                        {field: 'hospitalid', title: __('Hospitalid')},
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