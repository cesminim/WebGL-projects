var cubieDiffSpecVS = `#version 300 es

precision highp float;

layout (location=0) in vec3 vertexPos;
layout (location=1) in vec3 vertexNormal;
layout (location=2) in vec4 vertexColor;
layout (location=3) in mat4 model;

out vec4 v_Col;
out vec3 v_FragPos;
out vec3 v_Normal;

uniform mat4 view;
uniform mat4 projection;

void main()
{
    mat4 vm =  view * model;

    v_FragPos = vec3( vm * vec4(vertexPos,    1.0) );
    v_Normal  = vec3( vm * vec4(vertexNormal, 0.0) );
    v_Col = vertexColor / 255.;

    gl_Position = projection * vm * vec4( vertexPos, 1.0 );
}
`

var cubieDiffSpecFS = `#version 300 es

precision highp float;

in vec4 v_Col;
in vec3 v_FragPos;
in vec3 v_Normal;

out vec4 fragColor;

uniform vec3 viewPos;
uniform vec2 resolution;
uniform float time;

void main()
{
    vec3 lightPos = vec3(50., 50.,  50.);

    vec3 color = v_Col.rgb;

    // ambient
    vec3 ambient = 0.05 * color;

    // diffuse
    vec3 lightDir = normalize(lightPos - v_FragPos);
    vec3 normal = normalize(v_Normal);
    float diff = max(dot(lightDir, normal), 0.0);
    vec3 diffuse = diff * color;

    // specular
    vec3 viewDir = normalize(viewPos - v_FragPos);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = 0.0;

    
    vec3 halfwayDir = normalize(lightDir + viewDir);  
    spec = pow(max(dot(normal, halfwayDir), 0.0), 32.0);
    
    vec3 specular = vec3(0.3) * spec; // assuming bright white light color
    fragColor = vec4(ambient + diffuse + specular, 1.0); 
}`