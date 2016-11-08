<%@ page import="java.io.*,java.util.*, javax.servlet.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>SMECAA - SME Credit Access Application</title>

<!-- ** CSS ** -->
<!-- base library -->
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/static/ext/resources/css/ext-all.css" />
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/static/ext/app/shared/fileuploadfield.css" />
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/static/ext/resources/css/menu.css" />
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/static/ext/app/shared/examples.css" />
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/static/ext/app/shared/icons/silk.css" />
<link rel="icon" href="http://new.metropol.co.ke/wp-content/uploads/2015/03/SMALL-PIC.png" type="image/png"/>

<link rel="stylesheet"
	href="${pageContext.request.contextPath}/static/ext/app/ux/treegrid/treegrid.css" />
<!-- ** Javascript ** -->
<!-- ExtJS library: base/adapter -->
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/adapter/ext/ext-base.js"></script>


<!-- ExtJS library: all widgets -->
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/ext-all.js"></script>

<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/ux/treegrid/TreeGridSorter.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/ux/treegrid/TreeGridColumnResizer.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/ux/treegrid/TreeGridNodeUI.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/ux/treegrid/TreeGridLoader.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/ux/treegrid/TreeGridColumns.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/ux/treegrid/TreeGrid.js"></script>


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
.leafIcon {
	background-image:
		url( "${pageContext.request.contextPath}/static/images/application-form-add-icon.png" )
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
<!-- overrides to base library -->
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/static/ext/app/ux/css/CenterLayout.css" />
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/static/ext/app/functions/RowEditor.css" />
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/static/ext/app/functions/grid-examples.css" />

<script type="text/javascript">
	contextpath = "${pageContext.request.contextPath}";
	csrf = "${_csrf.parameterName}";
	csrfToken = "${_csrf.token}";
</script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/static/ext/app/configs.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/static/ext/extensions/require.js"></script>
	


<!-- page specific -->
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/static/ext/app/finance-main/layout-browser.css"/>



<script type="text/javascript"
	src="${pageContext.request.contextPath}/static/ext/extensions/FileUploadField.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/ux/TabCloseMenu.js"></script>

<!-- overrides to base library -->
<script type="text/javascript"
	src="${pageContext.request.contextPath}/static/ext/app/member_form.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/static/ext/app/functions/RowEditor.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/static/ext/app/functions/gen-names.js"></script>
	
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/students-register.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/voteheads.js"></script>
<!-- extensions -->
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/ux/CenterLayout.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/ux/RowLayout.js"></script>

<!-- page specific -->
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/basic.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/custom.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/combination.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layout-browser.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/set-up.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/chart-of-accounts.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/customer-supplier.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/banks-currency-setup.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/industry-code.js"></script>

<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/line-of-business.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/shareholding-type.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/transaction-type.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/position-in-entity.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/directors.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/identity-type.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/store.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/stock-item.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/pay-modes.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/purchases.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/sales.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/accessibility-types.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/unit-of-issue.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/supplier-types.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/asset-type.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/customer-type.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/lease-type.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/assets.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/sme-entity.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/stock-ledger.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/receipts.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/payments.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/stock-transfer.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/accounts-framework.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/modules-manager.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/bank-transaction.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/accounting-periods.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/tax-types.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/ext/app/finance-main/layouts/help.js"></script>
<style type="text/css">
.x-grid3 .x-window-ml {
	padding-left: 0;
}

.x-grid3 .x-window-mr {
	padding-right: 0;
}

.x-grid3 .x-window-tl {
	padding-left: 0;
}

.x-grid3 .x-window-tr {
	padding-right: 0;
}

.x-grid3 .x-window-tc .x-window-header {
	height: 3px;
	padding: 0;
	overflow: hidden;
}

.x-grid3 .x-window-mc {
	border-width: 0;
	background: #cdd9e8;
}

.x-grid3 .x-window-bl {
	padding-left: 0;
}

.x-grid3 .x-window-br {
	padding-right: 0;
}

.x-grid3 .x-panel-btns {
	padding: 0;
}

.x-grid3 .x-panel-btns td.x-toolbar-cell {
	padding: 3px 3px 0;
}

.x-box-inner {
	zoom: 1;
}

.icon-user-add {
	background-image: url(${pageContext.request.contextPath}/static/ext/app/shared/icons/fam/user_add.gif) !important;
}

.icon-user-delete {
	background-image: url(${pageContext.request.contextPath}/static/ext/app/shared/icons/fam/user_delete.gif) !important;
}

/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
.ext-ie .x-row-editor .x-form-text {
	margin: 0 !important;
}

.x-row-editor-header {
	height: 2px;
	overflow: hidden;
	background: transparent
		url(${pageContext.request.contextPath}/static/ext/app/ux/images/row-editor-bg.gif)
		repeat-x 0 0;
}

.x-row-editor-footer {
	height: 2px;
	overflow: hidden;
	background: transparent
		url(${pageContext.request.contextPath}/static/ext/app/ux/images/row-editor-bg.gif)
		repeat-x 0 -2px;
}

.ext-ie .x-row-editor-footer {
	margin-top: -1px;
}

.x-row-editor-body {
	overflow: hidden;
	zoom: 1;
	background: #ebf2fb;
	padding-top: 2px;
}

.x-row-editor .x-btns {
	position: absolute;
	top: 28px;
	left: 20px;
	padding-left: 5px;
	background: transparent
		url(${pageContext.request.contextPath}/static/ext/app/ux/images/row-editor-btns.gif)
		no-repeat 0 0;
}

.x-row-editor .x-btns .x-plain-bwrap {
	padding-right: 5px;
	background: transparent
		url(${pageContext.request.contextPath}/static/ext/app/ux/images/row-editor-btns.gif)
		no-repeat right -31px;
}

.x-row-editor .x-btns .x-plain-body {
	background: transparent
		url(${pageContext.request.contextPath}/static/ext/app/ux/images/row-editor-btns.gif)
		repeat-x 0 -62px;
	height: 31px;
}

.x-row-editor .x-btns .x-table-layout-cell {
	padding: 3px;
}

/* Fixes for IE6/7 trigger fields */
.ext-ie6 .x-row-editor .x-form-field-wrap .x-form-trigger, .ext-ie7 .x-row-editor .x-form-field-wrap .x-form-trigger
	{
	top: 1px;
}

.ext-ie6 .x-row-editor .x-form-field-trigger-wrap, .ext-ie7 .x-row-editor .x-form-field-trigger-wrap
	{
	margin-top: -1px;
}

.errorTip .x-tip-body ul {
	list-style-type: disc;
	margin-left: 15px;
}
</style>

</head>
<body>
	<div id="header"></div>
	<div style="display: none;">

		<!-- Start page content -->
		<div id="start-div">
			<div style="display: table;margin: 0 auto;">
				<img src="${pageContext.request.contextPath}/static/images/sme.png" />
			</div>
			
		</div>

		<!-- Basic layouts -->
		<div id="absolute-details">
			<h2>Students Register</h2>
			<p>This functionality will enable you add students to the system.
				There are 2 ways provided to achieve this.</p>
			<p>
				<b>Tasks:</b>
			</p>
			<pre>
				<code>
1. Add a Student
   This enables you to add one 
   student at a time.
2. Upload Students
   This will enable you add 
   students as a batch 
   using a template, basically 
   MS Excel file. 
   This makes it easier and 
   convenient for start up. 
            </code>
			</pre>
		</div>
		<div id="accordion-details">
			<h2>Voteheads</h2>
			<p>This functionality enables you to </p>
			<p>
				<b>Tasks:</b>
			</p>
			<pre>
				<code>
1. Add Votehead
2. Delete Votehead
            </code>
			</pre>
			<p>All added voteheads in the form can be viewed in the grid below.</p>
			
			<p>
				
			</p>
		</div>
		<div id="anchor-details">
			<h2>Ext.layout.AnchorLayout</h2>
			<p>Provides anchoring of contained items to the container's
				edges. This type of layout is most commonly seen within FormPanels
				(or any container with a FormLayout) where fields are sized relative
				to the container without hard-coding their dimensions.</p>
			<p>In this example, panels are anchored for example purposes so
				that you can easily see the effect. If you resize the browser
				window, the anchored panels will automatically resize to maintain
				the same relative dimensions.</p>
			<p>
				<b>Sample Config:</b>
			</p>
			<pre>
				<code>
layout: 'anchor',
items: [{
    title: 'Panel 1',
    height: 100,
    anchor: '50%'
},{
    title: 'Panel 2',
    height: 100,
    anchor: '-100'
},{
    title: 'Panel 3',
    anchor: '-10, -262'
}]
            </code>
			</pre>
			<p>
				<a
					href="http://extjs.com/deploy/dev/docs/?class=Ext.layout.AnchorLayout"
					target="_blank">API Reference</a>
			</p>
		</div>
		<div id="border-details">
			<h2>Ext.layout.BorderLayout</h2>
			<p>This Layout Browser page is already a border layout, and this
				example shows a separate border layout nested within a region of the
				page's border layout. Border layouts can be nested with just about
				any level of complexity that you might need.</p>
			<p>
				Every border layout <b>must</b> at least have a center region. All
				other regions are optional.
			</p>
			<p>
				<b>Sample Config:</b>
			</p>
			<pre>
				<code>
layout:'border',
defaults: {
    collapsible: true,
    split: true,
    bodyStyle: 'padding:15px'
},
items: [{
    title: 'Footer',
    region: 'south',
    height: 150,
    minSize: 75,
    maxSize: 250,
    cmargins: '5 0 0 0'
},{
    title: 'Navigation',
    region:'west',
    margins: '5 0 0 0',
    cmargins: '5 5 0 0',
    width: 175,
    minSize: 100,
    maxSize: 250
},{
    title: 'Main Content',
    collapsible: false,
    region:'center',
    margins: '5 0 0 0'
}]
            </code>
			</pre>
			<p>
				<a
					href="http://extjs.com/deploy/dev/docs/?class=Ext.layout.BorderLayout"
					target="_blank">API Reference</a>
			</p>
		</div>
		<div id="card-tabs-details">
			<h2>Ext.layout.CardLayout (TabPanel)</h2>
			<p>The TabPanel component is an excellent example of a
				sophisticated card layout. Each tab is just a panel managed by the
				card layout such that only one is visible at a time. In this case,
				configuration is simple since we aren't actually building a card
				layout from scratch. Don't forget to set the activeItem config in
				order to default to the tab that should display first.</p>
			<p>
				<b>Sample Config:</b>
			</p>
			<pre>
				<code>
xtype: 'tabpanel',
activeTab: 0, // index or id
items:[{
    title: 'Tab 1',
    html: 'This is tab 1 content.'
},{
    title: 'Tab 2',
    html: 'This is tab 2 content.'
},{
    title: 'Tab 3',
    html: 'This is tab 3 content.'
}]
            </code>
			</pre>
			<p>
				<a
					href="http://extjs.com/deploy/dev/docs/?class=Ext.layout.CardLayout"
					target="_blank">CardLayout API Reference</a>
			</p>
			<p>
				<a href="http://extjs.com/deploy/dev/docs/?class=Ext.TabPanel"
					target="_blank">TabPanel API Reference</a>
			</p>
		</div>
		<div id="card-wizard-details">
			<h2>Ext.layout.CardLayout (Wizard)</h2>
			<p>You can use a CardLayout to create your own custom
				wizard-style screen. The layout is a standard CardLayout with a
				Toolbar at the bottom, and the developer must supply the navigation
				function that implements the wizard's business logic (see the code
				in basic.js for details).</p>
			<p>
				<b>Sample Config:</b>
			</p>
			<pre>
				<code>
layout:'card',
activeItem: 0, // index or id
bbar: ['->', {
    id: 'card-prev',
    text: '&amp;laquo; Previous'
},{
    id: 'card-next',
    text: 'Next &amp;raquo;'
}],
items: [{
    id: 'card-0',
    html: 'Step 1'
},{
    id: 'card-1',
    html: 'Step 2'
},{
    id: 'card-2',
    html: 'Step 3'
}]
            </code>
			</pre>
			<p>
				<a
					href="http://extjs.com/deploy/dev/docs/?class=Ext.layout.CardLayout"
					target="_blank">API Reference</a>
			</p>
		</div>
		<div id="column-details">
			<h2>Ext.layout.ColumnLayout</h2>
			<p>
				This is a useful layout style when you need multiple columns that
				can have varying content height. Any fixed-width column widths are
				calculated first, then any percentage-width columns specified using
				the
				<tt>columnWidth</tt>
				config will be calculated based on remaining container width.
				Percentages should add up to 1 (100%) in order to fill the
				container.
			</p>
			<p>
				<b>Sample Config:</b>
			</p>
			<pre>
				<code>
layout:'column',
items: [{
    title: 'Width = 25%',
    columnWidth: .25,
    html: 'Content'
},{
    title: 'Width = 75%',
    columnWidth: .75,
    html: 'Content'
},{
    title: 'Width = 250px',
    width: 250,
    html: 'Content'
}]
            </code>
			</pre>
			<p>
				<a
					href="http://extjs.com/deploy/dev/docs/?class=Ext.layout.ColumnLayout"
					target="_blank">API Reference</a>
			</p>
		</div>
		<div id="fit-details">
			<h2>Ext.layout.FitLayout</h2>
			<p>A very simple layout that simply fills the container with a
				single panel. This is usually the best default layout choice when
				you have no other specific layout requirements.</p>
			<p>
				<b>Sample Config:</b>
			</p>
			<pre>
				<code>
layout:'fit',
items: {
    title: 'Fit Panel',
    html: 'Content',
    border: false
}
            </code>
			</pre>
			<p>
				<a
					href="http://extjs.com/deploy/dev/docs/?class=Ext.layout.FitLayout"
					target="_blank">API Reference</a>
			</p>
		</div>
		<div id="form-details">
			<h2>Ext.layout.FormLayout</h2>
			<p>FormLayout has specific logic to deal with form fields,
				labels, etc. While you can use a FormLayout in a standard panel, you
				will normally want to use a FormPanel directly in order to get
				form-specific functionality like validation, submission, etc.
				FormPanels use a FormLayout internally so the layout config is not
				needed (and the layout may not render correctly if overridden).</p>
			<p>
				<b>Sample Config:</b>
			</p>
			<pre>
				<code>
xtype: 'form', // FormPanel
labelWidth: 75,
width: 350,
defaultType: 'textfield',
items: [{
        fieldLabel: 'First Name',
        name: 'first',
        allowBlank:false
    },{
        fieldLabel: 'Last Name',
        name: 'last'
    },{
        fieldLabel: 'Company',
        name: 'company'
    },{
        fieldLabel: 'Email',
        name: 'email',
        vtype:'email'
    }
],
buttons: [
    {text: 'Save'},
    {text: 'Cancel'}
]
            </code>
			</pre>
			<p>
				<a
					href="http://extjs.com/deploy/dev/docs/?class=Ext.layout.FormLayout"
					target="_blank">API Reference</a>
			</p>
		</div>
                <div id="site-details">
                    <h2>Site Interface</h2>
                </div>
                 <div id="branch-details">
                    <h2>Branch Interface</h2>
                </div>
		<div id="table-details">
			<h2>Ext.layout.TableLayout</h2>
			<p>Outputs a standard HTML table as the layout container. This is
				sometimes useful for complex layouts where cell spanning is
				required, or when you want to allow the contents to flow naturally
				based on standard browser table layout rules.</p>
			<p>
				<b>Sample Config:</b>
			</p>
			<pre>
				<code>
layout:'table',
layoutConfig: {
    columns: 3
},
items: [
    {html:'1,1',rowspan:3},
    {html:'1,2'},
    {html:'1,3'},
    {html:'2,2',colspan:2},
    {html:'3,2'},
    {html:'3,3'}
]
            </code>
			</pre>
			<p>
				<a
					href="http://extjs.com/deploy/dev/docs/?class=Ext.layout.TableLayout"
					target="_blank">API Reference</a>
			</p>
		</div>

		<div id="setup-center-details">
			<h2>Set Up</h2>
			
		</div>

		<div id="hbox-details">
			<h2>Ext.layout.HBoxLayout</h2>
			<p>A layout that allows for the vertical and horizontal
				stretching of child items, much like the column layout but can
				stretch items vertically.</p>
			<p>
				<b>Sample Config:</b>
			</p>
			<pre>
				<code>
layout:'hbox',
layoutConfig: {
    align : 'stretch',
    pack  : 'start',
},
items: [
    {html:'panel 1', flex:1},
    {html:'panel 2', width:150},
    {html:'panel 3', flex:2}
]
            </code>
			</pre>
			<p>
				<a
					href="http://extjs.com/deploy/dev/docs/?class=Ext.layout.HBoxLayout"
					target="_blank">API Reference</a>
			</p>
		</div>


		<!-- Custom layouts -->
		<div id="row-details">
			<h2>Payroll Register</h2>
			<p>
				This is the payroll list that provides key functions such as:
				
			</p>
			<p>
				<b>Tasks:</b>
			</p>
			<pre>
				<code>
1. Add Staff
2. List Staff
3. Pay Staff
4. Check Arrears
            </code>
			</pre>
		</div>
		<div id="center-details">
			<h2>Cashbook &amp; Trial Balance</h2>
			<p>
				The cashbook enables you to record both payments and receipts on a day to day basis.
				Cashbooks can be added for different bank accounts but each cashbook ties to only one bank account and vice-versa.
			</p>
			<p>
				<b>Tasks:</b>
			</p>
			<pre>
				<code>
1. Add cashbook
2. Add Banks
3. Add Creditors
4. Add Debtors
5. Add &amp; View Transactions
6. View Trial Balance
            </code>
			</pre>
		</div>


		<!-- Combination layouts -->
		<div id="tabs-nested-layouts-details">
			<h2>SME Details</h2>
			<p>This form enables the user to create entity, modify entity and enable or disable entity.</p>
		
		</div>
                <div id="manage-users-center-details">
			<h2>Manage Users</h2>
			<p>This panel enables the user to add, modify, assign roles, reset passwords, enable and disable users.</p>
		
		</div>
		<div id="complex-details">
			<h2>Complex Layout</h2>
			<p></p>
		</div>
                <div id="bank-currency-details">
			<h2>Bank &amp; Currency Setup</h2>
			<p></p>
		</div>
                
                <div id ="chart-of-accounts-details">
                    
                    <h2>Chart of Accounts</h2>
                </div>
                
                <div id ="accountstransactions-details">
                    
                    <h2>Chart of Accounts</h2>
                </div>
                
                <div id ="industry-code-grid-details">
                    
                    <h2>Industry Codes</h2>
                </div>
                
                <div id ="shareholdingtype-grid-details">
                    
                    <h2>Shareholding Type</h2>
                </div>

		<!-- Form layouts -->
		<div id="abs-form-details">
			<h2>Tax Setting</h2>
			<p>This provides for setting of tax as a percentage and other charges as amounts: NHIF, NSSF, et cetera.</p>
		</div>
                
                <div id="lineofbusiness-grid-details">
			<h2>Line of Business</h2>
		</div>
                <div id="transactiontype-grid-details">
			<h2>Transaction Type</h2>
		</div>
                
                <div id="positioninentity-grid-details">
			<h2>Position in Entity</h2>
		</div>
                
                <div id="customer-supplier-details">
			<h2>Customer | Supplier Register</h2>
		</div>
                <div id="directors-grid-details">
			<h2>Directors</h2>
		</div>
                <div id="identitytypes-grid-details">
			<h2>Identity Types</h2>
		</div>
                <div id="stores-grid-details">
			<h2>Stores</h2>
		</div>
                <div id='stockitems-grid-details'>
			<h2>Stock</h2>
		</div>
                <div id='paymodes-grid-details'>
			<h2>Payment Modes</h2>
		</div>
                <div id='purchases-grid-details'>
			<h2>Purchases</h2>
		</div>
                <div id='sales-grid-details'>
			<h2>Sales</h2>
		</div>
                <div id='accessibilitytypes-grid-details'>
			<h2>Accessibility Types</h2>
		</div>
                <div id='uoi-grid-details'>
			<h2>Unit of Issue</h2>
		</div>
                <div id='suppliertypes-grid-details'>
			<h2>Supplier Types</h2>
		</div>
                <div id='assettypes-grid-details'>
			<h2>Asset Types</h2>
		</div>
                <div id='asset-grid-details'>
			<h2>Asset</h2>
		</div>
                <div id='customertypes-grid-details'>
			<h2>Asset Types</h2>
		</div>
                <div id='leasetypes-grid-details'>
			<h2>Lease Types</h2>
		</div>
                <div id='stockledgers-grid-details'>
			<h2>Stock Ledgers List</h2>
		</div>
                <div id='receipts-grid-details'>
			<h2>Receipts</h2>
		</div>
                 <div id='payments-grid-details'>
			<h2>Payments</h2>
		</div>
                <div id='transfers-grid-details'>
			<h2>Stock Transfer</h2>
		</div>
                <div id='accountsframework-grid-details'>
			<h2>Chart of Accounts</h2>
		</div>
                <div id='modules-manager-details'>
			<h2>Modules Manager</h2>
		</div>
                <div id='financialtransactions-grid-details'>
			<h2>Financial Transactions</h2>
		</div>
                <div id='ap-grid-details'>
			<h2>Accounting Periods</h2>
		</div>
                
                <div id='tax-grid-details'>
			<h2>Tax Types</h2>
		</div>
                <div id='help-details'>
			<h2>User Guide</h2>
		</div>
	</div>
</body>
</html>
