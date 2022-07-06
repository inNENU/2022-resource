<?php

/**
 * Login Handler
 *
 * PHP version 8
 *
 * @category  Search
 * @package   Search
 * @author    Mr.Hope <zhangbowang1998@gmail.com>
 * @copyright 2021 Mr.Hope
 * @license   No License
 * @link      https://mrhope.site
 */

declare(strict_types=1);

require_once 'header/post-json.php';

function generateWordInfo(string $word): object
{
  return (object) [
    'text' => $word,
    'weight' => mb_strlen($word)
  ];
}

/**
 * 生成匹配词
 * 
 * ```ts
 * interface WordInfo {
 *   text: string;
 *   weight: number;
 * }
 * ```
 *
 * @param $word 搜索词
 * @return [word: WordInfo[], index: WordInfo[]]
 */
function generateWords(string $searchWord): array
{
  $length = mb_strlen($searchWord);

  if ($length === 1) {
    return [
      'words' => [],
      'index' => [],
    ];
  }

  $words = preg_split('/ \+/', $searchWord);

  $index = [];

  foreach ($words as $word) {
    if (mb_strlen($word) > 2) {
      for ($wordNumber = $length - 1; $wordNumber > 1; $wordNumber--) {
        $result = [
          'level' => $wordNumber,
          'items' => [],
        ];

        for ($start = 0; $start < $length - $wordNumber + 1; $start++) {
          array_push($result['items'], (object) [
            'text' => mb_substr($word, $start, $wordNumber),
            'weight' => pow(2, $wordNumber)
          ]);
        }

        array_push($index, $result);
      }
    }
  }

  return [
    'words' => array_map("generateWordInfo", $words),
    'index' => $index,
  ];
}

/**
 * 获得关键词列表
 *
 * @param string $searchWord 输入的搜索词
 *
 * @return string[] 匹配的候选词列表
 */
function getWordList(string $searchWord, array $searchIndex): array
{
  $TITLE = 1;
  $HEADING = 2;

  $words = [];

  foreach ($searchIndex as $indexContent) {

    // 检查页面标题是否包含了 searchWord
    if (mb_strpos($indexContent[0], $searchWord) !== false && in_array($indexContent[0], $words) === false) {
      array_push($words, $indexContent[0]);
    }

    // 搜索页面索引
    foreach ($indexContent[1] as $indexItem) {
      $type = $indexItem[0];
      $config = $indexItem[1];

      // 检查大小标题是否包含了 searchWord
      if ($type === $TITLE || $type === $HEADING) {
        if (mb_strpos($config, $searchWord) !== false && in_array($config, $words) === false) {
          array_push($words, $config);
        }
      }
    }
  }

  return $words;
}

function getMatchList(array $words, array $indexContent)
{
  $TITLE = 1;
  $HEADING = 2;
  $TEXT = 3;
  $IMAGE = 4;
  $CARD = 5;
  $DOC = 6;

  $matchTimes = 0;
  $matchList = [];
  $weight = 0;

  foreach ($words as $word) {
    $currentMatched = count($matchList);

    // 搜索页面标题，权重为 8
    if (
      mb_strpos($indexContent[0], $word->text) !== false
    ) {
      $weight += 8 * $word->weight;
    }

    // 搜索页面索引
    foreach ($indexContent[1] as $indexItem) {
      $type = $indexItem[0];
      $config = $indexItem[1];

      // 搜索大标题，权重为 4
      if ($type === $TITLE) {
        if (
          mb_strpos($config, $word->text) !== false
        ) {
          $weight += 4 * $word->weight;
          array_push(
            $matchList,
            ['title', $config]
          );
        }
      }
      // 搜索段落标题，权重为 2
      else if ($type === $HEADING) {
        if (
          mb_strpos($config, $word->text) !== false
        ) {
          $weight += 2 * $word->weight;
          array_push(
            $matchList,
            ['heading', $config]
          );
        }
      }
      // 搜索文档，权重为 2
      else if ($type === $DOC) {
        if (
          mb_strpos($config->name, $word->text) !== false
        ) {
          $weight += 2 * $word->weight;
          array_push(
            $matchList,
            ['doc', [
              'name' => $config->name,
              'icon' => $config->icon
            ]]
          );
        }
      }
      // 搜索卡片，权重为 2
      else if ($type === $CARD) {
        if (
          mb_strpos($config->title, $word->text) !== false
        ) {
          $weight += 2 * $word->weight;
          array_push(
            $matchList,
            ['card', [
              'title' => $config->title,
              'desc' => $config->desc
            ]]
          );
        } else if (
          mb_strpos($config->desc, $word->text) !== false
        ) {
          $weight += 2 * $word->weight;
          array_push(
            $matchList,
            ['card', [
              'title' => $config->title,
              'desc' => $config->desc
            ]]
          );
        }
      }
      // 搜索文字，权重为 1
      else if ($type === $TEXT) {
        $pos = mb_strpos($config, $word->text);

        if (
          $pos !== false
        ) {
          $weight += 1 * $word->weight;
          $startIndex = max(0, $pos - 8);
          $endIndex = min(
            $pos + 8 + mb_strlen($word->text) - 1,
            mb_strlen($config) - 1
          );

          array_push(
            $matchList,
            ['text', [
              'word' => $word->text,
              'pre' => ($startIndex === 0 ? "" : "...") . mb_substr($config, $startIndex, $pos - $startIndex),
              'after' => mb_substr($config, $pos + mb_strlen($word->text), $endIndex - $pos + 1) . ($endIndex === mb_strlen($config) - 1 ? "" : "...")
            ]]
          );
        }
      }
      // 搜索图片，权重为 1
      else if ($type === $IMAGE) {
        if (
          mb_strpos($config->desc, $word->text) !== false
        ) {
          $weight += 1 * $word->weight;
          array_push(
            $matchList,
            ['img', [
              'desc' => $config->desc,
              'icon' => $config->icon,
            ]]
          );
        }
      }
    }

    if ($currentMatched !== count($matchList)) {
      $matchTimes++;
    }
  }


  return [
    'weight' => pow(16, $matchTimes - 1) * $weight,
    'matchList' => $matchList,
  ];
}

/**
 * 搜索
 *
 * @param searchWord 输入的搜索词
 * @param category 搜索分类
 * 
 * @return SearchResult[] 匹配的结果列表
 */
function getResult(string $searchWord, object $searchIndex)
{
  $wordsInfo = generateWords($searchWord);
  $result = [];

  foreach ($searchIndex as $pageID => $indexContent) {
    $matchResult = getMatchList($wordsInfo['words'], $indexContent);

    if ($matchResult['weight']) {
      $result[$pageID] = [
        'weight' => $matchResult['weight'] * 4096,
        'index' => $matchResult['matchList'],
      ];
    } else {
      for ($index = 0; $index < count($wordsInfo['index']); $index++) {
        $matchResult = getMatchList($wordsInfo['index'][$index]['items'], $indexContent);

        if ($matchResult['weight']) {
          $result[$pageID] = [
            'weight' => $matchResult['weight'] * $wordsInfo['index'][$index]['level'],
            'index' => $matchResult['matchList'],
          ];

          break;
        }
      }
    }
  }

  array_multisort(array_column($result, 'weight'), SORT_DESC, $result);

  $searchResult = [];

  $count = 0;

  foreach ($result as $pageID => $indexList) {
    // max 30 pages
    if ($count < 30) {
      $count++;
      array_push($searchResult, [
        'title' => $searchIndex->$pageID[0],
        'id' => $pageID,
        'index' => $indexList['index'],
      ]);
    }
  }

  return $searchResult;
}

if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
  chdir("../r/");

  $data = json_decode(file_get_contents('php://input'));

  $scope = isset($data->scope) ? $data->scope : 'all';
  $word = isset($data->scope) ? $data->word : '';
  $type = isset($data->type) ? $data->type : '';

  $filename = $data->scope . "-search.json";

  $handle = @fopen($filename, "r");

  if ($handle) {
    $searchIndexContent = fread($handle, filesize($filename));
    fclose($handle);
    $content = json_decode($searchIndexContent);

    if ($type === 'word') {
      echo (json_encode(getWordList($word, $content), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    } else if ($type === 'result') {
      echo (json_encode((getResult($word, $content)), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    } else {
      echo 'type is invalid';
    }
  } else {
    echo 'index file not found';
  }
}
