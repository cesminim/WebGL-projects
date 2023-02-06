var cubiePBR_VS = `#version 300 es

precision highp float;

layout (location=0) in vec3 vertexPos;
layout (location=1) in vec3 vertexNormal;
layout (location=2) in vec4 vertexColor;
layout (location=3) in mat4 model;

out vec4 v_Col;
out vec3 v_Pos;
out vec3 v_Normal;

uniform mat4 view;
uniform mat4 projection;

void main()
{
    v_Col = vertexColor / 255.;
    gl_Position = projection * view * model * vec4(vertexPos, 1.0);
}
`

var cubiePBR_FS = `#version 300 es

precision highp float;

in vec4 v_Col;
in vec3 v_Pos;
in vec3 v_Normal;

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;
uniform vec3 camPos;

// material parameters
float metallic = 0.9;
float roughness = 0.8;

// lights
vec3 lightPos = vec3(10.);

#define PI (3.14159265359)

vec3 fresnelSchlick(float cosTheta, vec3 F0)
{
    return F0 + (1.0 - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);
} 

float DistributionGGX(vec3 N, vec3 H, float roughness)
{
    float a      = roughness*roughness;
    float a2     = a*a;
    float NdotH  = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;
	
    float num  = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;
	
    return num / denom;
}

float GeometrySchlickGGX(float NdotV, float roughness)
{
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;

    float num   = NdotV;
    float denom = NdotV * (1.0 - k) + k;
	
    return num / denom;
}
float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
{
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2  = GeometrySchlickGGX(NdotV, roughness);
    float ggx1  = GeometrySchlickGGX(NdotL, roughness);
	
    return ggx1 * ggx2;
}

void main()
{		
    vec3 N = normalize(v_Normal);
    vec3 V = normalize(camPos - v_Pos);

    vec3 F0 = vec3(0.04); // 63, 64 ish
    F0 = mix(F0,  v_Col.xyz, metallic);
	           
    // reflectance equation
    vec3 Lo = vec3(0.0);
    for(int i = 0; i < 4; ++i) 
    {
        // calculate per-light radiance
        vec3 L = normalize(lightPos - v_Pos);
        vec3 H = normalize(V + L);
        float distance = length(lightPos - v_Pos);
        float attenuation = 1.0 / (distance * distance);
        vec3 radiance = vec3(1.) * attenuation; // lightCol        
        
        // cook-torrance brdf
        float NDF = DistributionGGX(N, H, roughness);        
        float G   = GeometrySmith(N, V, L, roughness);      
        vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);       
        
        vec3 kS = F;
        vec3 kD = vec3(1.0) - kS;
        kD *= 1.0 - metallic;	  
        
        vec3 numerator    = NDF * G * F;
        float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0);
        vec3 specular     = numerator / max(denominator, 0.001);  
            
        // add to outgoing radiance Lo
        float NdotL = max(dot(N, L), 0.0);                
        Lo += (kD *  v_Col.xyz / PI + specular) * radiance * NdotL; 
    }   
  
    vec3 ambient = vec3(0.3) *  v_Col.xyz;
    vec3 color = ambient + Lo;
	
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0/2.2));  
   
    fragColor = vec4(color, 1.0);
}`