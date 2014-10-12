---
layout: post
title: Vertex shaders
---
I'm taking a graphics module covering opengl and GLSL so we get to
play with vertex shaders and the like. Anyway they're very kool!
Within a few lines I was able to get some very nice lighting effects
on my vertex's and I was very very happy.

Ok so its bit simple but I was doing lighting effects based on a unit
sphere and somewhat by trial and error I got a nice diffuse and
spectacular effect :)

Here's my little bit of code (and yes I know there is proper ways to
specify lights and materials in GLSL but we're not allowed to use them
for this coursework).

{% highlight glsl %}
#version 150
precision highp float;
in vec3 in_Position;
in vec3 in_Color;
uniform mat4 projmatrix;
uniform mat4 modelmatrix;
out vec4 ex_Color;
void main(void) {
  // Colours
  vec3 lightcolor = vec3(1, 1, 1);
  vec4 material_diffuse = vec4(0.7, 0.7, 0.7, 1);
  vec4 material_spec = vec4(0.7, 0.7, 0.7,1);

  // cent of a unit sphere
  vec4 cent = projmatrix * modelmatrix * vec4(0,0,0,1);
  gl_Position = projmatrix * modelmatrix * vec4(in_Position, 1.0);

  vec3 pos3 = vec3(gl_Position.x, gl_Position.y, gl_Position.z);
  vec4 lightpos4 = vec4(10, 0, 0,1);
  vec3 lightpos = vec3(lightpos4.x, lightpos4.y, lightpos4.z);

  vec3 normaldir = normalize(pos3 - vec3(cent.x, cent.y, cent.z));
  vec3 normaltolight = normalize(lightpos - pos3);

  float diffuse = dot(normaldir,normalize(lightpos));
  float spec = pow(max(dot(normaldir, normaltolight),0.0), 10);

  ex_Color = vec4(0.01,0.01,0.01,1) +
    vec4(diffuse, diffuse, diffuse,1)*material_diffuse*vec4(lightcolor,1) +
    vec4(spec, spec, spec, 1)*material_spec*vec4(lightcolor, 1);
}
{% endhighlight %}
