CodeMirror.defineMode("ruby",function(e){function t(e){var t={};for(var n=0,r=e.length;n<r;++n)t[e[n]]=!0;return t}function u(e,t,n){return n.tokenize.push(e),e(t,n)}function a(e,t){o=null;if(e.sol()&&e.match("=begin")&&e.eol())return t.tokenize.push(p),"comment";if(e.eatSpace())return null;var n=e.next(),r;if(n=="`"||n=="'"||n=='"')return u(c(n,"string",n=='"'||n=="`"),e,t);if(n=="/"&&!e.eol()&&e.peek()!=" ")return u(c(n,"string-2",!0),e,t);if(n=="%"){var i="string",a=!1;e.eat("s")?i="atom":e.eat(/[WQ]/)?(i="string",a=!0):e.eat(/[r]/)?(i="string-2",a=!0):e.eat(/[wxq]/)&&(i="string");var f=e.eat(/[^\w\s]/);return f?(s.propertyIsEnumerable(f)&&(f=s[f]),u(c(f,i,a,!0),e,t)):"operator"}if(n=="#")return e.skipToEnd(),"comment";if(n=="<"&&(r=e.match(/^<-?[\`\"\']?([a-zA-Z_?]\w*)[\`\"\']?(?:;|$)/)))return u(h(r[1]),e,t);if(n=="0")return e.eat("x")?e.eatWhile(/[\da-fA-F]/):e.eat("b")?e.eatWhile(/[01]/):e.eatWhile(/[0-7]/),"number";if(/\d/.test(n))return e.match(/^[\d_]*(?:\.[\d_]+)?(?:[eE][+\-]?[\d_]+)?/),"number";if(n=="?"){while(e.match(/^\\[CM]-/));return e.eat("\\")?e.eatWhile(/\w/):e.next(),"string"}return n==":"?e.eat("'")?u(c("'","atom",!1),e,t):e.eat('"')?u(c('"',"atom",!0),e,t):e.eat(/[\<\>]/)?(e.eat(/[\<\>]/),"atom"):e.eat(/[\+\-\*\/\&\|\:\!]/)?"atom":e.eat(/[a-zA-Z$@_]/)?(e.eatWhile(/[\w]/),e.eat(/[\?\!\=]/),"atom"):"operator":n=="@"&&e.match(/^@?[a-zA-Z_]/)?(e.eat("@"),e.eatWhile(/[\w]/),"variable-2"):n=="$"?(e.eat(/[a-zA-Z_]/)?e.eatWhile(/[\w]/):e.eat(/\d/)?e.eat(/\d/):e.next(),"variable-3"):/[a-zA-Z_]/.test(n)?(e.eatWhile(/[\w]/),e.eat(/[\?\!]/),e.eat(":")?"atom":"ident"):n!="|"||!t.varList&&t.lastTok!="{"&&t.lastTok!="do"?/[\(\)\[\]{}\\;]/.test(n)?(o=n,null):n=="-"&&e.eat(">")?"arrow":/[=+\-\/*:\.^%<>~|]/.test(n)?(e.eatWhile(/[=+\-\/*:\.^%<>~|]/),"operator"):null:(o="|",null)}function f(){var e=1;return function(t,n){if(t.peek()=="}"){e--;if(e==0)return n.tokenize.pop(),n.tokenize[n.tokenize.length-1](t,n)}else t.peek()=="{"&&e++;return a(t,n)}}function l(){var e=!1;return function(t,n){return e?(n.tokenize.pop(),n.tokenize[n.tokenize.length-1](t,n)):(e=!0,a(t,n))}}function c(e,t,n,r){return function(i,s){var o=!1,u;s.context.type==="read-quoted-paused"&&(s.context=s.context.prev,i.eat("}"));while((u=i.next())!=null){if(u==e&&(r||!o)){s.tokenize.pop();break}if(n&&u=="#"&&!o){if(i.eat("{")){e=="}"&&(s.context={prev:s.context,type:"read-quoted-paused"}),s.tokenize.push(f());break}if(/[@\$]/.test(i.peek())){s.tokenize.push(l());break}}o=!o&&u=="\\"}return t}}function h(e){return function(t,n){return t.match(e)?n.tokenize.pop():t.skipToEnd(),"string"}}function p(e,t){return e.sol()&&e.match("=end")&&e.eol()&&t.tokenize.pop(),e.skipToEnd(),"comment"}var n=t(["alias","and","BEGIN","begin","break","case","class","def","defined?","do","else","elsif","END","end","ensure","false","for","if","in","module","next","not","or","redo","rescue","retry","return","self","super","then","true","undef","unless","until","when","while","yield","nil","raise","throw","catch","fail","loop","callcc","caller","lambda","proc","public","protected","private","require","load","require_relative","extend","autoload","__END__","__FILE__","__LINE__","__dir__"]),r=t(["def","class","case","for","while","do","module","then","catch","loop","proc","begin"]),i=t(["end","until"]),s={"[":"]","{":"}","(":")"},o;return{startState:function(){return{tokenize:[a],indented:0,context:{type:"top",indented:-e.indentUnit},continuedLine:!1,lastTok:null,varList:!1}},token:function(e,t){e.sol()&&(t.indented=e.indentation());var s=t.tokenize[t.tokenize.length-1](e,t),u;if(s=="ident"){var a=e.current();s=n.propertyIsEnumerable(e.current())?"keyword":/^[A-Z]/.test(a)?"tag":t.lastTok=="def"||t.lastTok=="class"||t.varList?"def":"variable",r.propertyIsEnumerable(a)?u="indent":i.propertyIsEnumerable(a)?u="dedent":(a=="if"||a=="unless")&&e.column()==e.indentation()&&(u="indent")}if(o||s&&s!="comment")t.lastTok=a||o||s;return o=="|"&&(t.varList=!t.varList),u=="indent"||/[\(\[\{]/.test(o)?t.context={prev:t.context,type:o||s,indented:t.indented}:(u=="dedent"||/[\)\]\}]/.test(o))&&t.context.prev&&(t.context=t.context.prev),e.eol()&&(t.continuedLine=o=="\\"||s=="operator"),s},indent:function(t,n){if(t.tokenize[t.tokenize.length-1]!=a)return 0;var r=n&&n.charAt(0),i=t.context,o=i.type==s[r]||i.type=="keyword"&&/^(?:end|until|else|elsif|when|rescue)\b/.test(n);return i.indented+(o?0:e.indentUnit)+(t.continuedLine?e.indentUnit:0)},electricChars:"}de",lineComment:"#"}}),CodeMirror.defineMIME("text/x-ruby","ruby");