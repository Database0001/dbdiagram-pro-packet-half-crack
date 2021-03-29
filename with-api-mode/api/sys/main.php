<?php
$db = new PDO('mysql:host=sql306.epizy.com;dbname=epiz_24922343_db;charset=utf8mb4', 'epiz_24922343', 'WPl1Kkmt9YIwH');

function output($array)
{
    echo json_encode($array, JSON_UNESCAPED_UNICODE);
    exit;
}


function prepare($sql, $data = [])
{
    global $db;

    $ex = $db->prepare($sql);
    $ex->execute($data);

    return $ex;
}
