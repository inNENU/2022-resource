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

require_once('./header/post-json.php');

function generateWordInfo($word)
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
 * @param string $word 搜索词
 * @return [word: WordInfo[], index: WordInfo[]]
 */
function generateWords($searchWord)
{
  $length = mb_strlen($searchWord);

  if ($length === 1) return [];

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
function getWordList($searchWord,  $searchIndex)
{
  $words = [];

  foreach ($searchIndex as $indexContent) {
    $name = isset($indexContent->name) ? $indexContent->name : "";
    $desc = isset($indexContent->desc) ? $indexContent->desc :  "";
    $title = isset($indexContent->title) ? $indexContent->title : [];
    $heading =
      isset($indexContent->heading) ? $indexContent->heading : [];

    // 检查标题是否包含了 searchWord
    if (mb_strpos($name, $searchWord)  !== false && in_array($name, $words)  === false) {
      array_push($words, $name);
    }

    // 检查描述是否包含了 searchWord
    if (
      mb_strpos($desc, $searchWord)  !== false
      && in_array($desc, $words)  === false
    ) {
      array_push($words, $desc);
    }

    // 检查大标题是否包含了 searchWord
    foreach ($title as $item) {
      if (
        mb_strpos($item, $searchWord)  !== false
        && in_array($item, $words)  === false
      ) {
        array_push($words, $item);
      }
    }

    // 检查小标题是否包含了 searchWord
    foreach ($heading as $item) {
      if (
        mb_strpos($item, $searchWord)  !== false
        && in_array($item, $words)  === false
      ) {
        array_push($words, $item);
      }
    }
  }

  return $words;
}


function getMatchList($words, $indexContent)
{
  $weight = 0;
  $matchList = [];

  // 搜索页面标题，权重为 8
  foreach ($words as $word) {
    if (
      mb_strpos($indexContent->name, $word->text)  !== false
    ) {
      $weight += 8 * $word->weight;
    }
  }

  // 搜索页面索引
  foreach ($indexContent->index as $indexItem) {
    $type = $indexItem[0];
    $config = $indexItem[1];

    // 搜索大标题，权重为 4
    if ($type === 'title') {
      foreach ($words as $word) {
        if (
          mb_strpos($config, $word->text)  !== false
        ) {
          $weight += 4 * $word->weight;
          array_push($matchList, ['title', $config]);
        }
      }
    }
    // 搜索段落标题，权重为 2
    else if ($type === 'heading') {
      foreach ($words as $word) {
        if (
          mb_strpos($config, $word->text)  !== false
        ) {
          $weight += 2 * $word->weight;
          array_push($matchList, ['heading', $config]);
        }
      }
    }
    // 搜索文档，权重为 2
    else if ($type === 'doc') {
      foreach ($words as $word) {
        if (
          mb_strpos($config->name, $word->text)  !== false
        ) {
          $weight += 2 * $word->weight;
          array_push($matchList, ['doc', [
            'name' => $config->name,
            'icon' => $config->icon
          ]]);
        }
      }
    }
    // 搜索卡片，权重为 2
    else if ($type === 'card') {
      foreach ($words as $word) {
        if (
          mb_strpos($config->title, $word->text)  !== false
        ) {
          $weight += 2 * $word->weight;
          array_push($matchList, ['card', [
            'title' => $config->title,
            'desc' => $config->desc
          ]]);
        } else if (
          mb_strpos($config->desc, $word->text)  !== false
        ) {
          $weight += 2 * $word->weight;
          array_push($matchList, ['card', [
            'title' => $config->title,
            'desc' => $config->desc
          ]]);
        }
      }
    }
    // 搜索文字，权重为 1
    else if ($type === 'text') {
      foreach ($words as $word) {
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
            [
              'type' => 'text',
              'before' => ($startIndex === 0 ? "" : "...") . mb_substr($config, $startIndex, $pos - $startIndex),
              'word' => $word->text,
              'after' => mb_substr($config, $pos + mb_strlen($word->text), $endIndex - $pos + 1) . ($endIndex === mb_strlen($config) - 1 ? "" : "...")
            ]
          );
        }
      }
    }
  }

  return [
    'weight' => $weight,
    'matchList' => $matchList,
  ];
}

/**
 * 搜索
 *
 * @param searchWord 输入的搜索词
 * @param category 搜索分类
 *
 * 
 * 搜索匹配详情
 * interface SearchContentDetail {
 *   type: "title" | "heading" | "text" | "card" | "doc";
 *   [props: string]: any;
 * }
 * 
 * 搜索内容
 * interface SearchContent {
 *   权重
 *   weight: number;
 *   搜索内容
 *   content: SearchContentDetail[];
 * }
 * 
 * 搜索结果
 * interface SearchResult {
 *   页面标题
 *   title: string;
 *   页面标识
 *   id: string;
 *   搜索内容
 *   content?: SearchContentDetail[];
 * }
 * 
 * @return SearchResult[] 匹配的结果列表
 */
function getResult($searchWord, $searchIndex)
{

  $wordsInfo = generateWords($searchWord);
  $result = [];

  foreach ($searchIndex as $pageID => $indexContent) {
    $matchResult = getMatchList($wordsInfo['words'], $indexContent);

    if ($matchResult['weight']) {
      $result[$pageID] = [
        'weight' => $matchResult['weight'] * 100,
        'index' => $matchResult['matchList'],
      ];
    } else {
      for ($index = 0; $index < count($wordsInfo['index']); $index++) {
        $matchResult = getMatchList($wordsInfo['index'][$index], $indexContent);

        if ($matchResult['weight']) {
          $result[$pageID] = [
            'weight' => $matchResult['weight'] * 100,
            'index' => $matchResult['matchList'],
          ];
        }

        break;
      }
    }
  }

  array_multisort(array_column($result, 'weight'), SORT_DESC, $result);

  $searchResult = [];

  foreach ($result as $pageID => $indexList) {
    array_push($searchResult, [
      'title' => $searchIndex->$pageID->name,
      'id' => $pageID,
      'index' => $indexList['index'],
    ]);
  }

  return $searchResult;
}

function m_mb_convert_encoding($string)
{
  if (!is_array($string) && !is_int($string)) {
    return mb_convert_encoding($string, 'UTF-8', 'UTF-8');
  }

  foreach ($string as $key => $value) {
    $string[$key] = m_mb_convert_encoding($value);
  }

  return $string;
}

if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
  chdir("../r/");

  $data = json_decode(file_get_contents('php://input'));


  $scope = $data->scope || 'all';
  $word = $data->word;
  $type = $data->type;

  $filename = $data->scope . "-search.json";

  $handle = @fopen($filename, "r");

  if ($handle) {
    $searchIndexContent = fread($handle, filesize($filename));
    fclose($handle);
    $content = json_decode($searchIndexContent);

    if ($type === 'word') {
      echo (json_encode(getWordList($word, $content), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    } else if ($type === 'result') {
      echo (json_encode(m_mb_convert_encoding(getResult($word, $content)), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
      echo (json_encode((getResult($word, $content)), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
      json_last_error();
    } else {
      echo 'error';
    }
  } else {
    echo 'error';
  }
}
