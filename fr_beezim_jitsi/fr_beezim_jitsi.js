function fr_beezim_jitsi() {}

fr_beezim_jitsi.prototype = new ZmZimletBase();
fr_beezim_jitsi.prototype.constructor = fr_beezim_jitsi;

function Jitsi() {}

Jitsi = fr_beezim_jitsi;

Jitsi.prototype.init = function() {
    // zimlet init
    // editor HTML : "text/html", plain : "text/plain"
};

Jitsi.prototype.initializeToolbar = function(app, toolbar, controller, view) {
    // Add a jitsi button to the toolbar if current view is COMPOSE or APPT
    if (view.indexOf("COMPOSE") >= 0 || view.indexOf("APPT") >=0 ) {
        var buttonIndex = 9;
        var buttonArgs = {
            text: "Jitsi meet", //TODO: String should be in the properties file
            tooltip: "Create a Jitsi meet URL", //TODO: String should be in the properties file
            index: buttonIndex,
            image: "zimbraicon",
            enabled: true
        };
        var button = toolbar.createOp("JITSI", buttonArgs);
        button.addSelectionListener(new AjxListener(this, this._createJitsiURL));
    }
};

Jitsi.prototype._createJitsiURL = function() {
    var string = this._getRandomValue();
    var URL = "https://meet.jit.si/"; //TODO: String should be in the properties file
    var jitsiURL = URL + string;
    this._insertURL(jitsiURL);
};

Jitsi.prototype._getRandomValue = function() {
    return (Math.random() + 1).toString(36).slice(2);
};

Jitsi.prototype._insertURL =
function(jitsiURL) {
    var cc = appCtxt.getCurrentView();
    var currentEditorMode = cc.getComposeMode();
    if (currentEditorMode == "text/html") {
        var URL = "<a href=" + jitsiURL + " data-mce-href=" + jitsiURL + ">Click Here to join the meeting</a>"; //TODO: String should be in the properties file
    }
    else {
        var URL = jitsiURL;
    }
	var composeView = appCtxt.getCurrentView();
	var currentBodyContent = currentBodyContent = appCtxt.getCurrentView().getHtmlEditor().getContent();
	var params = {URL: URL,  currentBodyContent:currentBodyContent, composeView:composeView};
	this._doInsertURL(params, composeView);
};

Jitsi.prototype._doInsertURL =
function(params, composeView) {
    var separator = "\r\n";
    if ((this._composeMode == Dwt.HTML)) {
        separator = "</br>";
    }
    if (composeView.__internalId.indexOf("APPT") >= 0) {
        composeView.getHtmlEditor().setContent([params.currentBodyContent, separator, params.URL].join(""));
    }
    else {
        composeView._htmlEditor.setContent([params.currentBodyContent, separator, params.URL].join(""));
    }
};