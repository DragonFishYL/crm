<?php

namespace app\admin\controller\library;

use app\common\controller\Backend;

/**
 * 医院库
 *
 * @icon fa fa-circle-o
 */
class Hospital extends Backend
{
    
    /**
     * Hospitalm模型对象
     * @var \app\admin\model\library\Hospitalm
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\library\Hospitalm;

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
