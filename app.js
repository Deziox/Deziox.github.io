"use strict"

var vertexShaderSource = document.getElementById('vertex-shader').innerText.trim();
var fragmentShaderSource = document.getElementById('fragment-shader').innerText.trim();

var rotationSpeed = 30;
var rotation = [0,0,0];
var position = [0,-1,-1];

var cube_position = [0.0,0.0,-2.0]
var cube_rotation = [0.0,0.0,0.0]
var cube_acceleration = [0.0,0.0,0.0]
var cube_velocity = [0.0,0.0,0.0]
var camera = [0.0,1.0,1.0]

var drag = false;
var x;
var y;
var x_delta = 0.01;
var y_delta = 0.01;
var z_delta = 0.01;

var light_position = [0.0,1.0,0.0,0.0];

var matrix = mat4.identity();

let c1 = [Math.random()*0.5,Math.random()*0.5,Math.random()*0.5,1.0]
let c2 = [Math.random()*0.5,Math.random()*0.5,Math.random()*0.5,1.0]
let c3 = [Math.random()*0.75,Math.random()*0.75,Math.random()*0.75,1.0]
let c4 = [Math.random()*0.75,Math.random()*0.75,Math.random()*0.75,1.0]
let c5 = [Math.random()*0.75,Math.random()*0.75,Math.random()*0.75,1.0]
let c6 = [Math.random()*0.75,Math.random()*0.75,Math.random()*0.75,1.0]

let floor_color = [1.0,1.0,1.0,1.0]

var posColorNorm = []

function createShader(gl, type, source){
    var shader = gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader,gl.COMPILE_STATUS);
    if(success){
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader){
    var program = gl.createProgram();
    gl.attachShader(program,vertexShader);
    gl.attachShader(program,fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program,gl.LINK_STATUS);
    if(success){
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function setGeometry(gl){
    var cube1 = Geometry.cube(1.0,cube_position,cube_rotation);
    // var cube2 = Geometry.cube(0.2,[-1.0,0.0,-2.0],[0.0,0.0,0.0]);
    var vertices = [...cube1[0]];
    var normals = [...cube1[1]];

    var colors = [
        c1,c1,c1,
        c1,c1,c1,
        c1,c1,c1,
        c1,c1,c1,
        c1,c1,c1,
        c1,c1,c1,
        c1,c1,c1,
        c1,c1,c1,
        c1,c1,c1,
        c1,c1,c1,
        c1,c1,c1,
        c1,c1,c1,
    ];

    for(let i = 0; i < vertices.length; i++) {
        for (let j = 0; j < vertices[0].length; j++) {
            posColorNorm.push(vertices[i][j])
        }
        for (let j = 0; j < colors[0].length; j++) {
            posColorNorm.push(colors[i][j])
        }
        for (let j = 0; j < normals[0].length; j++) {
            posColorNorm.push(normals[i][j])
        }
        // console.log(posColorNorm);
    }
    return cube1[2];
}

function floor(gl){
    var floor = Geometry.floor([0.0,-1.0,-0.2],100.0)
    var vertices = [...floor[0]];
    var normals = [...floor[1]];

    var colors = [
        //Floor
        // floor_color,floor_color,floor_color,
        // floor_color,floor_color,floor_color,
        c2,c2,c2,
        c2,c2,c2
    ];

    for(let i = 0; i < vertices.length; i++) {
        for (let j = 0; j < vertices[0].length; j++) {
            posColorNorm.push(vertices[i][j])
        }
        for (let j = 0; j < colors[0].length; j++) {
            posColorNorm.push(colors[i][j])
        }
        for (let j = 0; j < normals[0].length; j++) {
            posColorNorm.push(normals[i][j])
        }
    }
}

var mouseDown = function(e){
    drag = true;
    x = e.pageX, y = e.pageY;
    e.preventDefault();
    return false;
};

var mouseUp = function(e){
    drag = false;
};

var mouseMove = function(e){
    if(!drag) return false;
    cube_rotation[0] += (e.pageY-y) % 360
    cube_rotation[1] += (e.pageX-x) % 360
    x = e.pageX, y = e.pageY;
};

function keyDownCheck(e) {
    if(e.key == "ArrowDown"){
        position[1] -= y_delta;
    }else if(e.key == "ArrowUp"){
        position[1] += y_delta;
    }else if(e.key == "ArrowLeft"){
        position[0] -= x_delta;
    }else if(e.key == "ArrowRight"){
        position[0] += x_delta;
    }else if(e.key == "-") {
        position[2] -= z_delta;
    }else if(e.key == "=") {
        position[2] += z_delta;
    }else if(e.key == "1"){
        cube_position[2] -= z_delta;
    }else if(e.key == "2"){
        cube_position[2] += z_delta;
    }else if(e.key == "w"){
        cube_position[1] += y_delta;
    }else if(e.key == "s"){
        cube_position[1] -= y_delta;
    }else if(e.key == "a"){
        cube_position[0] -= x_delta;
    }else if(e.key == "d"){
        cube_position[0] += x_delta;
    }else{
        console.log(e.key);
    }
    console.log(position);
    console.log(matrix);
}

function main(){
    var canvas = document.getElementById("gl_surface");
    window.addEventListener("keydown",keyDownCheck);
    // Events
    canvas.addEventListener("mousedown",mouseDown,false);
    canvas.addEventListener("mouseup",mouseUp,false);
    canvas.addEventListener("mouseout", mouseUp, false);
    canvas.addEventListener("mousemove",mouseMove,false);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var gl = canvas.getContext("webgl");
    if(!gl){
        console.log("Webgl don't work you donut");
        return;
    }

    var titleElement = document.querySelector("#title");
    var titleNode = document.createTextNode("  Danzel Serrano");
    titleElement.appendChild(titleNode);

    var vertexShader = createShader(gl,gl.VERTEX_SHADER,vertexShaderSource);
    var fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,fragmentShaderSource);
    var program = createProgram(gl,vertexShader,fragmentShader);

    var positionLocation = gl.getAttribLocation(program,"a_position");
    var colorLocation = gl.getAttribLocation(program,"a_color");
    var normalLocation = gl.getAttribLocation(program,"a_normal");
    var matrixLocation = gl.getUniformLocation(program,"u_matrix");
    var normalMatrixLocation = gl.getUniformLocation(program,"u_N");
    var aspectRatioLocation = gl.getUniformLocation(program, "aspectRatio");
    var lightLocation = gl.getUniformLocation(program,"u_light");
    var eyeLocation = gl.getUniformLocation(program,"u_eye");

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setGeometry(gl);

    var then = 0;

    requestAnimationFrame(drawScene);

    function drawScene(now){
        posColorNorm = []
        // Seconds
        now *= 0.001;
        var delta_t = now - then;
        then = now;

        if(!drag) {
            cube_rotation[0] = (cube_rotation[0] + rotationSpeed * delta_t) % 360
            cube_rotation[1] = (cube_rotation[1] + rotationSpeed * delta_t) % 360
            cube_rotation[2] = (cube_rotation[2] + rotationSpeed * delta_t) % 360
        }

        gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
        // console.log(gl.canvas.width/gl.canvas.height);
        gl.enable(gl.DEPTH_TEST);
        // gl.enable(gl.CULL_FACE)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0.0,0.0,0.0,1.0);
        gl.useProgram(program);
        gl.enableVertexAttribArray(positionLocation);
        gl.enableVertexAttribArray(colorLocation);
        gl.enableVertexAttribArray(normalLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        var size = 4;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 11*Float32Array.BYTES_PER_ELEMENT;
        var offset = 0;
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

        var size = 4;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 11*Float32Array.BYTES_PER_ELEMENT;
        var offset = 4*Float32Array.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

        var size = 3;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 11*Float32Array.BYTES_PER_ELEMENT;
        var offset = 8*Float32Array.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(normalLocation, size, type, normalize, stride, offset);

        var cubeModelTransform = setGeometry(gl);
        floor(gl);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(posColorNorm),
            gl.STATIC_DRAW
        );

        // Compute and Set 3D transform matrices
        matrix = mat4.identity();
        // matrix = mat4.multiply(mat4.rotation(rotation[2],'z'),matrix);
        // matrix = mat4.multiply(mat4.rotation(rotation[1],'y'),matrix);
        // matrix = mat4.multiply(mat4.rotation(rotation[0],'x'),matrix);
        matrix = mat4.multiply(mat4.translation(position[0],position[1],position[2]),matrix);
        var fieldOfViewInRadians = Math.PI * 0.3;
        var aspectRatio = 1;
        var nearClippingPlaneDistance = 1;
        var farClippingPlaneDistance = 100;
        matrix = mat4.multiply(mat4.perspective(fieldOfViewInRadians,aspectRatio,nearClippingPlaneDistance,farClippingPlaneDistance),matrix);
        matrix = mat4.transpose(matrix);
        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        gl.uniform4fv(lightLocation,light_position);
        gl.uniform4fv(eyeLocation,[...position, 0.0]);

        // pass aspect ratio uniform
        gl.uniform1f(aspectRatioLocation,(gl.canvas.width/gl.canvas.height));

        // Draw Geometry
        gl.uniformMatrix3fv(normalMatrixLocation, false, mat3.inverse(mat4.dropDim(cubeModelTransform)));
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 36;
        gl.drawArrays(primitiveType, offset, count);

        // Draw Floor
        // gl.uniformMatrix3fv(normalMatrixLocation, false, mat3.inverse(mat4.dropDim(matrix)));
        var primitiveType = gl.TRIANGLES;
        var offset = 36;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
        requestAnimationFrame(drawScene);
    }
};

main();
