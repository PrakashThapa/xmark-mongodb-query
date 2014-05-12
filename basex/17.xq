(: Q17. Which persons don't have a homepage? :)
import module namespace n ="http://basex.org/modules/nosql/MongoDB";
let $url := "mongodb://127.0.0.1:27017/basex",
    $db := n:connect($url,{"type":"json"}),
    $m := '{ $match:{homepage:{$exists:false}}}',
    $p := '{$project:{_id:0,person:"$name"}}'
    
let $x := n:aggregate($db,"people",$m,$p)
return $x

(:same number as xquery:)