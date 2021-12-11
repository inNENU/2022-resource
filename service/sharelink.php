<?php

/**
 * Page Handler
 *
 * PHP version 8
 *
 * @category  Page
 * @package   Page
 * @author    Mr.Hope <zhangbowang1998@gmail.com>
 * @copyright 2021 Mr.Hope
 * @license   No License
 * @link      https://mrhope.site
 */

declare(strict_types=1);

require_once('./header/post-json.php');

if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
  $data = json_decode(file_get_contents('php://input'));
  $appID = $data->appID;
  $id = $data->id;

  $handle = @fopen($filename, "r");
  $filename = "../resource/config/shareLink.json";

  if ($handle) {
    $contents = fread($handle, filesize($filename));
    fclose($handle);
    $shareLinks = json_decode($contents);
    if (isset($shareLinks->$appID->$id)) {
      echo "{\"link\":\"" . $shareLinks->$appID->$id . "\",\"error\":false}";
    } else {
      echo "{\"error\":true}";
    }
  } else {
    echo "{\"error\":true}";
  }
}
