<?php
include('sys/main.php');

$type = $_GET['type'];

$return = [
    "response" => 0
];

switch ($type) {
    case "table":
        $url = $_GET['url'];
        $tables = $_GET['tables'];

        if ($url && $tables) {

            $find = prepare("SELECT * FROM tables WHERE url = :url", ["url" => $url])->fetch(PDO::FETCH_ASSOC);

            print_r($find);

            $data = [
                "data" => $tables,
                "url" => $url
            ];

            if (!empty($find['id'])) {
                $ex = prepare("UPDATE tables SET data = :data WHERE url = :url", $data);
            } else {
                $ex = prepare("INSERT INTO tables(url, data) VALUES (:url, :data)", $data);
            }

            if ($ex->rowCount()) {
                $return['response'] = 1;
                $return['message'] = "successfully.";
            } else {
                $return['message'] = "failled.";
            }
        } else {
            $return['message'] = "Url and Tables must be fill.";
        }

        break;

    default:
        $return['message'] = "something went wrong.";
}
output($return);
