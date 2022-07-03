<?php

/**
 * Login Handler
 *
 * PHP version 8
 *
 * @category  Login
 * @package   Login
 * @author    Mr.Hope <zhangbowang1998@gmail.com>
 * @copyright 2021 Mr.Hope
 * @license   No License
 * @link      https://mrhope.site
 */

declare(strict_types=1);

require_once 'header/post-json.php';
require_once 'lib/curl.php';
require_once('./info/appid.php');

// 获得传递数据
$data = json_decode(file_get_contents('php://input'));

// 获得登录状态码
$env = $data->env;
$code = $data->code;
$appID = $data->appID;
$secret = $AppSecretList[$appID];

$url =  'https://api.' . ($env === 'qq' ? 'q' : 'weixin') . '.qq.com/sns/jscode2session?appid=' . $appID . '&secret=' . $secret . '&js_code=' . $code . '&grant_type=authorization_code';

$response = curlGet($url);
$result = json_decode($response, true);
unset($result['session_key']);
echo (json_encode($result, 320));
