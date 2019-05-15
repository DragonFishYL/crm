<?php

namespace app\admin\controller\other;

use app\common\controller\Backend;

/**
 * 业务机会来源信息管理（记录类型）
 *
 * @icon fa fa-circle-o
 */
class Record extends Backend
{
    
    /**
     * Recordm模型对象
     * @var \app\admin\model\other\Recordm
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\other\Recordm;

    }
    
    /**
     * 添加
     */
    public function add()
    {
        if ($this->request->isPost()) {
            $params = $this->request->post("row/a", [], 'strip_tags');
            if ($params) {
                $params['cid'] = $this->auth->id;
                $params['eid'] = $this->auth->id;
                $this->model->create($params);
                $this->success();
            }
            $this->error();
        }
        return $this->view->fetch();
    }
    

}
