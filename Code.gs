

function doGet(e){
    Logger.log( Utilities.jsonStringify(e) );
  if( e.parameters.v){
   // Logger.log(e.parameters.v)
    return loadPage(e.parameters["v"]);}
else
return loadPage('index');
}

//***************************************************************************************

function loadPage(pageName){
return HtmlService.createTemplateFromFile(pageName).evaluate(); 
}
//***************************************************************************************
function getAllInvoices(){
return getWholeSheet('Invoices');
}
//***************************************************************************************
function getAllServices(){
return getWholeSheet('Services');
}
//***************************************************************************************
function getAllClients(){
return getWholeSheet('Clients');
}

//***************************************************************************************
function getAllClientsInOBJ(){
var data=getWholeSheet('Clients');
var clientsOBJ=[]; 
for(var i=0; i<data.length; i++){
clientsOBJ.push({id:data[i][0], name:data[i][1],email:data[i][2],tel:data[i][3]})
}
Logger.log(clientsOBJ[0]);
return clientsOBJ;
}
//***************************************************************************************
function getAllUsers(){
return getWholeSheet('Users');
}
//***************************************************************************************

function getWholeSheet(shName){
var sheet= SpreadsheetApp.getActive();
var sheetName=sheet.getSheetByName(shName);
var lastRow=sheetName.getLastRow();
var lastColumn=sheetName.getLastColumn();
return sheetName.getRange(2,1,lastRow,lastColumn).getValues();
}

//***************************************************************************************
function getWholeSheetWithIndex(shName,str,stc){
var sheet= SpreadsheetApp.getActive();
var sheetName=sheet.getSheetByName(shName);
var lastRow=sheetName.getLastRow();
var lastColumn=sheetName.getLastColumn();
return sheetName.getRange(str,stc,lastRow+1,lastColumn).getValues();
}
//***************************************************************************************
function getLastIdFromSheet(shName){
var sheet= SpreadsheetApp.getActive();
var sheetName=sheet.getSheetByName(shName);
var lastRow= sheetName.getLastRow();
return sheetName.getRange(lastRow, 1).getValue();
} 
//***************************************************************************************
function getRangeById(shName,id){
var data= getWholeSheet(shName);
for(var i=0; i<data.length;i++)
  if(data[i][0]==id)
   return data[i];
}


//***************************************************************************************
function getInvoiceById(id){
return getRangeById('Invoices',id);
}

//***************************************************************************************

function getServicesById(id){
return getRangeById('Services',id);
}

//***************************************************************************************

function getClientById(id){
return getRangeById('Clients',id);
}
//***************************************************************************************

function invoiceData(clientID, serviceId){

var clientObj=ClientRangeToObj(getClientById(clientID));
var servicesObject= getProductListFromInvoiceRange(getInvoiceById(serviceId)); 

return{
client:clientObj,
serviceList:servicesObject
}

}
//***************************************************************************************

function invoiceDataFull(serviceId){
var invoiceRangeData=getInvoiceById(serviceId);
var clientObj=ClientRangeToObj(getClientById(invoiceRangeData[2]));
var servicesObject= getProductListFromInvoiceRange(invoiceRangeData); 

return{
client:clientObj,
serviceList:servicesObject,
type:invoiceRangeData[4]
}

}
//***************************************************************************************

function getLastInvoiceDataFull(){
var serviceId=getLastIdFromSheet('Invoices')
var invoiceRangeData=getInvoiceById(serviceId);
var clientObj=ClientRangeToObj(getClientById(invoiceRangeData[2]));
var servicesObject= getProductListFromInvoiceRange(invoiceRangeData); 

return{
client:clientObj,
serviceList:servicesObject,
type:invoiceRangeData[4],
id:invoiceRangeData[0]
}

}
//***************************************************************************************

function test3(){

Logger.log(getLastInvoiceDataFull())
}
//***************************************************************************************

function ClientRangeToObj(ClientRange){
 return {
 id:ClientRange[0],
 name:ClientRange[1],
 email:ClientRange[2],
 tel:ClientRange[3],
 dirr:ClientRange[4],
 }
}
//***************************************************************************************

function getProductListFromInvoiceRange(invoiceRange){
Logger.log(invoiceRange)
var invoicesRange=invoiceRange[invoiceRange.length-1];
var serviceArray= invoicesRange.split(',');
var servicesObj=[]; 

for(var i=0; i<serviceArray.length; i++){
/*
Explaning....
serviceArray format: [1|200,2|400,....]
the value before the | is the product id and after is the amount
*/
var serviceRange=getServicesById(serviceArray[i].split('|')[0]);//passing the service id and returning a service range
servicesObj.push({id:serviceRange[0],name:serviceRange[1],price:serviceRange[2],amount:serviceArray[i].split('|')[1]});//creating an obj of prod for each range
}
Logger.log("The array is "+ serviceArray[0]+ "\n The string is "+ invoicesRange);
Logger.log("The obj is "+ servicesObj[0].name);

return servicesObj;
}

//***************************************************************************************

function test5(){
var invoiceRange=getInvoiceById(1);
 getProductListFromInvoiceRange(invoiceRange);
}
//***************************************************************************************
function setService(data){
setDataToSheet('Services',data);
}
//***************************************************************************************
function setCliente(data){
 setDataToSheet('Clients', data);
}
//***************************************************************************************
function setDataToSheet(shName, data){
  Logger.log("From client side"+ data[0] + " Sheet is :"+ shName);
  var sheet= SpreadsheetApp.getActive();
  var sheetName=sheet.getSheetByName(shName);
  var last_row=sheetName.getLastRow();
  var last_col=sheetName.getLastColumn();
  Logger.log("Worked til there");
  for(var _columna=2 ; _columna <last_col+1; _columna++){
    sheetName.getRange(last_row + 1, _columna).setValue(data[_columna-2]);
    Logger.log("In coloumn" + _columna + "set" +data[_columna-1]);}
 }

//************************************************************************************************

//************************************************************************************************


//************************************************************************************************

//************************************************************************************************


function signInUser (){
var users=getAllUsers();
var email=signInEmail(); 
for(var i=0; i<users.length; i++){
if(users[i][0]==email)
return users[i];
}   
return "Unknown user";  

}
//******************************************************************************************

function signInEmail(){

return Session.getActiveUser().getEmail();
}
//******************************************************************************************


//******************************************************************************************

//******************************************************************************************

function searchDataInsheet(){

  var sheet= SpreadsheetApp.getActive();
  var sheetName=sheet.getSheetByName("Users");
  var lastRow=sheetName.getLastRow();
  var data= sheetName.getRange(1,1,lastRow+1,3).getValues();
  


}


//******************************************************************************************

function valueExistInArray(array, value){

/*This function verify if a value exist in an array retun 'true' if the value exist*/

var size= array.length; 
for(var i=0; i<size; i++){
if(array[i].toString()==value.toString()){
return true;}
}
return false;
}
//**************************************************************************************

function include(filename){
/* This Function include an HTML page to another one*/
return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
//**************************************************************************************

function showHtml(fileName){
/*This function return the HTML interface of the HTML file given*/
var html = HtmlService.createTemplateFromFile(fileName)
.evaluate()
.setSandboxMode(HtmlService.SandboxMode.EMULATED);
 SpreadsheetApp.getUi().showModalDialog(html, '.');
}
//*************************************************************************************

function nuevoDatos(){
  showHtml('neuvoDatos');
}
//*************************************************************************************

function indexPage(){

var t = HtmlService.createTemplateFromFile('index');
    var html = t.evaluate().setWidth(4000);
SpreadsheetApp.getUi().showModalDialog(html, '.');
}
//*************************************************************************************

function getDatas(range, sheetName)
{Logger.log("I AM IN FRON SS");
  var sheet= SpreadsheetApp.getActive();
  var data=sheet.getSheetByName(sheetName).getRange(range).getValues();
  return data;
}
//*************************************************************************************

function makeElement(string, data){
   var element ='<'+string+'>'+data+'</'+string+'>';
  return element;

}
//*************************************************************************************

function advFilter(sheetName,range, range2, criteria,isRange ){

var sheet= SpreadsheetApp.getActive();
var sheetName=sheet.getSheetByName(sheetName);
// get all the data from the sheet 

var rawData=sheetName.getRange(range).getValues(); 
var falseData=sheetName.getRange(range2).getValues();
if(isRange=true){
var crit =sheetName.getRange(criteria).getValue();}
else if (isRange=false){var crit=criteria;}
//let us filter by criteria 
var data= [];
for (var i = 0; i< rawData.length ; i++){
if(falseData[i]== crit) {           
data.push(rawData[i]);
}
}
//Let us filter for unique value.
var result=[];
for(var i = 0; i< data.length; i++){
var status=valueExistInArray(result,  data[i])
if(status=='false'){
result.push(data[i]);}
}
// return the fully filterd list. 
return result.toString();
// Add all the data to the sheet. 
/*sheetName.getRange('J8:j50').clear();
for(var i =0 ; i <result.length; i++){
sheetName.getRange(i+8, 10 , 1, 1).setValue(result[i]);
}*/

}

//*************************************************************************************
function advFilterToSheet(result){

sheetName.getRange('J8:j50').clear();
for(var i =0 ; i <result.length; i++){
sheetName.getRange(i+8, 10 , 1, 1).setValue(result[i]);
}}

function nullo(){ /*This funcion has no real reason just call it when I need to test another fuction*/

var res=advFilter('Formulas','D8:D51','J8:j','H8');
Logger.log(res);
}

function fromHtmltosheet(range, value){
var sheet= SpreadsheetApp.getActive();
var sheetName=sheet.getSheetByName('Formulas');
sheetName.getRange(range).setValue(value);
}


//*************************************************************************************
function fillDataBase(value){

var sheet= SpreadsheetApp.getActive();
var sheetName=sheet.getSheetByName('Database');
var last_row=sheetName.getLastRow();

for(var _columna =0 ; _columna <4; _columna++){
sheetName.getRange(last_row + 1, _columna + 3, 1, 1).setValue(value[_columna]);
}

if(value[1]==sheet.getSheetByName('Formulas').getRange('B8').getValue()){
sheetName.getRange(last_row+ 1, _columna + 3, 1, 1).setValue(value[4]);

}

else{sheetName.getRange(last_row + 1, _columna + 4, 1, 1).setValue(value[4]);}
}



//************************************************************************************

function filtrar_to_dash_board(){

/*This funtion takes data from the database_sheet filter it by category and date, then add it to the dashborad.*/

// Accessing the sheets
var sheet= SpreadsheetApp.openById('1bgOYwHxysJ2qBZc7Y4piIgzbfY0dHIYyYjhWrRPXPV8');

var sheet_dashboard=sheet.getSheetByName('Dashboard');
var sheet_database=sheet.getSheetByName('Database');

// We clean the cells first.
var last_row=sheet_dashboard.getLastRow();// last row of data
sheet_dashboard.getRange(23,4,last_row,6).clear() ;// first row is 23 and 6 column

//We read the search criteria pass by the user.
var criterias=sheet_dashboard.getRange('D20:F20').getValues();

// if there is no criteria or we miss some we trow an error and close the function
for(var column=0; column<criterias[0].length;column++){
if(criterias[0][column]==""){ Logger.log("missing valuen in column  "+ column+" to complete filtrar");
return 0;
}//end of if(criterias[0][column]=="")...
}//end of for(var column=0; column<criterias[0].length;column++){

//else if all criteria were pass we run the code:->
var Criteria_start_date=criterias[0][0];
var Criteria_end_date= criterias[0][1];
var Criteria_categoria =criterias[0][2];

//Read and keep the database in a variable. 
last_row=sheet_database.getLastRow();
var raw_data=sheet_database.getRange(5,3,last_row,6).getValues();


//Filter this for the information for the given criterias
var neat_data= array_filter_categoria(raw_data, Criteria_categoria);// filer by the categoria
neat_data=array_filter_date(neat_data, Criteria_start_date, Criteria_end_date);//filter by the dates

//<--> I should turn this into a real obj[][] and write that the the sheet with set.values<-->
neat_data= to_real_obj(neat_data);


//Write the correct info back to the dashboard. 
last_row=sheet_dashboard.getLastRow();
sheet_dashboard.getRange(last_row+1,4,neat_data.length,neat_data[0].length).setValues(neat_data);

}//end of function filtrar_to_dash_board()

//*************************************************************************************


function search_in_excel(date1 , date2, categoria){

// Accessing the sheets
var sheet= SpreadsheetApp.openById('1bgOYwHxysJ2qBZc7Y4piIgzbfY0dHIYyYjhWrRPXPV8');
var sheet_database=sheet.getSheetByName('Database');

//Read and keep the database in a variable. 
last_row=sheet_database.getLastRow();
var raw_data=sheet_database.getRange(5,3,last_row,6).getValues();


//Filter this for the information for the given criterias
var neat_data= array_filter_categoria(raw_data, categoria);// filer by the categoria
neat_data=array_filter_date(neat_data, date1, date2);//filter by the dates
Logger.log( " From search_in_excel : "+ neat_data + " End of data from search_in_excel");
return neat_data; 
}


//*************************************************************************************

function filter_to_html(criteria ){
var sheet= SpreadsheetApp.openById('1bgOYwHxysJ2qBZc7Y4piIgzbfY0dHIYyYjhWrRPXPV8');
var sheet_tab=sheet.getSheetByName('Formulas');

var lastRow=sheet_tab.getLastRow(); 
var raw_data=sheet_tab.getRange(8, 4, lastRow-7, 3).getValues();


// Let us strat filtering 
var size_array= raw_data.length; 
var data_to_return = new Array(); 

for(var row =0; row<size_array; row++){

if(raw_data[row][2].toString()==criteria.toString()){// category is in position 2 
data_to_return.push(raw_data[row][0]);
}}
Logger.log(raw_data);
data_to_return=unique_value_array(data_to_return);
return data_to_return; 
Logger.log(data_to_return);
}


//*************************************************************************************

function unique_value_array(array){

var array_to_return = new Array(); 

for(var i=0; i<array.length; i++){
if(!valueExistInArray(array_to_return,array[i])){
array_to_return.push(array[i]);


}// end of if(!valueExistInArray(array_to_return,array[i]))
}// end of for(var i=0; i<array.length; i++)

return array_to_return;
}//End of function unique_value_array(array){
//*************************************************************************************




function to_real_obj(data){
/*This function removes all null row 
--->I will do that directly in the 2 previous function in a short future*/
var counter=0;
var array_to_return= new Array();

for(var row =0; row<data.length; row++){

if(data[row]!=null){
array_to_return[counter]= new Array(data[row].length);
for(var column=0; column<data[row].length; column++){
array_to_return[counter][column]=data[row][column];

}
counter++;// only when row is not null we will increment
}

}
return array_to_return;
}
//*************************************************************************************

function array_filter_date(array, start_date, end_date){
// this funtion will compare the data to the date range and return only those in the range
var size_array= array.length; 
var data_to_return = new Array(); 
// from string to date object Date so we can compare them.
var date_start= new Date(start_date);
var date_end= new Date(end_date);

for(var row=0; row <size_array; row++){
if(array[row]!=null){// is that row has information
var date_compare = new Date(array[row][0]);// we seek the date in the first column and we turn it into a date object
if(date_compare>=date_start&&date_compare<=date_end){
// if that date is in the write range we create a row in data_to_return and add the array value
data_to_return[row]=new Array(5);
for(var column=0;column<array[row].length; column++){
data_to_return[row][column]=array[row][column];
}}
}
}
return data_to_return;
}

//*************************************************************************************


function array_filter_categoria(array, value){
// if user do not want to filter by categoria we do not filter. 
if( value=="Income") value="Ingreso"; 
if(value=="Expenses") value="Egreso"; 

if(value=="Ambos"|| value=="Both"){return array;}

//else we filter:->

var size_array= array.length; 
var data_to_return = new Array(); 

for(var row =0; row<size_array; row++){

if(array[row][1].toString()==value.toString()){// category is in position 1 
data_to_return[row] = new Array(5);

for(var column=0; column <array[row].length; column++){
data_to_return[row][column]=array[row][column];
}
}
}
//Logger.log( " From array_filter_categoria : "+ data_to_return + " End of data from array_filter_categoria");
return data_to_return;
}

//*************************************************************************************

function copy_to_other_sheet(){

  var sheet= SpreadsheetApp.getActive();
  var data=sheet.getSheetByName('Dashboard').getRange('D40').getValue();
  
  var sheet2=SpreadsheetApp.openById('1ruhI9vEpChcd5faV2wspPY0RYWwLGrmNRtQb0EjKHO0');
  var data2=sheet2.getSheetByName('ab').getRange('a1').setValue(data);
}
