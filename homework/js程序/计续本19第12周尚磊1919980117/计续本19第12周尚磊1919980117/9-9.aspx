<%@ Page Language="C#" ContentType="text/html" ResponseEncoding="gb2312" %>
<%@ Import Namespace="System.Data" %>
<%
	Response.CacheControl = "no-cache";
	Response.AddHeader("Pragma","no-cache");
	
	if(Request["user"]=="isaac")
		Response.Write("Sorry, " + Request["user"] + " already exists.");
	else
		Response.Write(Request["user"]+" is ok.");
%>