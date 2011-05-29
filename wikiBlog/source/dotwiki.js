function show() {
  convert();
  //document.getElementById("wikibox").style.display = "none"; 
  //document.getElementById("htmlbox").style.display = "";
  $("#wikibox").hide();
  $("#htmlbox").show();
}
 
function edit() {
  //document.getElementById("wikibox").style.display = "";
  //document.getElementById("htmlbox").style.display = "none";
  $("#wikibox").show();
  $("#htmlbox").hide();
}
 
function save() {
}

// gi 的 g 是 global 的意思，會取代所有符合的樣式, i 是 ignore 會忽略大小寫。
function wiki2html(wikiText) {
//  alert("attachPath="+attachPath);
  init();
  var text = wikiText
    .replace(/\r/gi, "") // 刪除 \r 字元
   // .replace(/\[\[image\s([^\s]+)\s+size="medium"\]\]/gi, '<center><img src='+attachPath+'/$1 width=512px/></center>') // 範例：[[image test.jpg size="medium"]]
   // .replace(/\[\[image\s([^\s\]]+)[^\]]*\]\]/gi, '<img src='+attachPath+'/$1/>') // 範例：[[image test.jpg]]
    .replace(/\[(http[s]?:\/\/[^\s\]]+)\]/gi, '<a href=$1>$1</a>') // 範例：[http://tw.yahoo.com/]
	.replace(/\[\*?(http[s]?:\/\/[^\s\]]+)\s(.+)\]/gi, '<a href=$1>$2</a>') // 範例：[http://tw.yahoo.com/ yahoo]
    .replace(/\[\[\[([:\w-]+)\]\]\]/gi, '<a href=#!$1>$1</a>') // 範例：[[[innerLink]]]	
    .replace(/\[\[\[([:\w-]+)\s*\|\s*([^\]]*)\]\]\]/gi, '<a href=#!$1>$2</a>') // 範例：[[[innerLink | 內部連結]]]
    .replace(/[^=\">](http[s]?:\/\/[\w;\/\?:@=#&$-_.+!*\(\),]+)/gi, '<a href=$1>$1</a>') // 範例：http://tw.yahoo.com/
    .replace(/__(.+)__/gi, '<u>$1</u>') // 範例：__underline text__
    .replace(/\*\*(.+)\*\*/gi, '<b>$1</b>') // 範例：**bold text**
    .replace(/--(.+)--[^\]>]/gi, '<s>$1</s>') // 範例：--strikethrough text-- , 注意，要避開 --] 或 -->
    .replace(/\/\/([^:]+)\/\//gi, '<i>$1</i>') // 範例：//italic text//
    .replace(/\^\^(.+)\^\^/gi, '<sup>$1</sup>') // 範例：normal^^superscript^^
    .replace(/,,(.+),,/gi, '<sub>$1</sub>') // 範例：normal,,subscript,,
	.replace(/##(.+)\|(.+)##/gi, '<span style=color:$1;>$2</span>')  //範例：##blue|hello## ##fffff|hello##
	.replace(/\[([a-z0-9_\.-]+)@([\da-z\.-]+)\s(.+)\]/gi, '<a href=mailto:$1@$2>$3</a>')  //[helloworld@gmail.com email me!!]
	.replace(/([a-z0-9_\.-]+)@([\da-z\.-]+)/gi, '<a href=mailto:$1@$2>$1@$2</a>')  //範例：helloworld@gmail.com 這個有問題...原因不明
	.replace(/\{\{(.+)\s\((.+)\)\s(.+)\}\}/gi, '<span>$1 ($2) $3</span>')  //範例：{{teletype (monospaced) text}}
	.replace(/\[\[span\sstyle\=\"(.+)\"\]\](.+)\[\[\/span\]\]/gi, '<span style=$1>$2</span>')  //[[span style="color:red"]]custom //span// element[[/span]]
	.replace(/\`\`(.+)\'\'/gi, '“$1”')  //範例：``hello''
	.replace(/\`(.+)\'/gi, '‘$1’')  //範例：`hello'
	.replace(/\,\,(.+)\'\'/gi, '„$1”')  //範例：,,hello''
	.replace(/\<\<(.+)\>\>/gi, '«$1»')  //範例：<<hello>>
	.replace(/\>\>(.+)\<\</gi, '»$1«')  //範例：>>hello<<
	.replace(/(.+)\.\.\./gi, '$1…')  //範例：dots...
	.replace(/\-\-/gi, '─')  //範例： em -- dash
	.replace(/\[wikipedia:([a-z]+):(.+)\s(.+)\]/gi, '<a href=http://en.wikipedia.org/wiki/$1:$2>$3</a>')  //範例：[wikipedia:it:Albert_Einstein Albert]
	.replace(/\[wikipedia:([a-z]+):(.+)\]/gi, '<a href=http://en.wikipedia.org/wiki/$1:$2>$2</a>')  //範例：[wikipedia:it:Albert_Einstein]
	.replace(/\[wikipedia:(.+)\s(.+)\]/gi, '<a href=http://en.wikipedia.org/wiki/$1>$2</a>')  //範例：[wikipedia:Albert_Einstein Albert]
	.replace(/\[wikipedia:(.+)\]/gi, '<a href=http://en.wikipedia.org/wiki/$1>$1</a>')  //範例：[wikipedia:Albert_Einstein]
	.replace(/\[\[size(.+)\]\](.+)\[\[\/size\]\]/gi, '<span style="font-size:$1">$2</span>')  //範例：[[size smaller]]smaller text[[/size]]
	.replace(/\[\[\$\s(.+)*\s\$\]\]/gi, '<img src="http://chart.apis.google.com/chart?cht=tx&chl=$1" />')//範例：數學表達式 尚有莫名錯誤..
	.replace(/\[\[math label1\]\]\n\r(.+)*\n\r\[\[\/math label1\]\]/gi,'<img src="http://chart.apis.google.com/chart?cht=tx&chl=$1" />')
	.replace(/:\s(.+)\s:\s(.+)/gi, '<dt>$1<dd>$2</dd></dt>')
	.replace(/\[\[note\]\](.+)\[\[\/note\]\]/gi, '<pre>$1</pre>')  //範例  [[note]]hello world[[/note]]
	.replace(/\[\[html\]\](.+)\[\[\/html\]\]/gi, '$1')  //範例[[html]]<p>hello</p>[[/html]]
	//.replace(/\@\@(.+)\@\@/gi, '@@$1@@')  //範例：@@hello //world// **bye**@@
   // .replace(/\[\[video\s([^\s\]]+)[^\]]*\]\]/gi,'<video src='+attachPath+'/$1 controls="controls"></video>') //範例: [[video test.mp4]]
   // .replace(/\[\[audio\s([^\s\]]+)[^\]]*\]\]/gi,'<audio src='+attachPath+'/$1 controls="controls"></audio>') //範例: [[audio test.mp3]]
   
    
  var lines = text.replace(/\r/, '').split("\n");
  var html = "";
  for (i in lines) {
    html += convertLine(lines[i]);
    if (inCode || inList || inTitle || inComment || inTable || inTabs) 
      html+="\n";
    else
      html+="<br />";
  }
  return html;
}
var temp = 0;
var levelStack = new Array();
var tabStack = new Array();
var inList=false, inCode=false, inTitle=false, inComment=false, inTable=false, inTabs=false;
function init() {
  levelStack.length = 0;
  tabStack.lengt = 0;
  inList=false; 
  inCode=false; 
  inTitle=false; 
  inComment=false;
  inTable=false;
  inTabs=false;
}
 
function convertLine(line) {
  var toLine = line;
  toLine = convertList(toLine);
  toLine = convertTable(toLine);
  toLine = convertTitle(toLine);
  toLine = convertCode(toLine);
  toLine = convertComment(toLine);
  toLine = convertTabs(toLine);
  return toLine;
}
 
function convertList(line) {
  var html = "";
  inList = true;
  if (line.match(/^(\s*)([#\*])\s(.*)$/i)) {
    var empty = RegExp.$1;
    var mark = RegExp.$2;
    var item = RegExp.$3;
    var level = empty.length + 1;
    if (level > levelStack.length) {
      while (level > levelStack.length) {
        levelStack.push(mark);
        html += (mark=="#")?"<ol>":"<ul>";
      }
    }
    else if (level == levelStack.length)
      html = "";
    else if (level < levelStack.length) {
      while (level < levelStack.length) {
        var popMark = levelStack.pop();
        html += (popMark=="#")?"</ol>":"</ul>";
      }
    }
    return html + line.replace(/^(\s*)([#\*])\s(.*)$/i, "<li>$3</li>");
  }
  else if (levelStack.length > 0) {
    while (levelStack.length > 0) {
      var popMark = levelStack.pop();
      html += (popMark=="#")?"</ol>":"</ul>";
    }
  }
  else 
  {
    html = line;
    inList = false;
  }
  return html;
}
 
function convertTitle(line) {
  inTitle = true;
  if (line.match(/^\+{6}\s(.*)$/i))
    return line.replace(/^\+{6}\s(.*)$/i, "<h6>$1</h6>");
  else if (line.match(/^\+{5}\s(.*)$/i))
    return line.replace(/^\+{5}\s(.*)$/i, "<h5>$1</h5>");
  else if (line.match(/^\+{4}\s(.*)$/i))
    return line.replace(/^\+{4}\s(.*)$/i, "<h4>$1</h4>");
  else if (line.match(/^\+{3}\s(.*)$/i))
    return line.replace(/^\+{3}\s(.*)$/i, "<h3>$1</h3>");
  else if (line.match(/^\+{2}\s(.*)$/i))
    return line.replace(/^\+{2}\s(.*)$/i, "<h2>$1</h2>");
  else if (line.match(/^\+{1}\s(.*)$/i))
    return line.replace(/^\+{1}\s(.*)$/i, "<h1>$1</h1>");
  else 
  {
    inTitle = false;
    return line;
  }
}
 
function convertTable(line) {
  var toLine = "";
  if (line.match(/^\|\|(.*)\|\|\s*$/)) {
    var list = RegExp.$1.split("\|\|");
    if (!inTable) {
      toLine += '<table border="1">';
      inTable = true;
    }
    toLine += "<tr><td>"+list.join("</td><td>")+"</td></tr>";
  }
  else {
    if (inTable) {
      toLine += "</table>";
      inTable = false;
    }
    toLine += line;
  }
  return toLine;
}
 
function convertCode(line) {
  if (line.match(/^\[\[code(\s(.*))?\]\]\s*$/i)) {
    inCode = true;
    return line.replace(/^\[\[code(\s(.*))?\]\]\s*$/i, "<pre $1>");
  }
  else if (line.match(/^\[\[\/code\]\]\s*$/i)) {
    inCode = false;
    return line.replace(/^\[\[\/code\]\]\s*$/i, "</pre>");
  }
  else
    return line;
}
 
function convertComment(line) {
  if (line.match(/\[!--/i)) {
    inComment = true;
    return line.replace(/\[!--/i, "<!--");
  }
  else if (line.match(/--]/i)) {
    inComment = false;
    return line.replace(/--]/i, "-->");
  }
  else
    return line;
}
 
function convert() {
  var wikiText = document.getElementById("wikibox").value;
  //var htmlBox = document.getElementById("htmlbox"); 
  //htmlBox.innerHTML = wiki2html(wikiText);
  
  $('#htmlbox').html(wiki2html(wikiText));
  
	//alert(htmlBox.innerHTML);
}

function getParam(tag) {
  var eurl = location.href + "&";
  var pattern = "[\\s\\?]"+tag+"=(.*)&";
  var regex = new RegExp(pattern, "gi");
  if (regex.exec(eurl)) {
    return RegExp.$1;
  }
  else
    return "";
}

function convertTabs(line){
	var html = "";
	//inTabs = true;
	return line;
}
