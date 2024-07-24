<?php
/* bitbucket deploy webhook */

$logfile = '/var/log/apache2/gitlab-webhook.log';

/* Read the raw POST data */
$json = file_get_contents('php://input');
if (!$json) {
    log_append("Invalid Post Request");
    exit;
}

/*
Bitbucket 'POST' hooks and Bitbucket 'Pull Request POST' hooks were developed at different times and send the data in different ways - http://tinyurl.com/m96th4j.
*/
if ($_SERVER['CONTENT_TYPE'] == 'application/json') {

    $payload = json_decode($json);

} else {

    $payload = json_decode(urldecode(substr($json, 8)));

}

if (is_null($payload)) {
    log_append("Invalid Post Request");
    exit;
}

system('cd /var/www/bootcamp && git pull');
log_append("Gitlab Webhook executed");

function log_append($message, $time = null) {

    global $logfile;

    $time = $time === null ? time() : $time;
    $date = date('Y-m-d H:i:s');
    $pre  = $date . ' (' . $_SERVER['REMOTE_ADDR'] . '): ';

    file_put_contents($logfile, $pre . $message . "\n", FILE_APPEND);

}

?>
