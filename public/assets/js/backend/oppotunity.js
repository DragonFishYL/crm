define(['jquery','layui','bootstrap', 'backend', 'table', 'form', 'jstree','selectpage'], function ($, undefined, Backend, Table, Form, undefined) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            // Table.api.init({
                // extend: {
                    // index_url: 'oppotunity/index' + location.search,
                    // add_url: 'oppotunity/add',
                    // edit_url: 'oppotunity/edit',
                    // del_url: 'oppotunity/del',
                    // multi_url: 'oppotunity/multi',
                    // table: 'new_opptunity',
                // }
            // });

            // var table = $("#table");

            // // 初始化表格
            // table.bootstrapTable({
                // url: $.fn.bootstrapTable.defaults.extend.index_url,
                // pk: 'id',
                // sortName: 'id',
                // columns: [
                    // [
                        // {checkbox: true},
                        // {field: 'name', title: __('Name')},
                        // {field: 'costomerid', title: __('Costomerid')},
                        // {field: 'attributes', title: __('Attributes')},
                        // {field: 'mechanism', title: __('Mechanism')},
                        // {field: 'stage', title: __('Stage')},
                        // {field: 'status', title: __('Status')},
                        // {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        // {field: 'cid', title: __('Cid')},
                        // {field: 'sid', title: __('Sid')},
                        // {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        // {field: 'eid', title: __('Eid')},
                        // {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    // ]
                // ]
            // });

            // // 为表格绑定事件
            // Table.api.bindevent(table);
        },
        recyclebin: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    'dragsort_url': ''
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: 'oppotunity/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'name', title: __('Name'), align: 'left'},
                        {
                            field: 'deletetime',
                            title: __('Deletetime'),
                            operate: 'RANGE',
                            addclass: 'datetimerange',
                            formatter: Table.api.formatter.datetime
                        },
                        {
                            field: 'operate',
                            width: '130px',
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            buttons: [
                                {
                                    name: 'Restore',
                                    text: __('Restore'),
                                    classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
                                    icon: 'fa fa-rotate-left',
                                    url: 'oppotunity/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'oppotunity/destroy',
                                    refresh: true
                                }
                            ],
                            formatter: Table.api.formatter.operate
                        }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
			layui.use(['element','form','laydate','layer'], function(){
				var form = layui.form;
				var element = layui.element;
				var laydate = layui.laydate;
				var layer = layui.layer;
				//1点击继续创建
				$('.continue-to-create').click(function(){
					$('.my-oppotunity-list-button').slideUp('fast');
					$('.row-oppotunity').slideDown('fast');
				});
				//2监听业务机会性质
				form.on('select(attribute)',function(data){
					if(data.value == '1'){
						//个人版
                        $('.row-oppotunity-person').slideDown('fast');
                        $('.row-oppotunity-family').slideUp('fast');
                        $('.row-create-beta').slideUp('fast');
						//创建个人业务机会
						$('#createOppotunity').val(1);
                    }else{
						//家庭版、企业版
                        $('.row-oppotunity-family').slideDown('fast');
						$('.row-oppotunity-person').slideUp('fast');
                        $('.row-create-beta').slideUp('fast');
                    }
					//个人创建草稿合同不需要选择 咨询项目，家庭版、企业版的需要
					//将业务机会性质 赋值给 创建业务机会按钮
					$('#createOppotunity').data('attribute',data.value);
                });
				//3监听客户具体家庭/企业性质
				form.on('select(familybusiness)',function(data){
					if(data.value == '1'){
						//创建 家庭版/企业版
                        $('.family-oppotunity').slideUp('fast');
                        $('.family-contract-button').slideUp('fast');
                        $('.row-create-beta').slideDown('fast');
                        $('.row-oppotunity-person').slideDown('fast');
						//创建业务机会 版本信息
						$('#createOppotunity').val(2);
                    }else if(data.value != '0'){
						//不创建
                        $('.family-oppotunity').slideDown('fast');
                        $('.row-create-beta').slideUp('fast');
                        $('.row-oppotunity-person').slideUp('fast');
                    }
                });
				//4监听业务机会
				form.on('select(familyoppotunity)',function(data){
					if(data.value == '1'){
						//创建 当前家庭版/企业版下的  业务机会
                        $('.family-contract-button').slideUp('fast');
                        $('.row-oppotunity-person').slideDown('fast');
						//创建 业务机会
						$('#createOppotunity').val(3);
                    }else if(data.value != '0'){
						//选择合同
                        $('.row-create-beta').slideUp('fast');
                        $('.row-oppotunity-person').slideUp('fast');
                        $('.family-contract-button').slideDown('fast');
						//创建 草稿合同
						$('#createOppotunity').val(4);
                    }
                });
				//监听业务机会的  跟进阶段
				form.on('select(stage)',function(data){
					//个人创建草稿合同不需要选择 咨询项目，家庭版、企业版的需要
					var attribute = $('#createOppotunity').data('attribute');
					if(attribute != 1 && data.value == 8){
						$('.consaultProject').css({'display':'block'});
					}else{
						$('.consaultProject').css({'display':'none'});
					}
				});
				//提交表单
				//监听提交
				form.on('submit(formDemo)', function(data){
					layer.msg(JSON.stringify(data.field));
					return false;
				});
				
			});
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