(: Q18.Convert the currency of the reserve of all open auctions to  :)
(:     another currency. :)
import module namespace n ="http://basex.org/modules/nosql/MongoDB";
let $url := "mongodb://127.0.0.1:27017/basex",
    $db := n:connect($url,{"type":"json"}),
    $m := '{$match:{reserve:{$exists:true}}}',
    $p := '{$project:{_id:0,reserve:{$multiply:["$reserve",2.20371]}}}'
    
let $x := n:aggregate($db,"open_auctions",$m,$p)
return $x

(:same number as xquery:)