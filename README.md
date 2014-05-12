MongoDb Query for Xmark Data
----
This json represented [XMark Data](http://www.xml-benchmark.org/) [queries](https://www.monetdb.org/XQuery/Benchmark/Xmark/Queries)  for mongodb. 

Download  data from [dropbox](https://www.dropbox.com/s/kygoorwtz0sfzml/xmark-mongodb-data.zip), extract and then restore with:

`mongorestore --dbpath mongodb-data-path --db basex dump/basex`

run mongo instance
`mongod --dbpath mongodb-data-path`

run mongo.exe, use database, and then load script
`mongo`
`use basex`
`load('path-to-script/xmkark-mongodb-query.js')`

for single query execution time: 
`single(1, 5)`  => question number 1 run 5 times

for all query:
`allq(5)` => run all query 5 times each
There are queries with **_** they are alternatives.

**Basex** directory contains query in basex.
 - Query No. 4 and 7 are not possible.

