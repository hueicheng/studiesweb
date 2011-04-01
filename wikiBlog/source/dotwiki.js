function show() {
  convert();
  document.getElementById("wikibox").style.display = "none";
  document.getElementById("htmlbox").style.display = "";
}
 
function edit() {
  document.getElementById("wikibox").style.display = "";
  document.getElementById("htmlbox").style.display = "none";
}
 
function save() {
}

// gi 的 g 是 global 的意思，會取代所有符合的樣式, i 是 ignore 會忽略大小寫。
function wiki2html(wikiText) {
//  alert("attachPath="+attachPath);
  init();
  var text = wikiText
    .replace(/\r/gi, "") // 刪除 \r 字元
    .replace(/\[\[image\s([^\s]+)\s+size="medium"\]\]/gi, '<center><img src='+attachPath+'/$1 width=512px/></center>') // 範例：[[image test.jpg size="medium"]]
    .replace(/\[\[image\s([^\s\]]+)[^\]]*\]\]/gi, '<img src='+attachPath+'/$1/>') // 範例：[[image test.jpg]]
    .replace(/\[(http[s]?:\/\/[^\s\]]+)\s+([^\]]*)\]/gi, '<a href=$1>$2</a>') // 範例：[http://tw.yahoo.com/ 雅虎]
    .replace(/\[(http[s]?:\/\/[^\s\]]+)\]/gi, '<a href=$1>$1</a>') // 範例：[http://tw.yahoo.com/]
    .replace(/\[\[\[([:\w-]+)\]\]\]/gi, '<a href=#!$1>$1</a>') // 範例：[[[innerLink]]]	
    .replace(/\[\[\[([:\w-]+)\s*\|\s*([^\]]*)\]\]\]/gi, '<a href=#!$1>$2</a>') // 範例：[[[innerLink | 內部連結]]]
    .replace(/[^=\">](http[s]?:\/\/[\w;\/\?:@=#&$-_.+!*\(\),]+)/gi, '<a href=$1>$1</a>') // 範例：http://tw.yahoo.com/
    .replace(/__(.+)__/gi, '<u>$1</u>') // 範例：__underline text__
    .replace(/\*\*(.+)\*\*/gi, '<b>$1</b>') // 範例：**bold text**
    .replace(/--(.+)--[^\]>]/gi, '<s>$1</s>') // 範例：--strikethrough text-- , 注意，要避開 --] 或 -->
    .replace(/[^:]\/\/(.+)\/\//gi, '<i>$1</i>') // 範例：//italic text//
    .replace(/\^\^(.+)\^\^/gi, '<sup>$1</sup>') // 範例：normal^^superscript^^
    .replace(/,,(.+),,/gi, '<sub>$1</sub>') // 範例：normal,,subscript,,
    .replace(/\[\[video\s([^\s\]]+)[^\]]*\]\]/gi,'<video src='+attachPath+'/$1 controls="controls"></video>') //範例: [[video test.mp4]]
    .replace(/\[\[audio\s([^\s\]]+)[^\]]*\]\]/gi,'<audio src='+attachPath+'/$1 controls="controls"></audio>') //範例: [[audio test.mp3]]
    ;
    
  var lines = text.replace(/\r/, '').split("\n");
  var html = "";
  for (i in lines) {
    html += convertLine(lines[i]);
    if (inCode || inList || inTitle || inComment || inTable) 
      html+="\n";
    else
      html+="<BR/>";
  }
  return html;
}
 
var levelStack = new Array();
var inList=false, inCode=false, inTitle=false, inComment=false, inTable=false;
 
function init() {
  levelStack.length = 0;
  inList=false; 
  inCode=false; 
  inTitle=false; 
  inComment=false;
  inTable=false;
}
 
function convertLine(line) {
  var toLine = line;
  toLine = convertList(toLine);
  toLine = convertTable(toLine);
  toLine = convertTitle(toLine);
  toLine = convertCode(toLine);
  toLine = convertComment(toLine);
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
  var htmlBox = document.getElementById("htmlbox"); 
  htmlBox.innerHTML = wiki2html(wikiText);
  alert(htmlBox.innerHTML);
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
