<?php

namespace app\admin\model\library;

use think\Model;


class Contract_confirmm extends Model
{

    

    //数据库
    protected $connection = 'database';
    // 表名
    protected $name = 'new_contract_confirm';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = false;

    // 定义时间戳字段名
    protected $createTime = false;
    protected $updateTime = false;
    protected $deleteTime = false;

    // 追加属性
    protected $append = [

    ];
    

    







}
