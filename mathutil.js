var mat4 = {
    identity: function(){
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },
    perspective: function (fieldOfViewInRadians, aspectRatio, near, far) {

        // Construct a perspective matrix

        /*
           Field of view - the angle in radians of what's in view along the Y axis
           Aspect Ratio - the ratio of the canvas, typically canvas.width / canvas.height
           Near - Anything before this point in the Z direction gets clipped (outside of the clip space)
           Far - Anything after this point in the Z direction gets clipped (outside of the clip space)
        */

        var f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
        var rangeInv = 1 / (near - far);

        return [
            f / aspectRatio, 0,                          0,   0,
            0,               f,                          0,   0,
            0,               0,    (near + far) * rangeInv,  -1,
            0,               0,  near * far * rangeInv * 2,   0
        ];
    },
    rotation: function(phi,xyz='x'){
        return [
            (xyz == 'x' ? 1 : (xyz == 'y' ? Math.cos(phi * Math.PI/180) : Math.cos(phi * Math.PI/180))), (xyz == 'x' ? 0 : (xyz == 'y' ? 0 : -Math.sin(phi * Math.PI/180))), (xyz == 'x' ? 0 : (xyz == 'y' ? Math.sin(phi * Math.PI/180) : 0)), 0,
            (xyz == 'x' ? 0 : (xyz == 'y' ? 0 : Math.sin(phi * Math.PI/180))), (xyz == 'x' ? Math.cos(phi * Math.PI/180) : (xyz == 'y' ? 1 : Math.cos(phi * Math.PI/180))), (xyz == 'x' ? -Math.sin(phi * Math.PI/180) : (xyz == 'y' ? 0 : 0)), 0,
            (xyz == 'x' ? 0 : (xyz == 'y' ? -Math.sin(phi * Math.PI/180) : 0)), (xyz == 'x' ? Math.sin(phi * Math.PI/180) : (xyz == 'y' ? 0 : 0)), (xyz == 'x' ? Math.cos(phi * Math.PI/180) : (xyz == 'y' ? Math.cos(phi * Math.PI/180) : 1)), 0,
            0, 0, 0, 1
        ]
    },
    translation: function(x,y,z){
        return [
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        ]
    },
    scale: function (x,y,z){
        return [
            x,0,0,0,
            0,y,0,0,
            0,0,z,0,
            0,0,0,1
        ];
    },
    multiply: function(a, b) {

        var a00 = a[0 * 4 + 0]; var a01 = a[0 * 4 + 1]; var a02 = a[0 * 4 + 2]; var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0]; var a11 = a[1 * 4 + 1]; var a12 = a[1 * 4 + 2]; var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0]; var a21 = a[2 * 4 + 1]; var a22 = a[2 * 4 + 2]; var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0]; var a31 = a[3 * 4 + 1]; var a32 = a[3 * 4 + 2]; var a33 = a[3 * 4 + 3];

        var b00 = b[0 * 4 + 0]; var b01 = b[0 * 4 + 1]; var b02 = b[0 * 4 + 2]; var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0]; var b11 = b[1 * 4 + 1]; var b12 = b[1 * 4 + 2]; var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0]; var b21 = b[2 * 4 + 1]; var b22 = b[2 * 4 + 2]; var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0]; var b31 = b[3 * 4 + 1]; var b32 = b[3 * 4 + 2]; var b33 = b[3 * 4 + 3];

        return [
            (b00 * a00 + b10 * a01 + b20 * a02 + b30 * a03), (b01 * a00 + b11 * a01 + b21 * a02 + b31 * a03), (b02 * a00 + b12 * a01 + b22 * a02 + b32 * a03), (b03 * a00 + b13 * a01 + b23 * a02 + b33 * a03),
            (b00 * a10 + b10 * a11 + b20 * a12 + b30 * a13), (b01 * a10 + b11 * a11 + b21 * a12 + b31 * a13), (b02 * a10 + b12 * a11 + b22 * a12 + b32 * a13), (b03 * a10 + b13 * a11 + b23 * a12 + b33 * a13),
            (b00 * a20 + b10 * a21 + b20 * a22 + b30 * a23), (b01 * a20 + b11 * a21 + b21 * a22 + b31 * a23), (b02 * a20 + b12 * a21 + b22 * a22 + b32 * a23), (b03 * a20 + b13 * a21 + b23 * a22 + b33 * a23),
            (b00 * a30 + b10 * a31 + b20 * a32 + b30 * a33), (b01 * a30 + b11 * a31 + b21 * a32 + b31 * a33), (b02 * a30 + b12 * a31 + b22 * a32 + b32 * a33), (b03 * a30 + b13 * a31 + b23 * a32 + b33 * a33)
        ];
    },
    transpose: function(a){
        return[ a[0 * 4 + 0],a[1 * 4 + 0],a[2 * 4 + 0],a[3 * 4 + 0],
                a[0 * 4 + 1],a[1 * 4 + 1],a[2 * 4 + 1],a[3 * 4 + 1],
                a[0 * 4 + 2],a[1 * 4 + 2],a[2 * 4 + 2],a[3 * 4 + 2],
                a[0 * 4 + 3],a[1 * 4 + 3],a[2 * 4 + 3],a[3 * 4 + 3],
        ];
    },
    matvec: function(A,x){
        return[
            A[0 * 4 + 0] * x[0] + A[0 * 4 + 1] * x[1] + A[0 * 4 + 2] * x[2] + A[0 * 4 + 3] * x[3],
            A[1 * 4 + 0] * x[0] + A[1 * 4 + 1] * x[1] + A[1 * 4 + 2] * x[2] + A[1 * 4 + 3] * x[3],
            A[2 * 4 + 0] * x[0] + A[2 * 4 + 1] * x[1] + A[2 * 4 + 2] * x[2] + A[2 * 4 + 3] * x[3],
            A[3 * 4 + 0] * x[0] + A[3 * 4 + 1] * x[1] + A[3 * 4 + 2] * x[2] + A[3 * 4 + 3] * x[3]
        ];
    },
    inverse: function(A){
        B = mat4.transpose(A)
        A1 = math.inv([
            [B[0 * 4 + 0], B[0 * 4 + 1], B[0 * 4 + 2], B[0 * 4 + 3]],
            [B[1 * 4 + 0], B[1 * 4 + 1], B[1 * 4 + 2], B[1 * 4 + 3]],
            [B[2 * 4 + 0], B[2 * 4 + 1], B[2 * 4 + 2], B[2 * 4 + 3]],
            [B[3 * 4 + 0], B[3 * 4 + 1], B[3 * 4 + 2], B[0 * 4 + 3]]
        ]);
        A2 = mat4.transpose([
            A1[0][0],A1[0][1],A1[0][2],A1[0][3],
            A1[1][0],A1[1][1],A1[1][2],A1[1][3],
            A1[2][0],A1[2][1],A1[2][2],A1[2][3],
            A1[3][0],A1[3][1],A1[3][2],A1[3][3]
        ]);

        return A2;
    },
    dropDim: function(A){
        return [
            A[0 * 4 + 0], A[0 * 4 + 1], A[0 * 4 + 2],
            A[1 * 4 + 0], A[1 * 4 + 1], A[1 * 4 + 2],
            A[2 * 4 + 0], A[2 * 4 + 1], A[2 * 4 + 2]
        ]
    }
}

var mat3 = {
    transpose: function(a){
        return[a[0 * 3 + 0],a[1 * 3 + 0],a[2 * 3 + 0],
            a[0 * 3 + 1],a[1 * 3 + 1],a[2 * 3 + 1],
            a[0 * 3 + 2],a[1 * 3 + 2],a[2 * 3 + 2]
        ];
    },
    inverse: function(A){
        B = mat3.transpose(A)
        A1 = math.inv([
            [B[0 * 3 + 0], B[0 * 3 + 1], B[0 * 3 + 2]],
            [B[1 * 3 + 0], B[1 * 3 + 1], B[1 * 3 + 2]],
            [B[2 * 3 + 0], B[2 * 3 + 1], B[2 * 3 + 2]]
        ]);
        A2 = mat3.transpose([
            A1[0][0],A1[0][1],A1[0][2],
            A1[1][0],A1[1][1],A1[1][2],
            A1[2][0],A1[2][1],A1[2][2],
        ]);
        return A2;
    }
}

var vec4 = {
    scale: function(a,v){
        return [
            v[0] * a,
            v[1] * a,
            v[2] * a,
            v[3]
        ];
    }
}

function lookAt( eye, at, up )
{

    return result;
}