define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'library/contract_model/index' + location.search,
                    add_url: 'library/contract_model/add',
                    edit_url: 'library/contract_model/edit',
                    del_url: 'library/contract_model/del',
                    multi_url: 'library/contract_model/multi',
                    table: 'new_contract_model',
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
                        {field: 'modelid', title: __('Modelid')},
                        {field: 'ltype', title: __('Ltype')},
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