import ShaderMaterial from './ShaderMaterial.js';
import Vector3 from '../math/Vector3.js';
import { vertexShaderSourcePhong, fragmentShaderSourcePhong  } from '../webgl/Shaders.js';
import Texture from '../texture/Texture.js';
import Mesh from '../objects/Mesh.js';
import BumpTexture from '../texture/BumpTexture.js';
import EnvironmentTexture from '../texture/EnvironmentTexture.js';
import WebGLRenderer from '../webgl/WebGLRenderer.js';

class PhongMaterial extends ShaderMaterial {
  constructor(options={}) {
    const { 
      shininess = 32, 
      ambient = [1, 1, 1, 1], 
      diffuse = {
        color: [1, 1, 1, 1], 
        texture: null
      },
      specular = {
        color: [1, 1, 1, 1],
        texture: null
      },
      displacement = null,
      normal = null,
      environment = null,
      textureOption = 0,
      textureType = 'off'
    } = options;

    const normalMap = 0;
    const displacementMap = 1;
    const diffuseMap = 2;
    const specularMap = 3;
    const environmentMap = 4;

    const vertexShaderSource = vertexShaderSourcePhong;
    const fragmentShaderSource = fragmentShaderSourcePhong;

    super({shininess: shininess, ambient: ambient, diffuse: diffuse, specular: specular, displacement: displacement, normal: normal, environment: environment, textureOption: textureOption, normalMap: normalMap, displacementMap: displacementMap, diffuseMap: diffuseMap, specularMap: specularMap, environmentMap: environmentMap});
    this._shininess = shininess;
    this._ambient = ambient;
    this._diffuse = diffuse;
    this._specular = specular;
    this._displacement = displacement;
    this._normal = normal;
    this._environment = environment;
    this._textureOption = textureOption;
    this._normalMap = normalMap;
    this._displacementMap = displacementMap;
    this._diffuseMap = diffuseMap;
    this._specularMap = specularMap;
    this._environmentMap = environmentMap;
    this._textureType = textureType;

    this._vertexShader = vertexShaderSource;
    this._fragmentShader = fragmentShaderSource;
  }

  // Public getters
  get ambient() { return this._ambient; }
  get diffuse() { return this._diffuse; }
  get specular() { return this._specular; }
  get shininess() { return this._shininess; }

  // Public setters
  set ambient(ambient) { this._ambient = ambient; }
  set diffuse(diffuse) { this._diffuse = diffuse; }
  set specular(specular) { this._specular = specular; }
  set shininess(shininess) { this._shininess = shininess; }

  setTextures(texture) {
    if (texture) {
      this._diffuse.texture = texture._diffuseTexture;
      this._specular.texture = texture._specularTexture;
      this._displacement = texture._bumpTexture;
      this._normal = texture._normalTexture;
    } else {
      this._diffuse.texture = null;
      this._specular.texture = null;
      this._displacement = null;
      this._normal = null;
    }
  }

  // JSON parser
  toJSON() {
    return {
      shininess: this.shininess,
      ambient: this.ambient,
      diffuse: this.diffuse,
      specular: this.specular,
      texture: this.texture ? this.texture.toJSON() : null,
      displacement: this.displacement,
      normal: this.normal,
      environment: this.environment,
      textureOption: this._textureOption,
      textureType: this._textureType,
      type: "PhongMaterial",
      ...super.toJSON(),
    };
  }

  static fromJSON(json) {
    var texture;
    if (json.texture){
      switch (json.texture.type) {
        case "BumpTexture":
          texture = BumpTexture.fromJSON(json.texture);
          break;
        case "EnvironmentTexture":
          texture = EnvironmentTexture.fromJSON(json.texture);
          break;
        default:
          texture = null;
          console.log("Texture not found");
      }
    } else {
      texture = null;
    }
    const material = new PhongMaterial({
      shininess: json.shininess, 
      ambient: json.ambient, 
      diffuse: json.diffuse, 
      specular: json.specular, 
      texture: texture,
      textureOption: json.textureOption,
      displacement: json.displacement,
      normal: json.normal,
      environment: json.environment,
      textureType: json.textureType
    });  
    super.fromJSON(json, material);
    return material;
  }
}

export default PhongMaterial;
