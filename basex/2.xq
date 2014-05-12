import module namespace n ="http://basex.org/modules/nosql/MongoDB";
let $url := "mongodb://127.0.0.1:27017/basex",
    $db := n:connect($url,{"type":"json"}),
    $p := '{$project:{_id:1,bidder:"$bidder"}}',
    $u := '{ $unwind: "$bidder"}',
    $g := '{$group:{_id:"$_id",increase:{$first:"$bidder.increase"}}}',
    $u2 := '{ $unwind: "$increase"}',
    $p2 := '{$project:{_id:0,increase:1}}',
    $sort := '{$sort:{_id:1}}'
    
let $x := n:aggregate($db,"open_auctions",$u,($p,$g,$sort,$u2,$p2))
return $x

(:same number as xquery:)