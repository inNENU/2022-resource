<?php

/**
 * Admission Notice
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
require_once 'vendor/autoload.php';

use GuzzleHttp\Psr7\Request;

$postData = json_decode(file_get_contents('php://input'));
$postDataArray = json_decode(file_get_contents('php://input'), true);

$client = new \GuzzleHttp\Client();

if ($postData->type === 'fetch') {
  if ($postData->level === '本科生') {
    $jar = new \GuzzleHttp\Cookie\CookieJar(true);


    // fetch code
    $response = $client->get(
      'http://bkzsw.nenu.edu.cn/include/webgetcode.php?width=85&height=28&sitex=15&sitey=6',
      ['cookies' => $jar],
    );

    $base64Image =
      "data:image/png;base64," . base64_encode($response->getBody()->getContents());
    $info = [
      'cookies' => $jar->toArray(),
      'info' => ['name', 'id', 'testId'],
      'verifyCode' => $base64Image,
      'notice' => '目前招生办尚未提供 2022 年高考录取查询方式',
      'detail' => [
        'title' => "暂未公布",
        'content' => '目前学校招生办公室尚未提供任何有效的高考录取查询方式。',
      ],
    ];

    echo (json_encode($info, 320));
  } else if ($postData->level === '研究生') {
    $info = [
      'cookies' => [],
      'info' => ['name', 'id'],
      'verifyCode' => '',
      'notice' => '考生姓名只需输入前三个汉字',
      'detail' => null,
    ];
    echo (json_encode($info, 320));
  }
} else if ($postData->type === 'search') {
  if ($postData->level === '本科生') {
    $jar = new \GuzzleHttp\Cookie\CookieJar(
      true,
      $postDataArray['cookies']
    );

    // result
    $content = $client->send($jar->withCookieHeader(new Request(
      'POST',
      'http://bkzsw.nenu.edu.cn/col_000018_000169_action_Entrance.html',
      [
        "accept" =>  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language" =>  "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control" =>  "max-age=0",
        "content-type" =>  "application/x-www-form-urlencoded",
        "upgrade-insecure-requests" =>  "1",
        "Referrer-Policy" =>  "strict-origin-when-cross-origin"
      ],
      'en_zkz=' . $postData->testid . '&en_sfz=' . $postData->id . '&en_xm=' . urlencode($postData->name) . '&en_code=' . $postData->verifyCode
    )))->getBody()->getContents();

    preg_match('/<script language="javascript">alert\("(.*)"\);history.back\(-1\);<\/script>/', $content, $info);

    if (count($info)) {
      echo ('{"status": "error", "msg": "' . $info[1] . '"}');
    } else {
      // TODO: do something with $content

      $info = [];

      echo (json_encode([
        'status' => 'success',
        'info' => $info,
      ], 320));
    }
  } else if ($postData->level === '研究生') {
    $content = $client->send(
      new Request('POST', 'http://yzb.nenu.edu.cn/yjs/sslq_result/2022',    [
        "accept" => "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language" => "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type" => "application/x-www-form-urlencoded",
        "upgrade-insecure-requests" => "1",
        "Referer" => "http://yzb.nenu.edu.cn/yjs/sslq",
        "Referrer-Policy" => "strict-origin-when-cross-origin"
      ], 'xm=' . urlencode($postData->name) . '&zjhm=' . $postData->id)
    )->getBody()->getContents();

    if (str_contains($content, '<button type="submit" >查询</button>')) {
      echo ('{"status": "error", "msg": "暂无信息"}');
    } else {
      preg_match('/<li class="label_short">考生编号：<\/li>\s*<li class="bz">(.*?)<\/li>/', $content, $testId);
      preg_match('/<li class="label_short">考生姓名：<\/li>\s*<li class="bz">(.*?)<\/li>/', $content, $name);
      preg_match('/<li class="label_short">获取方式：<\/li>\s*<li class="bz">(.*?)<\/li>/', $content, $way);
      preg_match('/<li class="label_short">通信地址：<\/li>\s*<li class="bz" style="width:300px">(.*?)<\/li>/', $content, $address);
      preg_match('/<li class="label_short">移动电话：<\/li>\s*<li class="bz">(.*?)<\/li>/', $content, $phone);
      preg_match('/<li class="label_short">家庭成员电话：<\/li>\s*<li class="bz">(.*?)<\/li>/', $content, $contact);
      preg_match('/<li class="label_short">收 件 人：<\/li>\s*<li class="bz">(.*?)<\/li>/', $content, $receiver);
      preg_match('/<li class="label_short">详情单号：<\/li>\s*<li class="bz"><a href=\'http:\/\/www.ems.com.cn\' target=\'_blank\'>(.*?)<\/a><\/li>/', $content, $expressId);

      $info = [
        [
          'text' => '考生号',
          'value' => $testId[1]
        ],
        [
          'text' => '考生姓名',
          'value' => $name[1]
        ],
        [
          'text' => '获取方式',
          'value' => $way[1]
        ],
        [
          'text' => '通信地址',
          'value' => $address[1]
        ],
        [
          'text' => '移动电话',
          'value' => $phone[1]
        ],
        [
          'text' => '家庭成员电话',
          'value' => $contact[1]
        ],
        [
          'text' => '收件人',
          'value' => $receiver[1]
        ],
        [
          'text' => '快递单号',
          'value' => $expressId[1]
        ]
      ];

      echo (json_encode([
        'status' => 'success',
        'info' => $info,
      ], 320));
    }
  }
}
