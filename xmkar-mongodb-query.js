conn = new Mongo();
db = conn.getDB("basex");
function q1() {
 return db.people.find({_id:"person0"},{_id:0,"name":1});
 
}
function q2() {
 return db.open_auctions.aggregate([
		{$project:{_id:1,bidder:"$bidder"}},
		{ $unwind: "$bidder"},
		{$group:{_id:"$_id",increase:{$first:"$bidder.increase"}}},
		{$sort:{_id:1}},
		{ $unwind: "$increase"},
		{$project:{_id:0,increase:1}}
	])
		
}

function q3() {
	return db.open_auctions.aggregate([
		{ $unwind: "$bidder"},
		{$group:{_id:"$_id",first:{$first:"$bidder.increase"},last:{$last:"$bidder.increase"}}},
		{$unwind:"$first"},
		{$unwind:"$last"},
		{$project:{_id:1,first:1,last:1,diff:{$gte:["$last",{$multiply:["$first",2]}]}}},
		{$match:{diff:true}},
		{$sort:{_id:1}},
		{$project:{_id:0,increase:{first:"$first",last:"$last"}}}
	])

}
function q5() {
  return db.closed_auctions.find({price:{$gte:40}}).count()
}
function q6() {
  return db.regions.find().count()
}
function q13() {
	return db.regions.aggregate([
		{$match:{regions:"australia"}},
		{$project:{_id:0,item:{name:"$name",description:"$description"}}}
	])

}
function q13_2() {
	return db.regions.find(
		{regions:"australia"},
		{_id:0,name:1,description:1}
	)
}
function q14() {
	return db.regions.aggregate([
		{$match:{$text:{$search:"gold"}}},
		{$group:{_id:"$_id"}},
		{$group:{_id:null,count:{$sum:1}}},
		{$project:{_id:0,count:1}}
	])
}
function q15() {
	return db.closed_auctions.aggregate([
		{$project:{_id:1,parlist:"$annotation.description.parlist"}},
		{ $unwind: "$parlist"},
		{ $unwind: "$parlist.listitem.parlist"},
		{$project:{_id:1,text:"$parlist.listitem.parlist.listitem.text"}},
		{$match:{$or:[{"text.emph.keyword":{$exists:true}},{"text.emph.keyword.childtext":{$exists:true}},{"text.emph.keyword.child":{$exists:true}}]}},
		{$project:{_id:0,text:"$text.emph.keyword"}}
	])
}
function q16() {
	return db.closed_auctions.aggregate([
		{$project:{_id:1,parlist:"$annotation.description.parlist",person:"$seller.person"}},
		{ $unwind: "$parlist"},
		{ $unwind: "$parlist.listitem.parlist"},
		{$project:{_id:1,text:"$parlist.listitem.parlist.listitem.text",person:1}},
		{$match:{"text.emph.keyword":{$exists:true}}},
		{$project:{_id:0,"person.id":"$person"}}
	])
}
function q17() {
	return db.people.aggregate([
		{ $match:{homepage:{$exists:false}}},
		{$project:{_id:0,person:"$name"}}
	])
}
function q17_2() {
	return db.people.find(
		{homepage:{$exists:false}},
		{_id:0,person:"$name"}
	)
}
function q18() {
	return db.open_auctions.aggregate([
		{$match:{reserve:{$exists:true}}},
		{$project:{_id:0,reserve:{$multiply:["$reserve",2.20371]}}}
	])
}
function q19() {
	return db.regions.aggregate([
		{$sort:{location:1}},
		{$project:{_id:0,"item.name":"$name","item.location":"$location"}}
	])
}
function q20() {
	return db.people.aggregate([
		{$project:{_id:1,p:"$profile.income"}},
		{$project:{_id:1,con:
			{$cond:[
			  {$gt:["$p",100000]},"preferred",
			  {$cond:[{ $and: [{$lt:["$p", 100000] }, {$gte:["$p", 30000] }] },"standard",
		{$cond:[{$and:[{$lt:["$p",30000]},{$gt:["$p",0]}]},"challange","na"]}
		]}  
		]}
		}},
		{$group:{_id:"$con",sum:{$sum:1}}},
		{$project:{_id:1,sum:1}}
	])
}


function q4() {

}
function q7() {}

/*** Join Query ***/
function q8() {
	var ids = new Array();
	var name = new Array();
	var closed = new Array();
	var i=0;
	db.people.find({},{name:1}).forEach(function(people){
		ids[i] = people._id;
		name[ids[i]] = people.name;
		//closed[ids[i]] = {name:people.name,count:0};
		i++;
	});
	var closed_auc = db.closed_auctions.aggregate([
		{$project:{_id:1,person:"$buyer.person"}},
		//{$match:{person:{$in:["person12124","person12883"]}}},
		{$match:{person:{$in:ids}}},
		{$group:{_id:"$person",count:{$sum:1}}},
		{$sort:{count:-1}},
		{$project:{person:"$_id",count:1,_id:0}}
	]);
	if(closed_auc) {
		var i=0
		while(closed_auc.hasNext()){
			var auc = closed_auc.next();
			var id = auc.person;
			closed[i] = {"name":name[id],"count":auc.count}
			name[id] = 0;
			i++;
			//printjson(name.indexOf(id));
		}
		
	}/**/
	var len = closed.length ;
	var j = 0;
	for(var i=0; i < ids.length; i++) {
		if(name[ids[i]] !== 0) {
		//printjson(i);
		closed[len+j]	= {"name":name[ids[i]],"count":0};
		j++;
		}
	}
	//printjson("Execution Time" + end-start);
	return closed;
	
}

function q9() {
	var start = new Date().getMilliseconds();
	var ids = new Array();
	var name = new Array();
	var closed = new Array();
	var i=0;
	db.people.find({},{name:1}).forEach(function(people){
		ids[i] = {id:people._id, name: people.name};
		name[ids[i]] = people.name;
		//closed[ids[i]] = {name:people.name,count:0};
		i++;
	});
	var personids = new Array();
	var items = new Array();
	db.regions.find({regions:"europe"},{_id:1,name:1}).forEach(function(doc){
		items[doc._id] = doc.name;
	});
	
	var closed_auctions = db.closed_auctions.find({},{_id:0,"buyer.person":1,"itemref.item":1}).forEach(function(doc){
		var person = doc.buyer.person;
		var item =  doc.itemref.item;
		
		if(typeof items[item] !== "undefined") {
			if(!personids[person]){
				personids[person]	= [];
				personids[person][0]= items[item];
			} else {
				personids[person][personids[person].length] = items[item];
			}
			
		}
		
	});
	for(var i=0; i< ids.length;i++){
		var id = ids[i].id;
		if(typeof personids[id] !== "undefined") {
			ids[i].item = personids[id];
		}
		
	}
	var end = new Date().getMilliseconds();
	var diff = end-start;
	//printjson("Execution Time" + diff);
	//printjson(ids);
	return ids
	
}
//helper function for Q10.
var getProfileByCategory = function(catId){
		var prof = new Array();
		var i = 0;
		db.people.find(
		{"profile.interest":{$exists:true},"profile.interest":{"$elemMatch": {category:catId}}},
		{name:1, profile:1,address:1}
		).forEach(function(p){
			if(!p.address) {
				p.address = {};
			}
			var c = function (value){return ((value) && (typeof value !== "undefined")) ? value : "";}; 
			/**/
			prof[i] = {
						personne:{
						statistiques:{ sexe: c(p.profile.gender), age:c(p.profile.gender),education:c(p.profile.education),revenu:c(p.profile.income)},
						coordonnees:{nom:p.name,rue:(c(p.address) && c(p.address.street)),ville:c(p.address.city),pays:c(p.address.country),reseau:{courrier:c(p.emailaddress), pagePerso:c(p.homepage)}},
						cartePaiement:c(p.creditcard)
						} 
					}
			
			})
		return prof;
		};
		
var getProfileByCategories = function(catIds){
		var prof = new Array();
		var i = 0;
		db.people.find(
		{"profile.interest":{$exists:true},"profile.interest":{"$elemMatch": {category:{$in:catIds}}}},
		{name:1, profile:1,address:1}
		).forEach(function(p){
			if(!p.address) {
				p.address = {};
			}
			var c = function (value){return ((value) && (typeof value !== "undefined")) ? value : "";}; 
			/**/
			prof[i] = {
						personne:{
						statistiques:{ sexe: c(p.profile.gender), age:c(p.profile.gender),education:c(p.profile.education),revenu:c(p.profile.income)},
						coordonnees:{nom:p.name,rue:(c(p.address) && c(p.address.street)),ville:c(p.address.city),pays:c(p.address.country),reseau:{courrier:c(p.emailaddress), pagePerso:c(p.homepage)}},
						cartePaiement:c(p.creditcard)
						} 
					}
			
			})
		return prof;
		};


function q10() {
	var debugId = "person3"
	var ids = new Array();
	var i = 0;
	var allcategories = new Array();
	db.people.aggregate([
	{$match:{"profile.interest":{$exists:true}}},
	{$project:{_id:1, interest:"$profile.interest"}},
	{$unwind:"$interest"},
	{$group:{_id:"$interest.category"}},
	{$project:{_id:0, category:"$_id"}}
	]).forEach(function(people){
		var catId = people.category;
		ids[i] = {categorie:{id:catId,profile:getProfileByCategory(catId)}}
		i++;
	});
	//printjson("Execution Time" + diff);
	return ids;

}
function q11_2() {
	var start = new Date().getTime();
	var debugId = "person3"
	var ids = new Array();
	var name = new Array();
	var i = 0;
	var open_auc = new Array();
	db.open_auctions.find({},{_id:0,initial:1}).forEach(function(doc){
		open_auc[i++] = (doc.initial)?doc.initial * 5000:0;
	});
	var initialcount = function(initial){
		var count = 0;
		for( var i=0;i < open_auc.length;i++) {
			if(initial > open_auc[i]){
				count++;
			}
		}
		return count;
	};
	
	var i=0;
	//"profile.income":{$exists:true}
	db.people.find({},{_id:1, name:1,"profile.income":1}).forEach(function(people){
		var income = ((people.profile) && people.profile.income)? people.profile.income:0; 
		var counter  = (income)?initialcount(income):0;
		ids[i] = {item:{name: people.name,id:people._id,count:counter}};
		i++;
	});
	return ids;
}


function q11() {
	var start = new Date().getTime();
	var debugId = "person3"
	var ids = new Array();
	var open_auc = function(initial){
		return db.open_auctions.find({initial:{$lt:initial}},{_id:1}).count();
	}
	
	var i=0;
	db.people.find({},{_id:1, name:1,"profile.income":1}).forEach(function(people){
		var income = ((people.profile) && people.profile.income)? people.profile.income/5000:0; 
		ids[i] = {item:{name: people.name,id:people._id,count:open_auc(income)}};
		i++;
	});
	return ids;
}
function q12() {
	var debugId = "person3"
	var ids = new Array();
	var open_auc = function(initial){
		return db.open_auctions.find({initial:{$lt:initial}},{_id:1}).count();
	}
	
	var i=0;
	db.people.find({"profile.income":{$exists:true}, "profile.income":{$gt:50000}},{_id:1, name:1,"profile.income":1}).forEach(function(people){
		var income = ((people.profile) && people.profile.income)? people.profile.income/5000:0; 
		ids[i] = {item:{name: people.name,id:people._id,count:open_auc(income)}};
		i++;
	});
	//printjson(i+"--Execution Time" + diff);
	
	return ids;

}

function dropIndex(){
	//open_auctions
	db.open_auctions.dropIndex({
		initial:1
	})
	db.open_auctions.dropIndex({
		"bidder.increase":1
	})
	//regions
	db.regions.dropIndex({
		name:1,
		location:1
	})
	db.regions.dropIndex({
		regions:1
	})
	
	db.people.dropIndex({
		"people.interest":1
	})
	/*
	db.regions.dropIndex({
		regions:1
	})
	db.closed_auctions.dropIndex({
		"buyer.person":1
	})
	*/
}
function createIndex() {
	//open_auctions
	db.open_auctions.ensureIndex({
		initial:1
	})
	db.open_auctions.ensureIndex({
		"bidder.increase":1
	})
	//regions
	db.regions.ensureIndex({
		name:1,
		location:1
	})
	db.regions.ensureIndex({
		regions:1
	})
	//people
	db.people.ensureIndex({
		"people.interest":1
	})
	/*
	db.regions.ensureIndex({
		regions:1
	})
	db.open_auctions.ensureIndex({
		initial:1
	})
	db.closed_auctions.ensureIndex({
		"buyer.person":1
	});
	*/
}
function t() {
//db.system.profile.find().limit(1).sort({ts:-1}).pretty()
return db.system.profile.find({},{millis:1}).limit(1).sort({ts:-1}).pretty()
}
function cal(q){
 var start = new Date();
	eval(q)
return new Date() - start;
}

function allq(n) {
	for(var i=1;i<=20; i++) {
		if(i != 10){
			printjson("-------------------------------------"+"Q"+i)
			for(var j=0;j<n;j++) {
				var f = "q"+i+"();";
				printjson(cal(f));
			}
		}
		
	}
}

function single(i, n) {
	printjson("-------------------------------------"+"Q"+i)
			for(var j=0;j<n;j++) {
				var f = "q"+i+"();";
				printjson(cal(f));
		}
}
/*************test **************/


	
