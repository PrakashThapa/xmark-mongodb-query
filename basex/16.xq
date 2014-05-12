import module namespace n ="http://basex.org/modules/nosql/MongoDB";
let $url := "mongodb://127.0.0.1:27017/basex",
    $db := n:connect($url,{"type":"xml"}),
    $p1 := '{$project:{_id:1,parlist:"$annotation.description.parlist",person:"$seller.person"}}',
    $u1 := '{ $unwind: "$parlist"}',
    $u2 := '{ $unwind: "$parlist.listitem.parlist"}',
    $p2 := '{$project:{_id:1,text:"$parlist.listitem.parlist.listitem.text",person:1}}',
    $m1 := '{$match:{"text.emph.keyword":{$exists:true}}}',
    $p3 := '{$project:{_id:0,"person.id":"$person"}}'
    
    
let $x := n:aggregate($db,"closed_auctions",$p1,($u1,$u2,$p2,$m1,$p3))
return $x//person

(:same number as xquery:)