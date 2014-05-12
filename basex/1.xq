import module namespace n ="http://basex.org/modules/nosql/MongoDB";
let $url := "mongodb://127.0.0.1:27017/basex"
let $db := n:connect($url,{"type":"json"})
let $x := n:find($db,"people",'{"_id":"person0"}','{"_id":0,"name":1}')
return $x