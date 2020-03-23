
const express = require("express");
var app = express();
const bodyParser = require("body-parser")

var port = process.env.PORT || 80;

app.use(bodyParser.json());

app.use("/",express.static("./public"));
var intcont = [{
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

const BASE_API_URL= "/api/v1";
//GET AUTONOMOUS COMMUNITYS
app.get(BASE_API_URL+"/intcont-stats", (req,res)=>{
	res.send(JSON.stringify(intcont,null,2));
});
//POST AUTONOMOUS COMMUNITYS
app.post(BASE_API_URL+"/intcont-stats",(req,res)=>{
	var newIntcont=req.body;
	if((newIntcont=="") || (newIntcont.aut_com==null)){
		res.sendStatus(400,"BAD REQUEST(no name provided)");
		
	}else if(intcont.contains(newIntcont)){
		res.sendStatus(400,"BAD REQUEST(resource already exists)");
		
	}else{
		intcont.push(newIntcont);
		res.sendStatus(201,"CREATED");
		
	}
} );

//DELETE CONTACTS
app.delete(BASE_API_URL+"/intcont-stats", (req,res)=>{
	res.sendStatus(400,"DELETED req CONTACT");
});

//GET CONTACT/XXX //DONE
app.get(BASE_API_URL+"/intcont-stats/:aut_com", (req,res)=>{
	var community = req.params.aut_com;
	var filteredCommunitys = intcont.filter((i)=>{
		return (i.aut_com == community);
	});
	if(filteredCommunitys.length>=1){
		res.send(filteredCommunitys[0]);
	}else{
		res.sendStatus(404,"AUTONOMOUS COMMUNITY NOT FOUND");
	}
});

//POST CONTACT/XXX
app.post(BASE_API_URL+"/intcont-stats/:aut_com",(req,res)=>{
	var newIntcont=req.body;
	if((newIntcont=="") || (newIntcont.aut_com==null)){
		res.sendStatus(400,"BAD REQUIEST(no name provided)");
		
	}else{
		contacts.push(newIntcont);
		res.sendStatus(201,"CREATED");
	}
} );

//PUT CONTACT/XXX
app.put(BASE_API_URL+"/intcont-stats/:name", (req,res)=>{
	var name = req.params.name;
	res.send(JSON.stringify(name,null,2));
});

//DELETE CONTACT/XXX

app.get(BASE_API_URL+"/intcont-stats/:name", (req,res)=>{
	var name = req.params.name;
	var filteredContacts = contacts.filter((c)=>{
		return (c.name != name);
	});
	if(filteredContacts.length < contacts.length){
		res.sendStatus(200,"CONTACT DELETED");
		contacts = filteredContacts;
	}else{
		res.sendStatus(404,"CONTACT NOT FOUND FOR DELETE");
	}
	
});





app.get("/time", (req,res)=>{
	let d = new Date();
	res.send("<html>"+d+"</html>");
});

app.listen(port, ()=>{
	console.log("Server Ready");
});

console.log("Starting server...");
