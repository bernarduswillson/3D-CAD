import Object3D from './Object3D.js';
import BoxGeometry from '../geometry/BoxGeometry.js';
import PhongMaterial from '../material/PhongMaterial.js';
import BasicMaterial from '../material/BasicMaterial.js';
import HollowBoxGeometry from '../geometry/HollowBoxGeometry.js';
import PlaneGeometry from '../geometry/PlaneGeometry.js';
import HollowPyramidGeometry from '../geometry/HollowPyramidGeometry.js';
import HollowRingGeometry from '../geometry/HollowRingGeometry.js';
import HollowGearGeometry from '../geometry/HollowGearGeometry.js';
import HollowStarGeometry from '../geometry/HollowStarGeometry.js';

class Mesh extends Object3D {
  constructor(geometry, material) {
    super();
    this._geometry = geometry;
    this._material = material;
  }


  // JSON parser
  toJSON() {
    return {
      geometry: this._geometry,
      material: this._material,
      ...super.toJSON(),
    };
  }

  static fromJSON(json) {
    var geometry;
    // if(json.children.name == "Light"){

    // }
    // else{
      
    // }
    switch (json.geometry.type) {
      case "BoxGeometry":
        geometry = BoxGeometry.fromJSON(json.geometry);
        break;
      case "HollowBoxGeometry":
        geometry = HollowBoxGeometry.fromJSON(json.geometry);
        break;
      case "PlaneGeometry":
        geometry = PlaneGeometry.fromJSON(json.geometry);
        break;
      case "HollowPyramidGeometry":
        geometry = HollowPyramidGeometry.fromJSON(json.geometry);
        break;
      case "HollowRingGeometry":
        geometry = HollowRingGeometry.fromJSON(json.geometry);
        break;
      case "HollowGearGeometry":
        geometry = HollowGearGeometry.fromJSON(json.geometry);
        break;
      case "HollowStarGeometry":
        geometry = HollowStarGeometry.fromJSON(json.geometry);
        break;
      default:
        console.log("Geometry not found");
    }
    var material;
    switch (json.material.type) {
      case "PhongMaterial":
        material = PhongMaterial.fromJSON(json.material);
        break;
      case "BasicMaterial":
        material = BasicMaterial.fromJSON(json.material);
        break;
      default:
        console.log("Material not found");
    }

    const mesh = new Mesh(geometry, material);
    super.fromJSON(json, mesh);
    if (json && json.children) {
      json.children.map((child) => {
        const meshchild = Mesh.fromJSON(child);
        mesh.add(meshchild);
      });
    }
    return mesh;
  }
}

export default Mesh;