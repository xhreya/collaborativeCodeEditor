const socket = io('/')

console.log(editor.getValue())

var language;
document.getElementById('editor').style.fontSize='20px';
//document.getElementById('language').selectedIndex=4;
var submit=document.getElementById('submit');
var result=document.getElementById('result');
var details=document.getElementById('details');
var inputs=document.getElementById('input');
const boilerplate={
    cpp14:"#include<bits/stdc++.h>\nusing namespace std;\nint main()\n{\n    cout<<\"hello \\n\";\n}",
    cpp17:"#include<bits/stdc++.h>\nusing namespace std;\nint main()\n{\n    cout<<\"hello \\n\";\n}",
    c:"#include <stdio.h>\n\nint main()\n{\n    printf(\"Hello World\");\n\n    return 0;\n}\n",
    java:'public class MyClass {\n' +
    '    public static void main(String args[]) {\n' +
    '      int x=10;\n' +
    '      int y=25;\n' +
    '      int z=x+y;\n' +
    '\n' +
    '      System.out.println("Sum of x+y = " + z);\n' +
    '    }\n' +
    '}',
    python:'x=10;\ny=25;\nz=x+y;\n\nprint ("sum of x+y =", z);'
}
editor.setValue(boilerplate.cpp14);

document.getElementById('language').click(function(event){
     console.log(document.getElementById('language'));
       
});



function setLanguage(language)
{

    if(language==='C++14')
    {
    
        editor.setValue(boilerplate.cpp14);
        editor.session.setMode("ace/mode/c_cpp");
        socket.emit('currentLanguage','cpp14');
    }
    else if(language==='C++17')
    {
     editor.setValue(boilerplate.cpp17);
     editor.session.setMode("ace/mode/c_cpp");
     socket.emit('currentLanguage','cpp17');
        
    }
    else if(language==='C')
    {
        editor.setValue(boilerplate.c);
        editor.session.setMode("ace/mode/objectivec");
        socket.emit('currentLanguage','c');
    
     }
    else if(language==='Java')
    {
        editor.setValue(boilerplate.java);
        editor.session.setMode("ace/mode/java");
        socket.emit('currentLanguage','java');
    
    }
    else
    {
     editor.setValue(boilerplate.python);
     editor.session.setMode("ace/mode/python");
     socket.emit('currentLanguage','python3');
    
    }
 

}

//for setting default
setLanguage('C');
setLanguage('C++14');


function languageChange(){
    language=document.getElementById('language').value;
    socket.emit('selectIndex',language);
   setLanguage(language);  
   console.log(language);
   
}
function inputChange(){
    console.log('change ho rha');
    var input=document.getElementById('input').value;
   // console.log(input);
    socket.emit('inputChange',input);
    
}

submit.addEventListener('click',function()
{
    console.log("button was clicked");
    var code=editor.getValue();
    //console.log(code);
  var text=JSON.stringify(code);
  //console.log(text);
  text=document.getElementById('input').value;
 //text=JSON.stringify(text);
 //socket.emit('codeSubmit','submit'); 
 socket.emit('submitCode',{"input":text,"code":code});
  


});

document.addEventListener("keypress", (e)=> {
    setTimeout(function() {
        transmitCode()
        inputChange()
      }, 500);
});

document.addEventListener('keyup', function(event) { 
    setTimeout(function() {
        transmitCode()
        inputChange()
      }, 500);
}) 


socket.emit('join-room',ROOM_ID)
    
socket.on('user-connected',msg=>{
        transmitCode();
        console.log("koi connect hua hai");
    })

socket.on('editor-change', code=>{
    editor.setValue(code.text);
    document.getSelection().removeAllRanges();
})
// socket.on('codeSubmit',msg=>{
//     var code=editor.getValue();
//     var text=document.getElementById('input').value;

//     socket.emit('submitCode',{"input":text,"code":code});
// })
socket.on('inputChange',input=>{
  //  console.log('socket me aaya');
        document.getElementById('input').value=input;
})

socket.on('selectIndex',language=>{
    var sel=document.getElementById('language');
    var opts = sel.options;
  for (var opt, j = 0; opt = opts[j]; j++) {
    if (opt.value == language) {
      sel.selectedIndex = j;
      setLanguage(language);
      break;
    }
  }
    
});

socket.on('codeResult',response=>{
 var content=response;
 var output=response.output;
 var statusCode=response.statusCode;
 var memory=response.memory;
 var cpuTime=response.cpuTime;

    result.textContent=output;
    details.textContent="Status Code :"+statusCode+"\nMemory :"+memory+"\nCpuTime :"+cpuTime;  
    
 console.log(response);

})

function transmitCode(){
    console.log("called")
    socket.emit('editor-change',{text : editor.getValue()})
}

