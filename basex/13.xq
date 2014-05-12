import module namespace n ="http://basex.org/modules/nosql/MongoDB";
let $url := "mongodb://127.0.0.1:27017/basex",
    $db := n:connect($url,{"type":"xml"}),
    $match := '{$match:{regions:"australia"}}',
    (:$p := '{$project:{_id:0,name:1,description:"$description"}}',:)
    $p2 := '{$project:{_id:0,item:{name:"$name",description:"$description"}}}'
    let $x := n:aggregate($db,"regions",$match,($p2))
return $x