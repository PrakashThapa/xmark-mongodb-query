import module namespace n ="http://basex.org/modules/nosql/MongoDB";
let $url := "mongodb://127.0.0.1:27017/basex"
let $con := n:connect($url,{"type":"json"}),
    $q := '{price:{$gte:40}}'
let $x := n:find($con,"closed_auctions",$q,{"count":1})
return $x