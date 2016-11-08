<%-- 
    Document   : homepage
    Created on : Jul 24, 2016, 7:36:30 PM
    Author     : derek
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Dashboard</title>

    <link rel="icon" href="http://new.metropol.co.ke/wp-content/uploads/2015/03/SMALL-PIC.png" type="image/png"/>
    <!-- ** CSS ** -->
    <!-- base library -->
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/static/ext/resources/css/ext-all.css" />

    <!-- overrides to base library -->
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/static/ext/app/ux/css/Portal.css" />

    <!-- page specific -->
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/static/ext/app/portal/sample.css" />
    <style type="text/css">
        /*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
html, body {
	font: normal 12px verdana;
	margin: 0;
	padding: 0;
	border: 0 none;
	overflow: hidden;
	height: 100%;
}

.x-panel-body p {
	margin: 5px;
}

.settings {
	background-image:
		url( "${pageContext.request.contextPath}/static/ext/app/shared/icons/fam/folder_wrench.png" )
		!important;
}

.nav {
	background-image:
		url( "${pageContext.request.contextPath}/static/ext/app/shared/icons/fam/folder_go.png" )
		!important;
}

.logout {
	background-image:
		url( "${pageContext.request.contextPath}/static/ext/app/shared/icons/logout.png" )
		!important;
}

.member1 {
	background-image:
		url( "${pageContext.request.contextPath}/static/ext/app/shared/icons/fam/folder_wrench.png" )
		!important;
}

.member {
	background-image:
		url( "${pageContext.request.contextPath}/static/ext/app/shared/icons/fam/user_suit.png" )
		!important;
}

.upload-icon {
	background:
		url('${pageContext.request.contextPath}/static/ext/app/shared/icons/fam/image_add.png')
		no-repeat 0 0 !important;
}

#fi-button-msg {
	border: 2px solid #ccc;
	padding: 5px 10px;
	background: #eee;
	margin: 5px;
	float: left;
}

.listview-filesize {
	font-style: italic !important;
}
    </style>

    <!-- ** Javascript ** -->
    <!-- ExtJS library: base/adapter -->
    <script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/adapter/ext/ext-base.js"></script>

    <!-- ExtJS library: all widgets -->
    <script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/ext-all.js"></script>

    <!-- overrides to base library -->
    <script type="text/javascript" src="${pageContext.request.contextPath}/static/fusioncharts/js/fusioncharts.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/static/fusioncharts/js/themes/fusioncharts.theme.fint.js"></script>
    <!-- extensions -->
    <script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/ux/Portal.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/ux/PortalColumn.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/ux/Portlet.js"></script>

    <!-- page specific -->
	<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/portal/sample-grid.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/shared/examples.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/configs.js"></script>
    <script type="text/javascript">
	    contextpath = "${pageContext.request.contextPath}";
	    csrf = "${_csrf.parameterName}";
	    csrfToken = "${_csrf.token}";	
    </script>
	
    <script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/portal/portal.js"></script>

</head>
<body></body>
</html>
