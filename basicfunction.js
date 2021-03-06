﻿var question,optionA,optionB,answer;
var decided = true,cnt = 0,finish = false;
var MaxId = 60;
var questionHistory = new Array(MaxId) , feedback = new Array(MaxId);

function loadXMLDoc(dname){
	try{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	}
	catch(e){
		try{
			xmlDoc = document.implementation.createDocument("","",null);
		}
		catch(e){
			alert(e.message)
		}
	}
	try{
		xmlDoc.async = false;
		xmlDoc.load(dname);
		return(xmlDoc);
	}
	catch(e) {
		var xmlhr = new window.XMLHttpRequest();
		xmlhr.open("GET",dname,false);
		xmlhr.send(null);
		xmlDoc = xmlhr.responseXML.documentElement;
		return(xmlDoc);			
	}
	return(null);
}
function rand(num){
	return Math.floor(Math.random()*(num+1)-0.001);
}
function findpid(pid){
	for(var i = 0 ; i < cnt ; ++i){
		if(questionHistory[i] == pid)	return i;
	}
	return -1;
}
function getPid(){
	var pid;
	while(1){
		pid = rand(MaxId);
		if(findpid(pid) < 0){
			questionHistory[cnt] = pid;
			cnt++;
			break;
		}
	}
	return pid;	
}

function loadQuestion(pid){
	var path = "xmldata/prob" + pid + ".xml";
	var xmlDoc = loadXMLDoc(path);
	question = xmlDoc.getElementsByTagName("question")[0].childNodes[0].nodeValue;
	optionA = xmlDoc.getElementsByTagName("option")[0].childNodes[0].nodeValue;
	optionB = xmlDoc.getElementsByTagName("option")[1].childNodes[0].nodeValue;
	answer = xmlDoc.getElementsByTagName("answer")[0].childNodes[0].nodeValue;
}

function bodyOnLoad() {
	if (localStorage.getItem("questionHistory") !== null) {
		questionHistory = JSON.parse(localStorage.getItem("questionHistory"));
	}
	if (localStorage.getItem("feedback") !== null) {
		feedback = JSON.parse(localStorage.getItem("feedback"));
	}
	if (localStorage.getItem("cnt") !== null){
		cnt = JSON.parse(localStorage.getItem("cnt"));
	}
	save();
	nextQuestion();
}

function save() {
	localStorage.setItem("questionHistory", JSON.stringify(questionHistory));
	localStorage.setItem("feedback", JSON.stringify(feedback));
	localStorage.setItem("cnt", JSON.stringify(cnt));
}

function nextQuestion(){
	if(!decided){
		cnt --;
	}
	var pid = getPid();
	if(pid < 0)	return;
	loadQuestion(pid);
	// Place question
	document.getElementById("text").innerHTML = question;
	document.getElementById("optionA").innerHTML = optionA;
	document.getElementById("optionB").innerHTML = optionB;
	document.getElementById("result").innerHTML = "";
	decided = false;	
}

function A(){
	if(decided)	return;
	decided = true;		
	if(answer.indexOf('A') != -1){
		document.getElementById("result").innerHTML = "Accepted";
		document.getElementById("result").style.color = "#0000FF";
		feedback[cnt-1] = 1;
	}	
	else{
		document.getElementById("result").innerHTML = "Wrong Answer";
		document.getElementById("result").style.color = "#FF2100";
		feedback[cnt-1] = 0;
	}
	save();
	if(cnt > MaxId){
		alert("题库已爆☆ω☆");
		 var mainDoc = document.getElementById("main");
		 finish = true;
		 mainDoc.innerHTML = "<button class = \"btn-lg btn-success\" onClick=\"again()\">   再做一遍：） </button>"
		return;
	}	
}
function B(){
	if(decided)	return;
	decided = true;
	if(answer.indexOf('B') != -1){
		document.getElementById("result").innerHTML = "Accepted";
		document.getElementById("result").style.color = "#0000FF";	
		feedback[cnt-1] = 1;
	}	
	else{
		document.getElementById("result").innerHTML = "Wrong Answer";
		document.getElementById("result").style.color = "#FF2100";
		feedback[cnt-1] = 0;
	}
	save();
	if(cnt > MaxId){
		alert("题库已爆☆ω☆");
		 var mainDoc = document.getElementById("main");
		 mainDoc.innerHTML = "<button class = \"btn-lg btn-success\" onClick=\"again()\">   再做一遍：） </button>"
		return;
	}
}
function test(){
	alert("hehehehe");	
}
function again(){
	cnt = 0;
	save();
	decided = true;
	finish = false;
	loadQuizUI();
}