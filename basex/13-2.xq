import module namespace n ="http://basex.org/modules/nosql/MongoDB";
let $url := "mongodb://127.0.0.1:27017/basex",
    $db := n:connect($url,{"type":"xml"})
    let $x := n:find($db,"regions",'{regions:"australia"}','{_id:0,name:1,description:1}')
return $x