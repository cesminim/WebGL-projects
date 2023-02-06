var shadedPolygonVS = `#version 300 es

precision highp float;

layout (location=0) in vec2 vertexPos;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec3 v_Barycentric;
 
void main()
{
    gl_Position = projection * view * model * vec4(vec3(vertexPos, 0.), 1.0);
}
`

var shadedPolygonFS = `#version 300 es

precision highp float;

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

#define PI (3.1415)


float when_gt(float x, float y)
{
    return max(sign(x - y), 0.0);
}
float when_eq(float x, float y)
{
    return 1.0 - abs(sign(x - y));
}

void main()
{
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    
    vec3 col = 0.5 + 0.5*cos(time + uv.xyx + vec3(0,2,4));

    fragColor = vec4(col, 1.0);
}`