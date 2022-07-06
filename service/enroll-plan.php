<?php

/**
 * Enroll Plan
 *
 * PHP version 8
 *
 * @category  Enroll
 * @package   Enroll
 * @author    Mr.Hope <zhangbowang1998@gmail.com>
 * @copyright 2022 Mr.Hope
 * @license   No License
 * @link      https://mrhope.site
 */

declare(strict_types=1);

require_once 'header/post-json.php';
require_once 'lib/curl.php';

$postData = json_decode(file_get_contents('php://input'));

// 获得查询结果
$result = curlGet("http://bkzsw.nenu.edu.cn/column.html?a=000018&b=000171&Action=Enrollment&year=" . $postData->year . "&sf=" . $postData->province . "&jhlb=" . $postData->plan . "&zylb=" . $postData->category . "&kelei=" . $postData->class);

preg_match('/<!--STARTPRINT11-->[\s\S]*?<table.*id="Entrance_table">\s*([\s\S]*?)\s*<\/table><!--ENDPRINT11-->/i', $result, $form);

preg_match('/<td.*id=\'Searchbiaoti\'>您已选择：<span>年份：<font color="#0099ff">(\d*)<\/font><\/span>.*?<span>省份：<font color="#0099ff">(.*)<\/font><\/span>.*?<span>计划性质：<font color="#0099ff">(.*)<\/font><\/span>.*?<span>专业类别：<font color="#0099ff">(.*)<\/font><\/span>.*?<span>科类：<font color="#0099ff">(.*)<\/font><\/span><\/td>[\s\S]*?<\/tr>/', $form[0], $info);

// remove first element
array_shift($info);

echo '{"info":' . json_encode($info, 320) . ',';

preg_match_all("/<tr class='RowTr'>\s*([\s\S]*?)\s*<\/tr><tr class='EBzcontent' id='EBzcontent_\d*'><td colspan='6'><\/td><\/tr>/", $form[0], $contentMatch);

array_shift($contentMatch[0]);

$content = array_map(function ($string) {
  preg_match_all("/<td align='center'>(.*?)<\/td>/", $string, $item);

  return array_map(fn ($cellContent): string =>
  $cellContent === "&nbsp;" ? "" : $cellContent, $item[1]);
}, $contentMatch[0]);

echo '"content":' . json_encode($content, 320) . '}';
