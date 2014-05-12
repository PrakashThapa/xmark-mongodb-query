(: Q20. Group customers by their :)
(:      income and output the cardinality of each group. :)
import module namespace n ="http://basex.org/modules/nosql/MongoDB";
let $url := "mongodb://127.0.0.1:27017/basex",
    $db := n:connect($url,{"type":"json"}),
    $p1 := '{$project:{_id:1,p:"$profile.income"}}',
    $p := '{$project:{_id:1,con:
    {$cond:[
      {$gt:["$p",100000]},"preferred",
      {$cond:[{ $and: [{$lt:["$p", 100000] }, {$gte:["$p", 30000] }] },"standard",
{$cond:[{$and:[{$lt:["$p",30000]},{$gt:["$p",0]}]},"challange","na"]}
]}  
]}
}}',

    $g := '{$group:{_id:"$con",value:{$sum:1}}}',
    $p2 := '{$project:{_id:1,value:1}}'

    
    
    
let $x := n:aggregate($db,"people",$p1,($p, $g,$p2))
return $x