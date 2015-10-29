/*  Beispiel für Monitoring(docker-compose.yml)
monitor:
   - HOSTNAMEMONITORING=webservernr2
   - PORTS=SSH:22;TEST:7775;PROD:7777;jnlp:80;tomcat:8081;
   - DISPLAYNAME="Server Name"
   - MONITORING_SERVER=monitoring
   - NSCAPASS=SDFasdfasdf3adf
   - HOSTINT=linkcontainername
*/

var portsstatusarr = []; //array
var errorarr = [];
var psStatus = 0;
var services;
var hosts;

function sendstat(info){
	var monitoring = process.env.MONITORING_SERVER
	var userpwd = process.env.PWD
	
	console.log(info);
	
	var spawn = require('child_process').spawn;
	var command = 'echo "'+ info + '" | /usr/sbin/send_nsca -H ' + monitoring + ' -c '+ userpwd+'/nsca.conf -d ";"';

	var diff = spawn('/bin/bash', ['-c', command]);
	diff.stdout.on('data', function (data) {
	//console.log('stdout: ' + data);
	});

	diff.stderr.on('data', function (data) {
	console.error('stderr: ' + data);
	});	
}
//'echo '+ info + '| /usr/sbin/send_nsca -H ' + monitoring + ' -c '+ userpwd+'/nsca.conf -d ";"'
function writestat(){
	var hostname = process.env.HOSTNAMEMONITORING;
	var docker = process.env.DOCKERHOST;
	
	if (errorarr.length > 0){
		//"Hostname;Servicename;2;ERROR - Service(s) "
		services = hostname +";"+ "Monitored_Services;2;ERROR - Service(s) " + errorarr.toString() + " not responding";
	}
	else{
		services = hostname +";"+ "Monitored_Services;0;OK - All Service ok";
	}
	sendstat(services);
	
	if(portsstatusarr.length === errorarr.length){
		hosts = hostname + ";2;ERROR - Host not reachable";
	}
	else{
		hosts = hostname + ";0;OK - Everything is going to be fine";
	}
	sendstat(hosts);
}

function status(){
	for (var i = 0; i < portsstatusarr.length; i++){
		var splitports = portsstatusarr[i].split(":");
		if (splitports[1] === "nok"){
			errorarr.push(splitports[0]);
		}
	}
	writestat();
}

function portscann(desc, pnumber, host, stat) {
	var portscanner = require('portscanner');
	portscanner.checkPortStatus(pnumber, host, function(error, port){
		if (port === "open"){
			portsstatusarr.push(desc+ "(" + pnumber + "):ok");
		}
		else {
			portsstatusarr.push(desc+ "(" + pnumber + "):nok");
		}
		
		psStatus++;
		
		if (psStatus === stat){
			status();
		}
	});
}

function start(){
	var portsarr = process.env.PORTS.split(";");
	for (var i = 0; i < portsarr.length; i++){
		var servicearr = portsarr[i].split(":");
		portscann(servicearr[0], servicearr[1], process.env.HOSTINT, portsarr.length);
	}
}

start();
