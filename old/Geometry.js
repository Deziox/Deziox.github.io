// Cube Vertices
topLeftFront = [-0.5, 0.5, 0.5, 1.0]
topRightFront =[0.5, 0.5, 0.5, 1.0]
bottomLeftFront = [-0.5, -0.5, 0.5, 1.0]
bottomRightFront = [0.5, -0.5, 0.5, 1.0]
topLeftBack = [-0.5, 0.5, -0.5, 1.0]
topRightBack =[0.5, 0.5, -0.5, 1.0]
bottomLeftBack = [-0.5, -0.5, -0.5, 1.0]
bottomRightBack = [0.5, -0.5, -0.5, 1.0]

frontNormal = [0.0,0.0,1.0]
backNormal = [0.0,0.0,-1.0]
upNormal = [0.0,1.0,0.0]
downNormal = [0.0,-1.0,0.0]
rightNormal = [1.0,0.0,0.0]
leftNormal = [-1.0,0.0,0.0]

// Floor Vertices
floorBackLeft = [-0.5,0.0,-0.5,1.0]
floorBackRight = [0.5,0.0,-0.5,1.0]
floorFrontLeft = [-0.5,0.0,0.5,1.0]
floorFrontRight = [0.5,0.0,0.5,1.0]
floorNormal = [0.0,1.0,0.0]

// Icosahedron
phi = (1.0 + math.sqrt(5.0)) * 0.5;
a = 1.0;
b = 1.0 / phi;
v1  = [0.0, b, -a, 1.0];
v2  = [b, a, 0.0, 1.0];
v3  = [-b, a, 0.0, 1.0];
v4  = [0.0, b, a, 1.0];
v5  = [0.0, -b, a, 1.0];
v6  = [-a, 0.0, b, 1.0];
v7  = [0.0, -b, -a, 1.0];
v8  = [a, 0.0, -b, 1.0];
v9  = [a, 0.0, b, 1.0];
v10 = [-a, 0.0, -b, 1.0];
v11 = [b, -a, 0.0, 1.0];
v12 = [-b, -a, 0.0, 1.0];

n1  = [0.0, b, -a];
n2  = [b, a, 0.0];
n3  = [-b, a, 0.0];
n4  = [0.0, b, a];
n5  = [0.0, -b, a];
n6  = [-a, 0.0, b];
n7  = [0.0, -b, -a];
n8  = [a, 0.0, -b];
n9  = [a, 0.0, b];
n10 = [-a, 0.0, -b];
n11 = [b, -a, 0.0];
n12 = [-b, -a, 0.0];

var Geometry = {
    cube: function (scale, pos, rot) {
        var scaled = [
            // back
            vec4.scale(scale, topLeftBack),
            vec4.scale(scale, topRightBack),
            vec4.scale(scale, bottomRightBack),

            vec4.scale(scale, bottomRightBack),
            vec4.scale(scale, bottomLeftBack),
            vec4.scale(scale, topLeftBack),

            // left side
            vec4.scale(scale, topLeftFront),
            vec4.scale(scale, topLeftBack),
            vec4.scale(scale, bottomLeftBack),

            vec4.scale(scale, bottomLeftBack),
            vec4.scale(scale, bottomLeftFront),
            vec4.scale(scale, topLeftFront),

            // top
            vec4.scale(scale, topLeftFront),
            vec4.scale(scale, topRightFront),
            vec4.scale(scale, topRightBack),

            vec4.scale(scale, topRightBack),
            vec4.scale(scale, topLeftBack),
            vec4.scale(scale, topLeftFront),

            // right side
            vec4.scale(scale, topRightBack),
            vec4.scale(scale, topRightFront),
            vec4.scale(scale, bottomRightFront),

            vec4.scale(scale, bottomRightFront),
            vec4.scale(scale, bottomRightBack),
            vec4.scale(scale, topRightBack),

            // bottom
            vec4.scale(scale, bottomLeftFront),
            vec4.scale(scale, bottomLeftBack),
            vec4.scale(scale, bottomRightBack),

            vec4.scale(scale, bottomRightBack),
            vec4.scale(scale, bottomRightFront),
            vec4.scale(scale, bottomLeftFront),

            // front
            vec4.scale(scale, topLeftFront),
            vec4.scale(scale, bottomLeftFront),
            vec4.scale(scale, bottomRightFront),

            vec4.scale(scale, bottomRightFront),
            vec4.scale(scale, topRightFront),
            vec4.scale(scale, topLeftFront)
        ];
        var ret = [];
        var transform = mat4.identity();
        transform = mat4.multiply(mat4.rotation(rot[2], 'z'), transform);
        transform = mat4.multiply(mat4.rotation(rot[1], 'y'), transform);
        transform = mat4.multiply(mat4.rotation(rot[0], 'x'), transform);

        transform = mat4.multiply(mat4.translation(pos[0], pos[1], pos[2]), transform);
        for (let v = 0; v < scaled.length; v++) {
            ret.push(mat4.matvec(transform, scaled[v]))
        }
        var N = mat3.transpose(mat3.inverse(mat4.dropDim(transform)));
        var backNormalT = mat3.matvec(N, backNormal);
        var leftNormalT = mat3.matvec(N, leftNormal);
        var upNormalT = mat3.matvec(N, upNormal);
        var rightNormalT = mat3.matvec(N, rightNormal);
        var downNormalT = mat3.matvec(N, downNormal);
        var frontNormalT = mat3.matvec(N, frontNormal);

        var normals = [
            // back
            backNormalT, backNormalT, backNormalT, backNormalT, backNormalT, backNormalT,

            // left side
            leftNormalT, leftNormalT, leftNormalT, leftNormalT, leftNormalT, leftNormalT,

            // top
            upNormalT, upNormalT, upNormalT, upNormalT, upNormalT, upNormalT,

            // right side
            rightNormalT, rightNormalT, rightNormalT, rightNormalT, rightNormalT, rightNormalT,

            // bottom
            downNormalT, downNormalT, downNormalT, downNormalT, downNormalT, downNormalT,

            // front
            frontNormalT, frontNormalT, frontNormalT, frontNormalT, frontNormalT, frontNormalT
        ];
        return [ret, normals, transform]
    },
    floor: function (c, scale) {
        var faces = [
            vec4.scale(scale, floorFrontLeft),
            vec4.scale(scale, floorFrontRight),
            vec4.scale(scale, floorBackLeft),

            vec4.scale(scale, floorBackLeft),
            vec4.scale(scale, floorFrontRight),
            vec4.scale(scale, floorBackRight)
        ];
        var ret = [];
        var transform = mat4.identity();

        transform = mat4.multiply(mat4.translation(c[0], c[1], c[2]), transform);

        for (let v = 0; v < faces.length; v++) {
            ret.push(mat4.matvec(transform, faces[v]))
        }
        var normals = [
            floorNormal, floorNormal, floorNormal, floorNormal, floorNormal, floorNormal,
        ];
        return [ret, normals, transform]
    },
    icosahedron: function (r, pos, rot) {
        var scale = r;
        var scaled = [
            vec4.scale(scale, v3), vec4.scale(scale, v2), vec4.scale(scale, v1),
            vec4.scale(scale, v2), vec4.scale(scale, v3), vec4.scale(scale, v4),
            vec4.scale(scale, v6), vec4.scale(scale, v5), vec4.scale(scale, v4),
            vec4.scale(scale, v5), vec4.scale(scale, v9), vec4.scale(scale, v4),
            vec4.scale(scale, v8), vec4.scale(scale, v7), vec4.scale(scale, v1),
            vec4.scale(scale, v7), vec4.scale(scale, v10), vec4.scale(scale, v1),
            vec4.scale(scale, v12), vec4.scale(scale, v11), vec4.scale(scale, v5),
            vec4.scale(scale, v11), vec4.scale(scale, v12), vec4.scale(scale, v7),
            vec4.scale(scale, v10), vec4.scale(scale, v6), vec4.scale(scale, v3),
            vec4.scale(scale, v6), vec4.scale(scale, v10), vec4.scale(scale, v12),
            vec4.scale(scale, v9), vec4.scale(scale, v8), vec4.scale(scale, v2),
            vec4.scale(scale, v8), vec4.scale(scale, v9), vec4.scale(scale, v11),
            vec4.scale(scale, v3), vec4.scale(scale, v6), vec4.scale(scale, v4),
            vec4.scale(scale, v9), vec4.scale(scale, v2), vec4.scale(scale, v4),
            vec4.scale(scale, v10), vec4.scale(scale, v3), vec4.scale(scale, v1),
            vec4.scale(scale, v2), vec4.scale(scale, v8), vec4.scale(scale, v1),
            vec4.scale(scale, v12), vec4.scale(scale, v10), vec4.scale(scale, v7),
            vec4.scale(scale, v8), vec4.scale(scale, v11), vec4.scale(scale, v7),
            vec4.scale(scale, v6), vec4.scale(scale, v12), vec4.scale(scale, v5),
            vec4.scale(scale, v11), vec4.scale(scale, v9), vec4.scale(scale, v5)
        ];

        var ret = [];
        var transform = mat4.identity();
        transform = mat4.multiply(mat4.rotation(rot[2], 'z'), transform);
        transform = mat4.multiply(mat4.rotation(rot[1], 'y'), transform);
        transform = mat4.multiply(mat4.rotation(rot[0], 'x'), transform);

        transform = mat4.multiply(mat4.translation(pos[0], pos[1], pos[2]), transform);
        for (let v = 0; v < scaled.length; v++) {
            ret.push(mat4.matvec(transform, scaled[v]))
        }
        var N = mat3.transpose(mat3.inverse(mat4.dropDim(transform)));

        var normals = [
            mat3.matvec(N, vec3.normalize(n3)), mat3.matvec(N, vec3.normalize(n2)), mat3.matvec(N, vec3.normalize(n1)),
            mat3.matvec(N, vec3.normalize(n2)), mat3.matvec(N, vec3.normalize(n3)), mat3.matvec(N, vec3.normalize(n4)),
            mat3.matvec(N, vec3.normalize(n6)), mat3.matvec(N, vec3.normalize(n5)), mat3.matvec(N, vec3.normalize(n4)),
            mat3.matvec(N, vec3.normalize(n5)), mat3.matvec(N, vec3.normalize(n9)), mat3.matvec(N, vec3.normalize(n4)),
            mat3.matvec(N, vec3.normalize(n8)), mat3.matvec(N, vec3.normalize(n7)), mat3.matvec(N, vec3.normalize(n1)),
            mat3.matvec(N, vec3.normalize(n7)), mat3.matvec(N, vec3.normalize(n10)), mat3.matvec(N, vec3.normalize(n1)),
            mat3.matvec(N, vec3.normalize(n12)), mat3.matvec(N, vec3.normalize(n11)), mat3.matvec(N, vec3.normalize(n5)),
            mat3.matvec(N, vec3.normalize(n11)), mat3.matvec(N, vec3.normalize(n12)), mat3.matvec(N, vec3.normalize(n7)),
            mat3.matvec(N, vec3.normalize(n10)), mat3.matvec(N, vec3.normalize(n6)), mat3.matvec(N, vec3.normalize(n3)),
            mat3.matvec(N, vec3.normalize(n6)), mat3.matvec(N, vec3.normalize(n10)), mat3.matvec(N, vec3.normalize(n12)),
            mat3.matvec(N, vec3.normalize(n9)), mat3.matvec(N, vec3.normalize(n8)), mat3.matvec(N, vec3.normalize(n2)),
            mat3.matvec(N, vec3.normalize(n8)), mat3.matvec(N, vec3.normalize(n9)), mat3.matvec(N, vec3.normalize(n11)),
            mat3.matvec(N, vec3.normalize(n3)), mat3.matvec(N, vec3.normalize(n6)), mat3.matvec(N, vec3.normalize(n4)),
            mat3.matvec(N, vec3.normalize(n9)), mat3.matvec(N, vec3.normalize(n2)), mat3.matvec(N, vec3.normalize(n4)),
            mat3.matvec(N, vec3.normalize(n10)), mat3.matvec(N, vec3.normalize(n3)), mat3.matvec(N, vec3.normalize(n1)),
            mat3.matvec(N, vec3.normalize(n2)), mat3.matvec(N, vec3.normalize(n8)), mat3.matvec(N, vec3.normalize(n1)),
            mat3.matvec(N, vec3.normalize(n12)), mat3.matvec(N, vec3.normalize(n10)), mat3.matvec(N, vec3.normalize(n7)),
            mat3.matvec(N, vec3.normalize(n8)), mat3.matvec(N, vec3.normalize(n11)), mat3.matvec(N, vec3.normalize(n7)),
            mat3.matvec(N, vec3.normalize(n6)), mat3.matvec(N, vec3.normalize(n12)), mat3.matvec(N, vec3.normalize(n5)),
            mat3.matvec(N, vec3.normalize(n11)), mat3.matvec(N, vec3.normalize(n9)), mat3.matvec(N, vec3.normalize(n5))
        ];

        // for(let v = 0; v < scaled.length-5; v += 3){
        //     console.log(v);
        //     scaled.push(vec4.scale(scale,vec4.normalize(vec4.lerp(scaled[v],scaled[v+1],0.5))));
        //     scaled.push(vec4.scale(scale,vec4.normalize(vec4.lerp(scaled[v],scaled[v+2],0.5))));
        //     scaled.push(scaled[v]);
        //
        //     normals.push(vec4.lerp(normals[v],normals[v+1],0.5));
        //     normals.push(vec4.lerp(normals[v],normals[v+2],0.5));
        //     normals.push(normals[v]);
        // }


        return [ret, normals, transform]
    },
    sphere: function (heightSegments = 12, widthSegments = 24, radius = 1.0) {
        const pi = Math.PI;
        const pi2 = 2 * pi;
        let vertices = [];
        let indices = [];
        const stride = 11 * Float32Array.BYTES_PER_ELEMENT;

        // Generate the individual vertices in our vertex buffer.
        for (let y = 0; y <= heightSegments; y++) {
            for (let x = 0; x <= widthSegments; x++) {
                // Generate a vertex based on its spherical coordinates
                const u = x / widthSegments;
                const v = y / heightSegments;
                const theta = u * pi2;
                const phi = v * pi;
                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);
                const ux = cosTheta * sinPhi;
                const uy = cosPhi;
                const uz = sinTheta * sinPhi;
                // add positions
                vertices.push(radius * ux, radius * uy, radius * uz);
                // ad colors
                const w = (2 * Math.cos(3 * phi));
                const c = Math.random()*0.5;
                vertices.push(c, c, c);
                // add normals
                vertices.push(ux / radius, uy / radius, uz / radius);
                // add uv's
                vertices.push(u, v);
            }
        }

        // Generate the index buffer
        const numVertsAround = widthSegments + 1;
        for (let x = 0; x < widthSegments; x++) {
            for (let y = 0; y < heightSegments; y++) {
                // Make first triangle of the quad.
                indices.push(
                    (y + 0) * numVertsAround + x + 1,
                    (y + 0) * numVertsAround + x,
                    (y + 1) * numVertsAround + x);
                // Make second triangle of the quad.
                indices.push(
                    (y + 0) * numVertsAround + x + 1,
                    (y + 1) * numVertsAround + x,
                    (y + 1) * numVertsAround + x + 1);
            }
        }

        pos = []
        normals = []
        color = []
        tex = []
        for(let v = 0; v < vertices.length - stride/Float32Array.BYTES_PER_ELEMENT + 1; v += stride/Float32Array.BYTES_PER_ELEMENT){
            pos.push([vertices[v],
                vertices[v+1],
                vertices[v+2],
                1.0
            ])
            normals.push([vertices[v+6],
                vertices[v+7],
                vertices[v+8]
            ])
        }
        // return [pos,normals,color,tex]
        return {vertices, indices, stride}
    }
}