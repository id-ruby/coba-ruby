(function(){var e,t,n,r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y;h=cookiePrefix+"cr_last_path",window.redirectToLastChallengePath&&(v=$.cookie(h),g="",v!=null?g="tingkat/"+v+".html":g="tingkat/01/00.html",window.location.href+=g),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),(!window.console||!console.log)&&function(){var e,t,n,r,i;r=function(){},n=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","markTimeline","table","time","timeEnd","timeStamp","trace","warn"],t=n.length,e=window.console={},i=[];while(t--)i.push(e[n[t]]=r);return i}(),o=function(){return!!window.history&&!!history.pushState},c="",l=!1,r=function(){var e,t;c="",l=!1,t=$("#js-challenge"),t!=null&&t.length>0&&(c=t.data("path"),l=t.data("answerable")),e=$("#code-prefill"),e!=null&&e.length>0&&f(e.text().trim()+"\n# Ketik jawaban di bawah ini\n");if(o())return $(".js-challenge-link").on("click",function(){return s($(this).attr("href")),!1})},m=!1,s=function(e){return $.cookie(h,c,{expires:7,path:"/"}),o()?(m||(m=!0,$(window).on("popstate",function(e){return s(window.location.href)})),$.get(e,{},function(t,n,i){var s,o,u;return u="#js-question",s=$(u),o=function(){var n;return n=$(t),s.html(n.find(u).html()),r(),history.pushState({},n.find("title").text(),e)},$.support.transition?s.transition({opacity:0,scale:.9},350,"out",function(){return o(),s.transition({opacity:1,scale:1},400,"out")}):o()})):window.location.href=e},i=function(e){return s([challengeRoot,e].join("/")+".html")},p=null,d=!1,f=function(e){return d?p.getSession().setValue(e):$("#snippet-runner-code-content").html("<pre>"+e+"</pre>")},u=function(){return d?p.getSession().getValue():$("#snippet-runner-code-content").text()},a=function(){if(window.ace)return p=ace.edit("code-editor"),p.setTheme("ace/theme/solarized_light"),p.getSession().setMode("ace/mode/ruby"),d=!0},e=$("body"),t=$("#loading-indicator"),y=$("#snippet-request-error-template").text(),n=$("#snippet-runner"),$("#snippet-request-error-template").remove(),a(),r(),$(".btn-run").on("click",function(){var e,n;return e=$("#run-output"),n=u(),t.text("Memproses..."),$.post(rubyEvalRoot+"/coba-ruby.json",{snippet:n,challenge_path:c},function(n,r,s){return l&&n.is_correct&&i(n.next_challenge_path),t.text(""),e.text(n.output)}).fail(function(n,r,i){var s;t.text(""),s=n.responseText;if(s==null||parseInt(n.status,10)>=500)s=y;return e.text(s)})})}).call(this);