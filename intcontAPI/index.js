module.exports = function(app){
	console.log("Charging Module");
	const dataStore= require("nedb");
	const path = require("path");
	const dbFileName= path.join(__dirname, "intcont.db");
	const BASE_API_URL= "/api/v1"; //API BASE PATH
	const db = new dataStore({
				filename: dbFileName,
				autoload: true
	});
	
	
	/*RESOURCE
-----------------------------------------------
 INTCONT = INTERNSHIPCONTRACT-RESOURCE  
{AUTONOMOUS-COMMUNITY, YEAR, INTCONT-CCOO, INTCONT-SEPE, PUBLIC-WASTE-UNIVERSITY-EDUCATION}
-----------------------------------------------
*/

//---------------------------------------------------------------------------
	
var intcont =[{
	aut_com: "Andalucia",
	year: 2018,
	ccoo: 16096,
	sepe: 10099,
	gobesp: 234815.3
},{	
	aut_com: "Aragon",
	year: 2018,
	ccoo: 2146,
	sepe: 2146,
	gobesp: 21522.5
},{	
	aut_com: "Asturias",
	year: 2018,
	ccoo: 3219,
	sepe: 1220,
	gobesp: 14998.2
},{
	aut_com: "IslasBaleares",
	year: 2018,
	ccoo: 1073,
	sepe: 3956,
	gobesp: 6724.9
},{
	aut_com: "Canarias",
	year: 2018,
	ccoo: 4292,
	sepe: 4002,
	gobesp: 44862.9
},{
	aut_com: "Cantabria",
	year: 2018,
	ccoo: 1074,
	sepe: 720,
	gobesp: 8019.2
},{
	aut_com: "CastillaYLeon",
	year: 2018,
	ccoo: 4293,
	sepe: 3096,
	gobesp: 63102.0
},{
	aut_com: "CastillaLaMancha",
	year: 2018,
	ccoo: 3219,
	sepe: 2539,
	gobesp: 25369.4
},{
	aut_com: "Catalunya",
	year: 2018,
	ccoo: 16058,
	sepe: 12987,
	gobesp: 120108.8
},{
	aut_com: "ComunidadValenciana",
	year: 2018,
	ccoo: 11804,
	sepe: 7987,
	gobesp: 139594.3
},{
	aut_com: "Extremadura",
	year: 2018,
	ccoo: 2161,
	sepe: 973,
	gobesp: 28095.4
},{
	aut_com: "Galicia",
	year: 2018,
	ccoo: 6438,
	sepe: 3433,
	gobesp: 54186.1
},{
	aut_com: "Madrid",
	year: 2018,
	ccoo: 22535,
	sepe: 10832,
	gobesp: 155453.0
},{
	aut_com: "Murcia",
	year: 2018,
	ccoo: 3222,
	sepe: 2905,
	gobesp: 37834.6
},{
	aut_com: "Navarra",
	year: 2018,
	ccoo: 2151,
	sepe: 771,
	gobesp: 9503.5
},{
	aut_com: "PaisVasco",
	year: 2018,
	ccoo: 7511,
	sepe: 2319,
	gobesp: 29557.9
},{
	aut_com: "LaRioja",
	year: 2018,
	ccoo: 1071,
	sepe: 449,
	gobesp: 4653.0
}];

//GET INTCONT/LOADINITIALDATA
app.get(BASE_API_URL+"/intcont-stats/loadInitialData", (req,res) =>{
	db.insert(intcont);
	res.sendStatus(200);
	console.log("Initial Internship Contracts loaded:" + JSON.stringify(intcont, null, 2));
});

//GET INTCONT RESOURCE LIST
app.get(BASE_API_URL+"/intcont-stats", (req,res)=>{
	
	var q = req.query; //Registering query
	var off= q.offset;  //extracting offset from query
	var l= q.limit;  //extracting limit from query
	
	delete q.offset; //cleaning fields
	delete q.limit;
	
	console.log("NEW GET .../intcont");
	db.find({}).sort({aut_com:1}).skip(off).limit(l).exec((err, intcont)=>{
		intcont.forEach((i)=>{
			delete i._id; //borrar id
		});
		res.send(JSON.stringify(intcont,null,2));
	});
});

//GET A RESOURCE
app.get(BASE_API_URL+"/intcont-stats/:aut_com/:year", (req,res)=>{
	var params = req.params;
	var community = params.aut_com;
	var year = params.year;
	var filteredCommunitys = intcont.filter((i)=>{
		return (i.aut_com == community && i.year == year);
	});
	if(filteredCommunitys.length>=1){
		res.send(JSON.stringify(filteredCommunitys[0],null,2));
	}else{
		res.sendStatus(404,"AUTONOMOUS COMMUNITY NOT FOUND");
	}
});
	//GET ALL COMMUNITY RESOURCE
	app.get(BASE_API_URL+"/intcont-stats/:aut_com", (req,res)=>{
	var params = req.params;
	var community = params.aut_com;
	var filteredCommunitys = intcont.filter((i)=>{
		return (i.aut_com == community);
	});
	if(filteredCommunitys.length>=1){
		res.send(JSON.stringify(filteredCommunitys,null,2));
	}else{
		res.sendStatus(404,"AUTONOMOUS COMMUNITY NOT FOUND");
	}
});


//POST VS RESOURCE LIST
app.post(BASE_API_URL+"/intcont-stats",(req,res)=>{
	var newIntcont=req.body;
	var existIntcont = false;
	for(i in intcont){
		if(newIntcont.aut_com==intcont[i].aut_com && newIntcont.year==intcont[i].year){
			existIntcont = true;
			break;
		}
	}
	if((newIntcont.aut_com=="") || (newIntcont.aut_com==null) 
	  || newIntcont.year==null
	  || newIntcont.ccoo==null
	  || newIntcont.sepe==null
	  || newIntcont.gobesp==null
	  ){
		res.sendStatus(400,"BAD REQUEST(No totally DATA provided)");
		console.log("Any of fields are not provided");
	}else if(existIntcont){
		res.sendStatus(400,"BAD REQUEST(resource already exist)");
		console.log("Trying to create an existing resource");
	}else{
		db.insert(newIntcont); //pushing on db
		res.sendStatus(201,"CREATED");
		console.log("New Resource "+newIntcont.aut_com+" created")
	}
});
	
	//POST VS A RESOURCE /NOT ALLOWED
app.post(BASE_API_URL+"/intcont-stats/:aut_com/:year",(req,res)=>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});
app.post(BASE_API_URL+"/intcont-stats/:aut_com",(req,res)=>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});
	
//PUT RESOURCE LIST /NOT ALLOWED
app.put(BASE_API_URL+"/intcont-stats", (req,res)=>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});
	
//PUT RESOURCE
app.put(BASE_API_URL+"/intcont-stats/:aut_com/:year", (req,res)=>{
	var params = req.params;
	var community = params.aut_com;
	var year = params.year;
	var body = req.body;
	var updatedData = intcont.map((i)=>{
		auxUpdate = i;
		
		if(auxUpdate.aut_com == community && auxUpdate.year == year){
			for (var p in body){ // UPDATING PARAMETERS
				if(!(body.aut_com==community || body.aut_com==null || body.year==year)){ //COMMUNITY UPDATED NOT ALLOWED
					res.sendStatus(405,"ITS NOT ALLOWED TO CHANGE AUTONOMOUS COMMUNITY"); 
					break;
				}
				auxUpdate[p] = body[p];	
			}
		}
		return (auxUpdate);
	});
	
	if(auxUpdate.length==0){
		res.sendStatus(404,"RESOURCE NOT FOUND");
	}else{
		intcont = updatedData;
		res.sendStatus(200,"RESOURCE UPDATED");
	}
});
	
//PUT RESOURCE NO COMPLETE ID
app.put(BASE_API_URL+"/intcont-stats/:aut_com", (req,res)=>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});

//DELETE RESOURCE LIST
app.delete(BASE_API_URL+"/intcont-stats", (req,res)=>{
	db.remove({},{multi: true}, function(err, numRemoved){
		console.log("Deleted "+numRemoved+" resources");
	})
	res.sendStatus(200,"DELETED req CONTACT");
});

//DELETE A RESOURCE
app.delete(BASE_API_URL+"/intcont-stats/:aut_com/:year", (req,res)=>{
	var params = req.params;
	var community = params.aut_com;
	var year = params.year;
	var filteredCommunitys = intcont.filter((i)=>{
		return (i.aut_com != community && i.year != year);
	});
	if(filteredCommunitys.length < intcont.length){
		intcont = filteredCommunitys;
		res.sendStatus(200,""+community+" DELETED");
	}else{
		res.sendStatus(404,"AUTONOMOUS COMMUNITY NOT FOUND FOR DELETE");
	}
	
});
	
//DELETE BY AUTONOMOUS COMMUNITY
app.delete(BASE_API_URL+"/intcont-stats/:aut_com", (req,res)=>{
	var params = req.params;
	var community = params.aut_com;
	var filteredCommunitys = intcont.filter((i)=>{
		return (i.aut_com != community);
	});
	if(filteredCommunitys.length < intcont.length){
		intcont = filteredCommunitys;
		res.sendStatus(200,""+community+" DELETED");
	}else{
		res.sendStatus(404,"AUTONOMOUS COMMUNITY NOT FOUND FOR DELETE");
	}

});


app.get("/time", (req,res)=>{
	let d = new Date();
	res.send("<html>"+d+"</html>");
});
};