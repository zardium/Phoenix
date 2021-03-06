#version 330 core

in vec3 pass_UV;
in vec3 pass_normal;
flat in uint pass_color;
// in vec3 pass_pos;

uniform sampler2DArray u_TexArray;
uniform float u_AmbientStrength;
uniform vec3 u_LightDir;
uniform float u_Brightness;

out vec4 out_FragColor;

void main()
{
	int color_i = int(pass_color);
	/*
		color_i = (binary) rrrrggggbbbbaaaa
		r => bits needed for the red component
		g => bits needed for the green component
		b => bits needed for the blue component
		a => bits needed for the alpha component
	*/
	float lightIntensity = float((color_i & 15)) / 15.0;
	vec4 objectColor = vec4(
		float((color_i & 61440) >> 12) / 15.0,
		float((color_i & 3840)  >> 8 ) / 15.0,
		float((color_i & 240)   >> 4 ) / 15.0,
		1.0
	);

	const vec3 lightColor = vec3(1.0, 1.0, 1.0);

	// -- ambient lighting --
	vec3 ambient = u_AmbientStrength * lightColor;

	// -- diffuse lighting --

	// assuming we don't need normalize(pass_normal) because
	// vectors are pre normalized
	vec3 norm = pass_normal;
	vec3 lightDir = normalize(-u_LightDir);

	float diff = max(dot(norm, lightDir), 0.0);
	vec3 diffuse = diff * lightColor;

	// -- output color --

	vec4 result = vec4(ambient, 1.0) + vec4(diffuse, 1.0) * objectColor * lightIntensity;
	out_FragColor = result * texture(u_TexArray, pass_UV) * u_Brightness;
}
