/* Syntax-only check for the browser-dependent scripts.
   Parses each file without executing it, so DOM/WebAudio absence doesn't matter. */
var fso = new ActiveXObject('Scripting.FileSystemObject');
var files = ['js\\music.js', 'js\\audio.js', 'js\\tab.js', 'js\\data\\lessons.js', 'js\\data\\songs.js', 'js\\app.js'];
var bad = 0;
for (var i = 0; i < files.length; i++) {
  var f = files[i];
  var s = fso.OpenTextFile(f, 1).ReadAll();
  try {
    new Function(s);
    WScript.Echo('  ok   ' + f);
  } catch (e) {
    bad++;
    WScript.Echo('  FAIL ' + f + ' -> ' + e.message);
  }
}
WScript.Echo(bad ? '\nPARSE FAILED' : '\nPARSE OK');
WScript.Quit(bad ? 1 : 0);
