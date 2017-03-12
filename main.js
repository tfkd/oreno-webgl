var gl; // WebGL context
var startTime;
var program;

// animation
var requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function(callback) {window.setTimeout(callback, 1000/60);};
})();

function createProgram() {
    // create shader program
    program = gl.createProgram();
    gl.attachShader(program, getShader(gl, "shader-vs"));
    gl.attachShader(program, getFragmentShader());

    // link program
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("couldn't initialize shader program")
    }

    gl.useProgram(program);
}

function drawScene() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var positions = [
         1.0,  1.0,
        -1.0,  1.0,
        -1.0, -1.0,
        -1.0, -1.0,
         1.0, -1.0,
         1.0,  1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    var timeUniformLocation = gl.getUniformLocation(program, "u_time");
    var currentTime = (new Date()).getTime();
    gl.uniform1f(timeUniformLocation, (currentTime - startTime)/1000);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function getFragmentShader() {
    var source = document.getElementById("fragment-shader").value;
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, source);

    gl.compileShader(fragmentShader);
    return fragmentShader;
}

function getShader(gl, id) {
    var shaderScript, source, currentChild, shader;

    shaderScript = document.getElementById(id);

    if (!shaderScript) {
        return null;
    }

    source = "";
    currentChild = shaderScript.firstChild;

    while(currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            source += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else {
        console.log("unknow shader type");
        return null;
    }

    gl.shaderSource(shader, source);

    // compile shader
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("couldn't compile shader");
        return null;
    }

    return shader;
}

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

    // start time
    startTime = (new Date()).getTime();

    // resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

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

        createProgram();

        function animationloop() {
            createProgram();
            drawScene();
            requestAnimationFrame(animationloop);
        }
        animationloop();
    }
}
