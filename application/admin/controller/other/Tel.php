<?php

namespace app\admin\controller\other;

use app\common\controller\Backend;

/**
 * 记录类型：市场渠道-400
 *
 * @icon fa fa-circle-o
 */
class Tel extends Backend
{
    
    /**
     * Telm模型对象
     * @var \app\admin\model\other\Telm
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\other\Telm;

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
