// include required files
var LAB = LAB || {};

// require based on: http://stackoverflow.com/questions/950087/include-javascript-file-inside-javascript-file

/*
 * helper (for javascript importing within javascript).
 */

var import_js_imported = [];

LAB.require = function(script)
{
    var found = false;
    for (var i = 0; i < import_js_imported.length; i++)
        if (import_js_imported[i] == script) {
            found = true;
            break;
        }

    if (found == false) {
        $("head").append('<script type="text/javascript" src="' + script + '"></script>');
        import_js_imported.push(script);
    }
}

// start including stuff
LAB.require("js/lab/EventDispatcher.js");
LAB.require("js/lab/BaseApp.js");