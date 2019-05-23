<?php

namespace app\admin\controller\library;

use app\common\controller\Backend;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Reader\Xls;
use PhpOffice\PhpSpreadsheet\Reader\Csv;
use think\Db;
use think\Exception;
use think\exception\PDOException;
use think\exception\ValidateException;
/**
 * 系统疾病库管理
 *
 * @icon fa fa-circle-o
 */
class Disease extends Backend
{
    
    /**
     * Diseasem模型对象
     * @var \app\admin\model\library\Diseasem
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\library\Diseasem;

    }
    
    //继承上传文件方法
    public function import(){
        echo "服务已暂停";die;
        $file = $this->request->request('file');
        if (!$file) {
            $this->error(__('Parameter %s can not be empty', 'file'));
        }
        $filePath = ROOT_PATH . DS . 'public' . DS . $file;
        if (!is_file($filePath)) {
            $this->error(__('No results were found'));
        }
        //实例化reader
        $ext = pathinfo($filePath, PATHINFO_EXTENSION);
        if (!in_array($ext, ['csv', 'xls', 'xlsx'])) {
            $this->error(__('Unknown data format'));
        }
        if ($ext === 'csv') {
            $file = fopen($filePath, 'r');
            $filePath = tempnam(sys_get_temp_dir(), 'import_csv');
            $fp = fopen($filePath, "w");
            $n = 0;
            while ($line = fgets($file)) {
                $line = rtrim($line, "\n\r\0");
                $encoding = mb_detect_encoding($line, ['utf-8', 'gbk', 'latin1', 'big5']);
                if ($encoding != 'utf-8') {
                    $line = mb_convert_encoding($line, 'utf-8', $encoding);
                }
                if ($n == 0 || preg_match('/^".*"$/', $line)) {
                    fwrite($fp, $line . "\n");
                } else {
                    fwrite($fp, '"' . str_replace(['"', ','], ['""', '","'], $line) . "\"\n");
                }
                $n++;
            }
            fclose($file) || fclose($fp);

            $reader = new Csv();
        } elseif ($ext === 'xls') {
            $reader = new Xls();
        } else {
            $reader = new Xlsx();
        }
          //导入文件首行类型,默认是注释,如果需要使用字段名称请使用name
          $importHeadType = isset($this->importHeadType) ? $this->importHeadType : 'comment';

          $table = $this->model->getQuery()->getTable();
          $database = \think\Config::get('database.database');
          $fieldArr = [];
          $list = db()->query("SELECT COLUMN_NAME,COLUMN_COMMENT FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?", [$table, $database]);
            foreach ($list as $k => $v) {
                if ($importHeadType == 'comment') {
                    $fieldArr[$v['COLUMN_COMMENT']] = $v['COLUMN_NAME'];
                } else {
                    $fieldArr[$v['COLUMN_NAME']] = $v['COLUMN_NAME'];
                }
            }
            if (!$PHPExcel = $reader->load($filePath)) {
                $this->error(__('Unknown data format'));
            }
            $currentSheet = $PHPExcel->getSheet(0);
            $allRow = $currentSheet->getHighestRow(); //取得一共有多少行
            for($i=2;$i<=$allRow;$i++) {
                $data[$currentSheet->getCell("A".$i)->getValue()][$currentSheet->getCell("B".$i)->getValue()][$i-2]['name'] = $currentSheet->getCell("C".$i)->getValue();
                $data[$currentSheet->getCell("A".$i)->getValue()][$currentSheet->getCell("B".$i)->getValue()][$i-2]['sketch'] = $currentSheet->getCell("D".$i)->getValue();
            }
            // $diseaseOne = $this->model->where('name','肿瘤')->find();
            // $diseaseOnes = empty($diseaseOne) ? array():$diseaseOne->toArray();
            foreach ($data as $k => $v) {
                $diseaseOne = $this->model->where('name',$k)->find();
                $diseaseOnes = empty($diseaseOne) ? array():$diseaseOne->toArray();
                if(!$diseaseOnes) {
                    $params['name'] = $k;
                    $params['createtime'] = time();
                    $params['updatetime'] = time();
                    $params['status'] = 'normal';
                    $params['fid'] = '0';
                    $params['level'] = '1';
                    $params['cid'] = '1';
                    $params['eid'] = '1';
                    $params['state'] = '1';
                    $this->model->create($params);
                    //获取一级id $fid['id]
                    $fid = $this->model->where('fid','0')->order('id', 'desc')->find()->toArray();
                    foreach ($v as $ke => $val) {
                        $params2['name'] = $ke;
                        $params2['createtime'] = time();
                        $params2['updatetime'] = time();
                        $params2['status'] = 'normal';
                        $params2['fid'] = $fid['id'];
                        $params2['level'] = '2';
                        $params2['cid'] = '1';
                        $params2['eid'] = '1';
                        $params2['state'] = '1';
                        $child = $this->model->create($params2);
                        //获取2级id
                        $childs =  $child->id;
                        foreach ($val as $key => $value) {
                            $params3['name'] = $val[$key]['name'];
                            $params3['createtime'] = time();
                            $params3['updatetime'] = time();
                            $params3['status'] = 'normal';
                            $params3['fid'] = $childs;
                            $params3['level'] = '3';
                            $params3['cid'] = '1';
                            $params3['eid'] = '1';
                            $params3['state'] = '1';
                            $params3['sketch'] = $val[$key]['sketch'];
                            $this->model->create($params3);
                        }

                       
                    }

                }
            }
            // print_r($diseaseOnes);
        //加载文件
        // $insert = [];
        // try {
        //     if (!$PHPExcel = $reader->load($filePath)) {
        //         $this->error(__('Unknown data format'));
        //     }
        //     $currentSheet = $PHPExcel->getSheet(0);  //读取文件中的第一个工作表
        //     $allColumn = $currentSheet->getHighestDataColumn(); //取得最大的列号
        //     $allRow = $currentSheet->getHighestRow(); //取得一共有多少行
        //     $maxColumnNumber = Coordinate::columnIndexFromString($allColumn);
        //     $fields = [];
        //     for ($currentRow = 1; $currentRow <= 1; $currentRow++) {
        //         for ($currentColumn = 1; $currentColumn <= $maxColumnNumber; $currentColumn++) {
        //             $val = $currentSheet->getCellByColumnAndRow($currentColumn, $currentRow)->getValue();
        //             $fields[] = $val;
        //         }
        //     }
        //     for ($currentRow = 2; $currentRow <= $allRow; $currentRow++) {
        //         $values = [];
        //         for ($currentColumn = 1; $currentColumn <= $maxColumnNumber; $currentColumn++) {
        //             $val = $currentSheet->getCellByColumnAndRow($currentColumn, $currentRow)->getValue();
        //             $values[] = is_null($val) ? '' : $val;
        //         }
        //         $row = [];
        //         $temp = array_combine($fields, $values);
        //         foreach ($temp as $k => $v) {
        //             if (isset($fieldArr[$k]) && $k !== '') {
        //                 $row[$fieldArr[$k]] = $v;
        //             }
        //         }
        //         if ($row) {
        //             $insert[] = $row;
        //         }
        //     }
        // } catch (Exception $exception) {
        //     $this->error($exception->getMessage());
        // }
    }

}
