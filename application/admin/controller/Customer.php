<?php

namespace app\admin\controller;


use app\common\controller\Backend;


/**
 * 客户管理
 *
 * @icon fa fa-group
 * @remark 客户管理首页，客户信息及其相关增删改查
 */
class Customer extends Backend
{

    public function _initialize()
    {
        parent::_initialize();
        $this->request->filter(['strip_tags']);
        $this->industry = model('\app\admin\model\library\Industry');//实例化模型对象行业库
        $this->qcrllcore = model('\app\admin\model\QCellcore');//实例化归属地
    }
    /**
     * 客户管理首页
     */
    public function index()
    {
        // if ($this->request->isAjax()) {
        //     $list = AuthGroup::all(array_keys($this->groupdata));
        //     $list = collection($list)->toArray();
        //     $groupList = [];
        //     foreach ($list as $k => $v) {
        //         $groupList[$v['id']] = $v;
        //     }
        //     $list = [];
        //     foreach ($this->groupdata as $k => $v) {
        //         if (isset($groupList[$k])) {
        //             $groupList[$k]['name'] = $v;
        //             $list[] = $groupList[$k];
        //         }
        //     }
        //     $total = count($list);
        //     $result = array("total" => $total, "rows" => $list);

        //     return json($result);
        // }
        return $this->view->fetch();
    }

    /**
     * 添加
     */
    public function add()
    {
        //查询行业库
        $IndustryData = collection($this->industry->select())->toArray();
        if ($this->request->isPost()) {
            $params = $this->request->post("row/a", [], 'strip_tags');
            $params['rules'] = explode(',', $params['rules']);
            if (!in_array($params['pid'], $this->childrenGroupIds)) {
                $this->error(__('The parent group can not be its own child'));
            }
            $parentmodel = model("AuthGroup")->get($params['pid']);
            if (!$parentmodel) {
                $this->error(__('The parent group can not found'));
            }
           
            if ($params) {
                $this->model->create($params);
                $this->success();
            }
            $this->error();
        }
        $this->assign('IndustryData',$IndustryData);
        return $this->view->fetch();
    }

    /**
     * 编辑
     */
    public function edit($ids = null)
    {
        $row = $this->model->get(['id' => $ids]);
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        if ($this->request->isPost()) {
            $params = $this->request->post("row/a", [], 'strip_tags');
            // 父节点不能是它自身的子节点
            if (!in_array($params['pid'], $this->childrenGroupIds)) {
                $this->error(__('The parent group can not be its own child'));
            }
            $params['rules'] = explode(',', $params['rules']);

            $parentmodel = model("AuthGroup")->get($params['pid']);
            if (!$parentmodel) {
                $this->error(__('The parent group can not found'));
            }
            // 父级别的规则节点
            $parentrules = explode(',', $parentmodel->rules);
            // 当前组别的规则节点
            $currentrules = $this->auth->getRuleIds();
            $rules = $params['rules'];
            // 如果父组不是超级管理员则需要过滤规则节点,不能超过父组别的权限
            $rules = in_array('*', $parentrules) ? $rules : array_intersect($parentrules, $rules);
            // 如果当前组别不是超级管理员则需要过滤规则节点,不能超当前组别的权限
            $rules = in_array('*', $currentrules) ? $rules : array_intersect($currentrules, $rules);
            $params['rules'] = implode(',', $rules);
            if ($params) {
                $row->save($params);
                $this->success();
            }
            $this->error();
            return;
        }
      
        $this->view->assign("row", $row);
        return $this->view->fetch();
    }

    /**
     * 删除
     */
    public function del($ids = "")
    {
        if ($ids) {
            $ids = explode(',', $ids);
            $grouplist = $this->auth->getGroups();
            $group_ids = array_map(function ($group) {
                return $group['id'];
            }, $grouplist);
            // 移除掉当前管理员所在组别
            $ids = array_diff($ids, $group_ids);

            // 循环判断每一个组别是否可删除
            $grouplist = $this->model->where('id', 'in', $ids)->select();
            $groupaccessmodel = model('AuthGroupAccess');
            foreach ($grouplist as $k => $v) {
                // 当前组别下有管理员
                $groupone = $groupaccessmodel->get(['group_id' => $v['id']]);
                if ($groupone) {
                    $ids = array_diff($ids, [$v['id']]);
                    continue;
                }
                // 当前组别下有子组别
                $groupone = $this->model->get(['pid' => $v['id']]);
                if ($groupone) {
                    $ids = array_diff($ids, [$v['id']]);
                    continue;
                }
            }
            if (!$ids) {
                $this->error(__('You can not delete group that contain child group and administrators'));
            }
            $count = $this->model->where('id', 'in', $ids)->delete();
            if ($count) {
                $this->success();
            }
        }
        $this->error();
    }
    /**
     * 查询手机号码归属地
     */
    public function proviceCity() {
        $phone = $this->request->post('phone');
        $phoneData = $this->qcrllcore->where('Mobile',$phone)->find()->toArray();
        return  $phoneData;
    }

}
