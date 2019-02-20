document.getElementById("new").innerHTML="1.1.0 Beta";
x=document.getElementById("update");
  var up=x.innerHTML;
  if(up<1.1){
  document.getElementById("cut").innerHTML="有新更新可用<p>更新内容:<h1>新增置顶功能</h1>我们建议您根据需要，更新或是保留原有版本";
  }
  else{
  document.getElementById("cut").innerHTML="已经是最新版本";
  }
