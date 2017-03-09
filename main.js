var gl; // WebGL context

function initWebGL(canvas) {
    gl = null;

    try {
        // get basic context
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}

    // exit if gl context couldn't get
    if (!gl) {
        console.log("couldn't get gl context")
    }

    return gl;
}

function start() {
    var canvas = document.getElementById("glcanvas");

    // initialize gl context
    gl = initWebGL(canvas);

    if (gl) {
        // set black to clear color
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // enable depth
        gl.enable(gl.DEPTH_TEST);
        // cover oblect
        gl.depthFunc(gl.LEQUAL);
        // clear color buffer and depth
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}
