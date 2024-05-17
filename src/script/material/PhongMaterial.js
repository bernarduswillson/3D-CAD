import ShaderMaterial from './ShaderMaterial.js';
import Vector3 from '../math/Vector3.js';
import { vertexShaderSourcePhong, fragmentShaderSourcePhong } from "../webgl/Shaders.js";
import Texture from './Texture.js';

class PhongMaterial extends ShaderMaterial {
  constructor(options={}) {
    const { shininess = 32, lightPosition = new Vector3(20, 100, 300), ambient = [1, 1, 1, 1], diffuse = [1, 1, 1, 1], specular = [1, 1, 1, 1], texture = null } = options;
    const textureOption = texture ? 1 : 0;
    super({shininess: shininess, lightPosition: lightPosition, ambient: ambient, diffuse: diffuse, specular: specular, textureOption: textureOption, sampler: 0});
    this._shininess = shininess;
    this._lightPosition = lightPosition;
    this._ambient = ambient;
    this._diffuse = diffuse;
    this._specular = specular;
    this._textureOption = textureOption;
    this._sampler = 0;
    this._texture = texture;

    this._vertexShader = vertexShaderSourcePhong;
    this._fragmentShader = fragmentShaderSourcePhong;
  }

  // Public getters
  get ambient() { return this._ambient; }
  get diffuse() { return this._diffuse; }
  get specular() { return this._specular; }
  get shininess() { return this._shininess; }
  get lightPosition() { return this._lightPosition; }
  get texture() { return this._texture; }

  // Public setters
  set ambient(ambient) { this._ambient = ambient; }
  set diffuse(diffuse) { this._diffuse = diffuse; }
  set specular(specular) { this._specular = specular; }
  set shininess(shininess) { this._shininess = shininess; }
  set lightPosition(lightPosition) { this._lightPosition = lightPosition; }
  set texture(texture) { this._texture = texture; }

  // JSON parser
  toJSON() {
    return {
      ambient: this.ambient,
      diffuse: this.diffuse,
      specular: this.specular,
      shininess: this.shininess,
      texture: this.texture ? this.texture.toJSON() : null,
      type: "PhongMaterial",
      ...super.toJSON(),
    };
  }

  static fromJSON(json) {
    const texture = json.texture ? Texture.fromJSON(json.texture) : null;
    const material = new PhongMaterial({
      shininess: json.shininess, 
      lightPosition: json.lightPosition, 
      ambient: json.ambient, 
      diffuse: json.diffuse, 
      specular: json.specular, 
      texture: texture
  });  
    super.fromJSON(json, material);
    return material;
  }
}

export default PhongMaterial;
