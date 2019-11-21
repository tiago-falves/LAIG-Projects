#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	float radius = sqrt((vTextureCoord.x - 0.5)*(vTextureCoord.x - 0.5) + (vTextureCoord.y - 0.5)*(vTextureCoord.y - 0.5));
	float radialEffect = (1.0 - radius*1.45);
	float alpha = 1.0;

	vec4 increasement = vec4(0.2,0.2,0.2,0);
	
	if(mod((vTextureCoord.y + mod(timeFactor, 60.0))*60.0, 10.0) > 5.0)
		color = vec4(color + increasement);

	gl_FragColor = vec4(color.rgb * radialEffect, alpha);
}


