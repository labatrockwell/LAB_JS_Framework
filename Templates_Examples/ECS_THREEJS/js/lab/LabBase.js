// include required files
var lab = lab || {};


// AWESOME INCLUDE STUFF SHAMELESSLY STOLEN FROM TDL!

/**
 * Implements a system for the dynamic resolution of dependencies.
 * @param {string} rule Rule to include, in the form lab.package.part.
 */
lab.require = function(rule) {
  // TODO(gman): For some unknown reason, when we call
  // lab.util.getScriptTagText_ it calls
  // document.getElementsByTagName('script') and for some reason the scripts do
  // not always show up. Calling it here seems to fix that as long as we
  // actually ask for the length, at least in FF 3.5.1 It would be nice to
  // figure out why.
  var dummy = document.getElementsByTagName('script').length;
  // if the object already exists we do not need do do anything
  if (lab.included_[rule]) {
    return;
  }
  var path = lab.getPathFromRule_(rule);
  if (path) {
    lab.included_[path] = true;
    lab.writeScripts_();
  } else {
    throw new Error('lab.require could not find: ' + rule);
  }
};


/**
 * Path for included scripts.
 * @type {string}
 */
lab.basePath = '';


/**
 * Object used to keep track of urls that have already been added. This
 * record allows the prevention of circular dependencies.
 * @type {Object}
 * @private
 */
lab.included_ = {};


/**
 * This object is used to keep track of dependencies and other data that is
 * used for loading scripts.
 * @private
 * @type {Object}
 */
lab.dependencies_ = {
  visited: {},  // used when resolving dependencies to prevent us from
                // visiting the file twice.
  written: {}  // used to keep track of script files we have written.
};


/**
 * Tries to detect the base path of the tdl-base.js script that
 * bootstraps the tdl libraries.
 * @private
 */
lab.findBasePath_ = function() {
  var doc = document;
  if (typeof doc == 'undefined') {
    return;
  }

  var expectedBase = 'lab/LabBase.js';
  var scripts = doc.getElementsByTagName('script');
  for (var script, i = 0; script = scripts[i]; i++) {
    var src = script.src;
    var l = src.length;
    if (src.substr(l - expectedBase.length) == expectedBase) {
      lab.basePath = src.substr(0, l - expectedBase.length);
      return;
    }
  }
};


/**
 * Writes a script tag if, and only if, that script hasn't already been added
 * to the document.  (Must be called at execution time.)
 * @param {string} src Script source.
 * @private
 */
lab.writeScriptTag_ = function(src) {
  var doc = document;
  if (typeof doc != 'undefined' &&
      !lab.dependencies_.written[src]) {
    lab.dependencies_.written[src] = true;
    var html = '<script type="text/javascript" src="' +
               src + '"></' + 'script>'
    doc.write(html);
  }
};


/**
 * Resolves dependencies based on the dependencies added using addDependency
 * and calls writeScriptTag_ in the correct order.
 * @private
 */
lab.writeScripts_ = function() {
  // the scripts we need to write this time.
  var scripts = [];
  var seenScript = {};
  var deps = lab.dependencies_;

  function visitNode(path) {
    if (path in deps.written) {
      return;
    }

    // we have already visited this one. We can get here if we have cyclic
    // dependencies.
    if (path in deps.visited) {
      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
      return;
    }

    deps.visited[path] = true;

    if (!(path in seenScript)) {
      seenScript[path] = true;
      scripts.push(path);
    }
  }

  for (var path in lab.included_) {
    if (!deps.written[path]) {
      visitNode(path);
    }
  }

  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i]) {
      lab.writeScriptTag_(lab.basePath + scripts[i]);
    } else {
      throw Error('Undefined script input');
    }
  }
};


/**
 * Looks at the dependency rules and tries to determine the script file that
 * fulfills a particular rule.
 * @param {string} rule In the form lab.namespace.Class or
 *     project.script.
 * @return {string?} Url corresponding to the rule, or null.
 * @private
 */
lab.getPathFromRule_ = function(rule) {
  var parts = rule.split('.');
  return parts.join('/') + '.js';
};

lab.findBasePath_();

/**
 * Returns true if the specified value is not |undefined|.
 * WARNING: Do not use this to test if an object has a property. Use the in
 * operator instead.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
lab.isDef = function(val) {
  return typeof val != 'undefined';
};