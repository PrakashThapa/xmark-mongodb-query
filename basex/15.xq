import module namespace n ="http://basex.org/modules/nosql/MongoDB";
let $url := "mongodb://127.0.0.1:27017/basex",
    $db := n:connect($url,{"type":"xml"}),
    $p := '{$project:{_id:1,parlist:"$annotation.description.parlist"}}',
    $u := '{ $unwind: "$parlist"}',
    $u2 := '{ $unwind: "$parlist.listitem.parlist"}',
    $p2 := '{$project:{_id:1,text:"$parlist.listitem.parlist.listitem.text"}}',
    $m := '{$match:{$or:[{"text.emph.keyword":{$exists:true}},{"text.emph.keyword.childtext":{$exists:true}},{"text.emph.keyword.child":{$exists:true}}]}}',
    $p3 := '{$project:{_id:0,text:"$text.emph.keyword"}}'
    
    
let $x := n:aggregate($db,"closed_auctions",$p,($u,$u2,$p2,$m,$p3))
return $x

(:same number as xquery:)