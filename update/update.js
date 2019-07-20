document.getElementById("new").innerHTML="1.1.0 正式版";
x=document.getElementById("update");
  var up=x.innerHTML;
  if(up<1.1){
  document.getElementById("cut").innerHTML="<span style="color:#009688">➩</span>有新更新可用<p>更新内容:<h1>1.新增置顶功能</h1><h1>2.新增MathJax功能</h1><h1>3.新增Dashboard</h1>我们建议您根据需要，更新或是保留原有版本";
  }
  else{
  document.getElementById("cut").innerHTML="已经是最新版本";
  }
