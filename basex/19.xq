(: Q19. Give an alphabetically ordered list of all :)
(:      items along with their location. :)

import module namespace n ="http://basex.org/modules/nosql/MongoDB";
let $url := "mongodb://127.0.0.1:27017/basex",
    $db := n:connect($url,{"type":"xml"}),
    $p := '{$project:{_id:0,"item.name":"$name","item.location":"$location"}}',
    $sort := '{$sort:{location:1}}'
    
let $x := n:aggregate($db,"regions",$sort,($p))
return $x
(:same number as xquery:)