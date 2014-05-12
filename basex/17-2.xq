(: Q17. Which persons don't have a homepage? :)
import module namespace n ="http://basex.org/modules/nosql/MongoDB";
let $url := "mongodb://127.0.0.1:27017/basex",
    $db := n:connect($url,{"type":"json"}),
    $q := '{homepage:{$exists:false}}',
    $p := '{_id:0,name:1}'
    
let $x := n:find($db,"people",$q,$p)
return $x