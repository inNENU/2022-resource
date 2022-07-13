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
  $jar = new \GuzzleHttp\Cookie\CookieJar(true);


  // fetch code
  $response = $client->get(
    'http://bkzsw.nenu.edu.cn/include/webgetcode.php?width=85&height=28&sitex=15&sitey=6',
    ['cookies' => $jar],
  );

  $base64Code =
    "data:image/png;base64," . base64_encode($response->getBody()->getContents());

  $cookieArray = $jar->toArray();

  echo (json_encode(['cookies' => $cookieArray, 'verifyCode' => $base64Code], 320));
} else if ($postData->type === 'search') {
  $jar = new \GuzzleHttp\Cookie\CookieJar(
    true,
    $postDataArray['cookies']
  );

  // result
  $response = $client->send($jar->withCookieHeader(new Request(
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
  )));

  $result = $response->getBody()->getContents();

  preg_match('/<script language="javascript">alert\("(.*)"\);history.back\(-1\);<\/script>/', $result, $info);

  if (count($info)) {
    echo ('{"status": "error", "msg": "' . $info[1] . '"}');
  } else {
    echo ('{"status": "success", "info": "' . $result . '"}');
  }
}
