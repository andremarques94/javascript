<?php
/* gitlab deploy webhook */

$logfile = '/var/log/apache2/gitlab-webhook.log';

/* Read the raw POST data */
$json = file_get_contents('php://input');
$data = json_decode($json);

//log_append($json);

if (!is_object($data) || empty($data->ref)) {
    log_append("Invalid Post Request");
    exit;
}

$output = system('cd /var/www/bootcamp && git pull', $result);
log_append("Gitlab Webhook executed with exit code: " . $result . ", " . $output);

function log_append($message, $time = null) {

    global $logfile;

    $time = $time === null ? time() : $time;
    $date = date('Y-m-d H:i:s');
    $pre  = $date . ' (' . $_SERVER['REMOTE_ADDR'] . '): ';

    file_put_contents($logfile, $pre . $message . "\n", FILE_APPEND);

}

?>
