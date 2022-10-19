document.getElementById("new").innerHTML="1.2.0 正式版";
x=document.getElementById("update");
  var up=x.innerHTML;
  if(up<1.2){
  document.getElementById("cut").innerHTML="有可用更新<p>1.2更新内容:<h1>1.新增代码块一键复制</h1><h1>2.更多过渡动画</h1><h1>3.优化资源请求</h1><h1>4.修复菜单栏收起后仍会挡住页面导致无法点击的bug</h1><h1>5.一些代码逻辑的小优化</h1>1.1更新内容:<h1>1.新增置顶功能</h1><h1>2.新增MathJax功能</h1><h1>3.修复Chrome地址栏主题色不同步问题</h1>我们建议您根据需要，更新或是保留原有版本";
  }
  else{
  document.getElementById("cut").innerHTML="已经是最新版本";
  }
