<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 业务机会管理
 *
 * @icon fa fa-circle-o
 */
class Oppotunity extends Backend
{
    
    /**
     * Oppotunitym模型对象
     * @var \app\admin\model\Oppotunitym
     */
    protected $model = null;
    private $createuser = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Oppotunitym;
        $this->request->filter(['strip_tags']);
        $this->industry = model('\app\admin\model\library\Industry');//实例化模型对象行业库
        $this->qcrllcore = model('\app\admin\model\QCellcore');//实例化归属地
        $this->product = model('\app\admin\model\library\Product');//实例化模型对象产品库
        $this->opptunity_product = model('\app\admin\model\Opptunity_product');//实例化业务机会产品
		//初始化创建者信息
		$createInfo['cid'] = $this->auth->id;
		$createInfo['createtime'] = time();
		$createInfo['sid'] = $this->auth->id;
		$createInfo['eid'] = $this->auth->id;
		$createInfo['updatetime'] = time();
		$createInfo['deletetime'] = time();
		$this->createuser = $createInfo;
    }
    
    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */
    

    /**
     * 查看
     */
    public function index()
    {
        //当前是否为关联查询
        $this->relationSearch = false;
        //设置过滤方法
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax())
        {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField'))
            {
                return $this->selectpage();
            }
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model
                    
                    ->where($where)
                    ->order($sort, $order)
                    ->count();

            $list = $this->model
                    
                    ->where($where)
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();

            foreach ($list as $row) {
                $row->visible(['name','costomerid','attributes','mechanism','stage','status','createtime','cid','sid','updatetime','eid','deletetime']);
                
            }
            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
        return $this->view->fetch();
    }
	
	
    /**
     * 添加
     */
    public function add()
    {
		//查询业务机会
        //查询产品库
        $product = collection($this->product->field('id,name,price,ctime,etime')->select())->toArray();
        $this->assign('product',$product);
        return $this->view->fetch();
    }
	
	//执行创建业务机会
	public function actionAddOppotunity(){
		//获取提交类型
		$type = $this->request->post("type", '', 'strip_tags');
		//准备创建者信息
		$createuser = $this->createuser;
		if($type == 1){
			//开启事务
			$this->model->startTrans();
			$this->opptunity_product->startTrans();
			//创建个人业务机会
			$oppotunity = $this->request->post("oppotunity/a", [], 'strip_tags');
			$productId = $this->request->post("product/d", '', 'strip_tags');
			$oppotunityInfo = array_merge($oppotunity,$createuser);
			// dump($oppotunityInfo);die;
			$state = $this->model->create($oppotunityInfo);
			if($state){
				//创建业务机会产品
				$productList['oppotunityid'] = $state;
				$productList['productid'] = $productId;
				$productList['ctime'] = time();
				//查询产品名称及价格
				$productArr = $this->product->where('id="'.$productId.'"')->field('name,price,sprice')->find();
				$productList['name'] = $productArr['name'];
				$productList['price'] = $productArr['price'];
				$productList['sprice'] = $productArr['sprice'];
				//创建业务机会产品
				$status = $this->opptunity_product->create($productList);
				if($status){
					if($oppotunity['stage'] == 8){
						//创建草稿合同
						//创建客户、业务机会、合同关联表数据
					}
					//提交
					$this->model->commit();
					$this->opptunity_product->commit();
					$this->success('创建成功','customer/index');
				}else{
					//回滚
					$this->model->rollback();
					$this->opptunity_product->rollback();
					$this->error();
				}
			}else{
				$this->error();
			}
		}else if($type == 2){
			
		}else if($type == 3){
			
		}else if($type == 4){
			
		}else{
			
		}
	}
}
