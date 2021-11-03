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

floorBackLeft = [-0.5,0.0,-0.5,1.0]
floorBackRight = [0.5,0.0,-0.5,1.0]
floorFrontLeft = [-0.5,0.0,0.5,1.0]
floorFrontRight = [0.5,0.0,0.5,1.0]
floorNormal = [0.0,1.0,0.0]

var Geometry = {
    cube : function(scale,pos,rot){
        var scaled = [
            // back
            vec4.scale(scale,topLeftBack),
            vec4.scale(scale,topRightBack),
            vec4.scale(scale,bottomRightBack),

            vec4.scale(scale,bottomRightBack),
            vec4.scale(scale,bottomLeftBack),
            vec4.scale(scale,topLeftBack),

            // left side
            vec4.scale(scale,topLeftFront),
            vec4.scale(scale,topLeftBack),
            vec4.scale(scale,bottomLeftBack),

            vec4.scale(scale,bottomLeftBack),
            vec4.scale(scale,bottomLeftFront),
            vec4.scale(scale,topLeftFront),

            // top
            vec4.scale(scale,topLeftFront),
            vec4.scale(scale,topRightFront),
            vec4.scale(scale,topRightBack),

            vec4.scale(scale,topRightBack),
            vec4.scale(scale,topLeftBack),
            vec4.scale(scale,topLeftFront),

            // right side
            vec4.scale(scale,topRightBack),
            vec4.scale(scale,topRightFront),
            vec4.scale(scale,bottomRightFront),

            vec4.scale(scale,bottomRightFront),
            vec4.scale(scale,bottomRightBack),
            vec4.scale(scale,topRightBack),

            // bottom
            vec4.scale(scale,bottomLeftFront),
            vec4.scale(scale,bottomLeftBack),
            vec4.scale(scale,bottomRightBack),

            vec4.scale(scale,bottomRightBack),
            vec4.scale(scale,bottomRightFront),
            vec4.scale(scale,bottomLeftFront),

            // front
            vec4.scale(scale,topLeftFront),
            vec4.scale(scale,bottomLeftFront),
            vec4.scale(scale,bottomRightFront),

            vec4.scale(scale,bottomRightFront),
            vec4.scale(scale,topRightFront),
            vec4.scale(scale,topLeftFront)
        ];
        var ret = [];
        var transform = mat4.identity();
        transform = mat4.multiply(mat4.rotation(rot[2],'z'),transform);
        transform = mat4.multiply(mat4.rotation(rot[1],'y'),transform);
        transform = mat4.multiply(mat4.rotation(rot[0],'x'),transform);

        transform = mat4.multiply(mat4.translation(pos[0],pos[1],pos[2]),transform);
        for(let v = 0; v < scaled.length; v++){
            ret.push(mat4.matvec(transform,scaled[v]))
        }
        var N = mat3.transpose(mat3.inverse(mat4.dropDim(transform)));
        var backNormalT = mat3.matvec(N,backNormal);
        var leftNormalT = mat3.matvec(N,leftNormal);
        var upNormalT = mat3.matvec(N,upNormal);
        var rightNormalT = mat3.matvec(N,rightNormal);
        var downNormalT = mat3.matvec(N,downNormal);
        var frontNormalT = mat3.matvec(N,frontNormal);

        var normals = [
            // back
            backNormalT,backNormalT,backNormalT,backNormalT,backNormalT,backNormalT,

            // left side
            leftNormalT,leftNormalT,leftNormalT,leftNormalT,leftNormalT,leftNormalT,

            // top
            upNormalT,upNormalT,upNormalT,upNormalT,upNormalT,upNormalT,

            // right side
            rightNormalT,rightNormalT,rightNormalT,rightNormalT,rightNormalT,rightNormalT,

            // bottom
            downNormalT,downNormalT,downNormalT,downNormalT,downNormalT,downNormalT,

            // front
            frontNormalT,frontNormalT,frontNormalT,frontNormalT,frontNormalT,frontNormalT
        ];
        return [ret, normals, transform]
    },
    floor : function(c,scale){
        var faces = [
            vec4.scale(scale,floorFrontLeft),
            vec4.scale(scale,floorFrontRight),
            vec4.scale(scale,floorBackLeft),

            vec4.scale(scale,floorBackLeft),
            vec4.scale(scale,floorFrontRight),
            vec4.scale(scale,floorBackRight)
        ];
        var ret = [];
        var transform = mat4.identity();

        transform = mat4.multiply(mat4.translation(c[0],c[1],c[2]),transform);

        for(let v = 0; v < faces.length; v++){
            ret.push(mat4.matvec(transform,faces[v]))
        }
        var normals = [
            floorNormal,floorNormal,floorNormal,floorNormal,floorNormal,floorNormal,
        ];
        return [ret, normals, transform]
    }
}