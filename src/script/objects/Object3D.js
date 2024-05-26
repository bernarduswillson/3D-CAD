import Matrix4 from "../math/Matrix4.js";
import Vector3 from "../math/Vector3.js";

class Object3D {
  constructor() {
    this._name = "Object3D";
    this._position = new Vector3;
    this._rotation = new Vector3;
    this._scale = new Vector3(1, 1, 1);
    this._localMatrix = Matrix4.identity();
    this._worldMatrix = Matrix4.identity();
    this._parent = null;
    this._children = [];
    this.visible = true;
    this._type = "Object3D";
  }

  // Public getter
  get position() { return this._position; }
  get rotation() { return this._rotation; }
  get scale() { return this._scale; }
  get parent() { return this._parent; }
  get localMatrix() { return this._localMatrix; }
  get worldMatrix() { return this._worldMatrix; }
  get children() { return this._children; }

  // Public setter
  set parent(parent) {
    if (this._parent !== parent) {
      this._parent = parent;
      this.computeWorldMatrix(false, true);
    }
  }
  set type(type) { this._type = type; }

  get worldPosition() {
    this.computeWorldMatrix(true, false);
    return Matrix4.getTranslation(this._worldMatrix);
  }

  // Compute local matrix
  computeLocalMatrix() {
    const translationMatrix = Matrix4.translation(...this._position.toArray());
    const rotationMatrix = Matrix4.rotation(...this._rotation.toArray());
    const scaleMatrix = Matrix4.scale(...this._scale.toArray());

    this._localMatrix = translationMatrix.premul(rotationMatrix).premul(scaleMatrix);
  }

  // Compute world matrix
  computeWorldMatrix(updateParent = true, updateChildren = true) {
    if (updateParent && this.parent)
      this.parent.computeWorldMatrix(true, false);
    this.computeLocalMatrix();
    if (this.parent) {
      this._worldMatrix = this.parent.worldMatrix.premul(this._localMatrix);
    } else {
      this._worldMatrix = this._localMatrix.clone();
    }
    if (updateChildren)
      for (let i = 0; i < this._children.length; i++)
        this._children[i].computeWorldMatrix(false, true);
  }

  // Add child
  add(node) {
    if (node.parent !== this) {
      node.removeFromParent();
      node.parent = this;
    }
    this.children.push(node);

    return this;
  }

  // Remove child
  remove(node) {
    let index = this.children.indexOf(node);
    if (index !== -1) {
      this.children.splice(index, 1);
      node.parent = null;
    }

    return this;
  }

  // Remove from parent
  removeFromParent() {
    if (this.parent) this.parent.remove(this);

    return this;
  }

  //
  lookAt(target, up=Vector3.up()) {
    // TODO: Implement
  }

  localToWorld(vector) {
    // TODO: Implement
  }

  worldToLocal(vector) {
    // TODO: Implement
  }

  rotateOnWorldAxis(axis, angle) {
    // TODO: Implement
  }


  // Translate X
  translateX(x) {
    this._position._x = x;
    this.computeLocalMatrix();
  }

  // Translate Y
  translateY(y) {
    this._position._y = y;
    this.computeLocalMatrix();
  }

  // Translate Z
  translateZ(z) {
    this._position._z = z;
    this.computeLocalMatrix();
  }


  // Scale X
  scaleX(x) {
    this._scale._x = x;
    this.computeLocalMatrix();
  }

  // Scale Y
  scaleY(y) {
    this._scale._y = y;
    this.computeLocalMatrix();
  }

  // Scale Z
  scaleZ(z) {
    this._scale._z = z;
    this.computeLocalMatrix();
  }


  // Rotate X
  rotateX(x) {
    this._rotation._x = x;
    this.computeLocalMatrix();
  }

  // Rotate Y
  rotateY(y) {
    this._rotation._y = y;
    this.computeLocalMatrix();
  }

  // Rotate Z
  rotateZ(z) {
    this._rotation._z = z;
    this.computeLocalMatrix();
  }

  // Position
  setPosition(x, y, z) {
    this._position.set(x, y, z);
    this.computeLocalMatrix();
  }

  // Rotation
  setRotation(x, y, z) {
    this._rotation.set(x, y, z);
    this.computeLocalMatrix();
  }

  // Scale
  setScale(x, y, z) {
    this._scale.set(x, y, z);
    this.computeLocalMatrix();
  }


  getObjectByName(name) {
    if (this._name === name) return this;
    for (let child of this.children) {
      if (child._name === name) return child;
      if (child.children) {
        let found = child.getObjectByName(name);
        if (found) return found;
      }
    }
    return null;
  }

  getObjectByClassName(classname){
    let result = [];
    if(this instanceof classname){
      result.push(this);
    }
    for (let child of this.children) {
      if(child instanceof classname){
        result.push(child);
      }
    }
    return result;
  }

  // Traverse
  traverse(onLeaf=null) {
    if (onLeaf) onLeaf(this);
    for (let i = 0; i < this._children.length; i++)
      this._children[i].traverse(onLeaf);
  }


  // JSON parser
  toJSON() {
    return {
      name: this._name,
      position: this._position.toArray(),
      rotation: this._rotation.toArray(),
      scale: this._scale.toArray(),
      children: this._children.map((child) => child.toJSON()),
    };
  }

  static fromJSON(json, object=null) {
    if (!object) object = new Object3D();
    object._name = json.name;
    object._position = Vector3.fromJSON(json.position);
    object._rotation = Vector3.fromJSON(json.rotation);
    object._scale = Vector3.fromJSON(json.scale);
    return object;
  }
}

export default Object3D;
