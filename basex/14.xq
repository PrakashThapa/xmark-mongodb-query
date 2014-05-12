import module namespace n ="http://basex.org/modules/nosql/MongoDB";
let $url := "mongodb://127.0.0.1:27017/basex",
$db := n:connect($url,{"type":"json"}),
$match := '{$match:{$text:{$search:"gold"}}}',
$g := '{$group:{_id:"$_id"}}',
$g2 := '{$group:{_id:null,count:{$sum:1}}}',
$p := '{$project:{_id:0,count:1}}',
$x := n:aggregate($db,"regions",$match,($g,$g2,$p))
return $x
(: for $m in /site/*/name()
return 
n:drop($db,$m) :)