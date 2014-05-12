import module namespace n ="http://basex.org/modules/nosql/MongoDB";
let $url := "mongodb://127.0.0.1:27017/basex",
    $db := n:connect($url,{"type":"json"}),
    $u := '{ $unwind: "$bidder"}',
    $g := '{$group:{_id:"$_id",first:{$first:"$bidder.increase"},last:{$last:"$bidder.increase"}}}',
    $u2 :='{$unwind:"$first"}',
    $u3 := '{$unwind:"$last"}',
    $p := '{$project:{_id:1,first:1,last:1,diff:{$gte:["$last",{$multiply:["$first",2]}]}}}',
    $match := '{$match:{diff:true}}',
    $sort := '{$sort:{_id:1}}',
    $p2 := '{$project:{_id:1,increase:{first:"$first",last:"$last"}}}'
    
let $x := n:aggregate($db,"open_auctions",$u,($g,$sort,$u2,$u3,$p,$match, $sort, $p2))
return $x