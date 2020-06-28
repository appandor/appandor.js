/*
 * Frontend Logic for application
 */

console.log('%c Usage of integrated AJAJSON (Asynchronous JavaScript and Json) and SYNAJSON (Synchronous JavaScript and Json)', 'background: #222; color: #bada55')
console.log('%c - AJAJSON (Asynchronous methods):', 'background: #222; color: #00ff55')
console.log('   - app.post(path,headers,body,callback)')
console.log('   - app.put(path,headers,body,callback)')
console.log('   - app.get(path,headers,callback)')
console.log('   - app.delete(path,headers,body,callback)')
console.log('%c - SYNAJSON (Synchronous methods):', 'background: #222; color: #baff55')
console.log('   - app.postsync(path,headers,body)')
console.log('   - app.putsync(path,headers,body)')
console.log('   - app.getsync(path,headers)')
console.log('   - app.deletesync(path,headers,body)')

// Container for frontend application
var app = {}

// Config
app.config = {
  'sessionToken' : false
}

// *******************************************************************
// * Method Functions (async)
// *******************************************************************
// POST interface
app.post = function(path,headers,body,callback){
  callback = typeof(callback) == 'function' ? callback : function(s,r) {console.log(s,r)}
  app._client.request(headers,path,'POST',undefined ,body, callback)
  return 'POST request send'
}
// PUT interface
app.put = function(path,headers,body,callback){
  callback = typeof(callback) == 'function' ? callback : function(s,r) {console.log(s,r)}
  app._client.request(headers,path,'PUT',undefined ,body, callback)
  return 'PUT request send'
}
// GET interface
app.get = function(path,headers,callback){
  callback = typeof(callback) == 'function' ? callback : function(s,r) {console.log(s,r)}
  app._client.request(headers,path,'GET',undefined,{}, callback)
  return 'GET request send'
}
// DELETE interface
app.delete = function(path,headers,body,callback){
  callback = typeof(callback) == 'function' ? callback : function(s,r) {console.log(s,r)}
  app._client.request(headers,path,'DELETE',undefined,body,callback)
  return 'DELETE request send'
}

// *******************************************************************
// * Method Functions (synchronous)
// *******************************************************************
// POST interface synchronous
app.postsync = function(path,headers,body){
  return app._client.requestsync(headers,path,'POST',undefined,body)
}
// PUT interface synchronous
app.putsync = function(path,headers,body){
  return app._client.requestsync(headers,path,'PUT',undefined,body)
}
// GET interface synchronous
app.getsync = function(path,headers){
  return app._client.requestsync(headers,path,'GET',undefined,{})
}
// DELETE interface synchronous
app.deletesync = function(path,headers,body){
  return app._client.requestsync(headers,path,'DELETE',undefined,body)
}

// *******************************************************************
// Client (for RESTful API)
// *******************************************************************
app._client = {}

// *******************************************************************
// Interface for making API calls async
// *******************************************************************
app._client.request = function(headers,path,method,queryStringObject,payload,callback){
  // Set defaults
  headers = typeof(headers) == 'object' && headers !== null ? headers : {}
  path = typeof(path) == 'string' ? path : '/'
  method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET'
  queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {}
  payload = typeof(payload) == 'object' && payload !== null ? payload : {}
  callback = typeof(callback) == 'function' ? callback : false

  // For each query string parameter sent, add it to the path
  var requestUrl = ''
  var counter = 0
  for(var queryKey in queryStringObject){
     if(queryStringObject.hasOwnProperty(queryKey)){
       counter++
       // If at least one query string parameter has already been added, preprend new ones with an ampersand
       if(counter > 1){
         requestUrl+='&'
       }
       // Add the key and value
       requestUrl+=queryKey+'='+queryStringObject[queryKey]
     }
  }
  if (counter == 0) {
    requestUrl = path
  } else {
    requestUrl = path+'?'+requestUrl
  }
  // Form the http request as a JSON type
  var xhr = new XMLHttpRequest()
  xhr.open(method, requestUrl, true)
  xhr.setRequestHeader("Content-type", "application/json")
  // For each header sent, add it to the request
  for(var headerKey in headers){
    if(headers.hasOwnProperty(headerKey)){
      xhr.setRequestHeader(headerKey, headers[headerKey])
    }
  }

  // If there is a current session token set, add that as a header
  if(app.config.sessionToken){
    xhr.setRequestHeader("token", app.config.sessionToken.id)
  }

  // When the request comes back, handle the response
  xhr.onreadystatechange = function() {
    if(xhr.readyState == XMLHttpRequest.DONE) {
      var statusCode = xhr.status
      var responseReturned = xhr.responseText
      // Callback if requested
      if(callback){
        try{
          var parsedResponse = JSON.parse(responseReturned)
          callback(statusCode,parsedResponse)
        } catch(e){
          callback(statusCode,responseReturned)
        }
      }
    }
  }
  // Send the payload as JSON
  var payloadString = JSON.stringify(payload)
  xhr.send(payloadString)
}

// *******************************************************************
// Interface for making API calls sync
// *******************************************************************
app._client.requestsync = function(headers,path,method,queryStringObject,payload){
  // Set defaults
  headers = typeof(headers) == 'object' && headers !== null ? headers : {}
  path = typeof(path) == 'string' ? path : '/'
  method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET'
  queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {}
  payload = typeof(payload) == 'object' && payload !== null ? payload : {}
  
  // For each query string parameter sent, add it to the path
  var requestUrl = ''
  var counter = 0
  for(var queryKey in queryStringObject){
     if(queryStringObject.hasOwnProperty(queryKey)){
       counter++
       // If at least one query string parameter has already been added, preprend new ones with an ampersand
       if(counter > 1){
         requestUrl+='&'
       }
       // Add the key and value
       requestUrl+=queryKey+'='+queryStringObject[queryKey]
     }
  }
  if (counter == 0) {
    requestUrl = path
  } else {
    requestUrl = path+'?'+requestUrl
  }
  // Form the http request as a JSON type
  var xhr = new XMLHttpRequest()
  xhr.open(method, requestUrl, false)
  xhr.setRequestHeader("Content-type", "application/json")
  // For each header sent, add it to the request
  for(var headerKey in headers){
    if(headers.hasOwnProperty(headerKey)){
      xhr.setRequestHeader(headerKey, headers[headerKey])
    }
  }

  // If there is a current session token set, add that as a header
  if(app.config.sessionToken){
    xhr.setRequestHeader("token", app.config.sessionToken.id)
  }

  // Send the payload as JSON
  var payloadString = JSON.stringify(payload)
  xhr.send(payloadString)
  response = {
    'status': xhr.status,
    'response': JSON.parse(xhr.responseText)
  }
  return response
}


function objectValues(obj) {
  var res = [];
  for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
          res.push(obj[i]);
      }
  }
  return res;
}
// *******************************************************************
// * Get API Entries and return html table as result 
// *******************************************************************
function getAPIEntries(route, searchText) {
  if (searchText.length == 0) {
    document.getElementById("count").innerHTML = ""
    document.getElementById("results").innerHTML = ""
  } else {
    app.get('/'+ route +'?id='+ searchText+'&like=true',undefined, function(s,r) {
      if (s == 404) {
        document.getElementById("count").innerHTML = ""
        document.getElementById("results").innerHTML = "<table><thead><tr><th>No results</th></thead></table>"
      } else {
        if (s == 200) {
          if (typeof(r[0]) == 'object') {

// *******************************************************************
// Go thru all headlines and make table thead entries */
// *******************************************************************
         var objKeys = Object.keys(r[0])
         if (objKeys) {
           console.log('KEYS:',objKeys)
            var results = '<table><thead><tr>'
            for (var col in objKeys) {
              var id = Object.keys(r[0])[col]
              console.log('HEADER', id)
              console.log(r[0][id])
              results += '<th>'+id.toUpperCase()+'</th>'
            }
            results += '</thead><tbody>'
          }

          // *******************************************************************
          // Go thru all entries and add a row in table
          // *******************************************************************
          for (var e in r) {
            results += '<tr>'
            for (var col in objKeys) {
              var id = Object.keys(r[0])[col]
              results += '<td>'+r[e][id]+'</td>'
            }
            results += '</tr>'
          }

          results += '<tbody></table>'
          document.getElementById("count").innerHTML = r.length + " items found."
          document.getElementById("results").innerHTML = results
        }      
      } else {
          document.getElementById("count").innerHTML = ""
          document.getElementById("results").innerHTML = "<table><thead><tr><th>Communication Error</th></thead></table>"
        }
      }
    })
  }
}
