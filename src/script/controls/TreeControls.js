import Object3D from "../objects/Object3D.js";
import BoxGeometry  from "../geometry/BoxGeometry.js";
import HollowBoxGeometry  from "../geometry/HollowBoxGeometry.js";
import HollowGearGeometry  from "../geometry/HollowGearGeometry.js";
import HollowPyramidGeometry  from "../geometry/HollowPyramidGeometry.js";
import HollowRingGeometry  from "../geometry/HollowRingGeometry.js";
import HollowStarGeometry  from "../geometry/HollowStarGeometry.js";
import BasicMaterial  from "../material/BasicMaterial.js";
import  Mesh  from "../objects/Mesh.js";
import { buildHTML } from "../webutils/treeLoader.js";

class TreeControls {
    constructor(scene) {
        this.scene = scene;
        this.object = null;
        
        this.addObjectEventListeners();
        this.removeObjectEventListeners();
        this.saveObjectEventListeners();
        this.loadObjectEventListeners();
        this.changeNameEventListeners();
    }

    setObject(object) {
        this.object = object;
    }

    addObjectEventListeners(){
        const addButton = document.getElementById("add-object");
        addButton.addEventListener("click", () => {
            
            const objectshape = document.getElementById("object-shape").value;
            let geometry, material, mesh;

            console.log(objectshape )

            switch(objectshape){
                case "box" :
                    geometry = new BoxGeometry(1, 1, 1);
                    break;
                
                case "hollowbox" :
                    geometry = new HollowBoxGeometry(1, 1, 1);
                    break;
                
                case "hollowgear" :
                    geometry = new HollowGearGeometry(1, 1, 1);
                    break;

                case "hollowpyramid" :
                    geometry = new HollowPyramidGeometry(1, 1, 1);
                    break;
                
                case "hollowring" :
                    geometry = new HollowRingGeometry(1, 1, 1);
                    break;
                
                case "hollowstar" :
                    geometry = new HollowStarGeometry(1, 1, 1);
                    break;
            } 
            material = new BasicMaterial([1,1,1,1]);
            mesh = new Mesh(geometry, material);
            mesh._name = "new object";
            
            this.object.add(mesh);
            buildHTML(this.scene.toJSON(), document.getElementById('container'));
        });
    }

    removeObjectEventListeners(){
        const removeButton = document.getElementById("delete-object");
        removeButton.addEventListener("click", () => {
            this.scene.remove(this.object);
            buildHTML(this.scene.toJSON(), document.getElementById('container'));
        });
    }

    saveObjectEventListeners(){
        const saveButton = document.getElementById("save-object");
        saveButton.addEventListener("click", () => {
            var jsonData = this.object.toJSON();
            var jsonString = JSON.stringify(jsonData);
            var blob = new Blob([jsonString], { type: 'application/json' });

            if ('showSaveFilePicker' in window) {
                const options = {
                    types: [{
                        description: 'JSON Files',
                        accept: {'application/json': ['.json']}
                    }],
                    suggestedName: 'exported_model.json'
                };
                window.showSaveFilePicker(options).then((handle) => {
                    handle.createWritable().then((writable) => {
                        // Event.event.preventDefault();
                        writable.write(blob).then(() => {
                            writable.close();
                            alert('File saved successfully.');
                        }).catch((error) => {
                            console.error('Failed to save file: ', error);
                            alert('Failed to save file.');
                        });
                    });
                }).catch((error) => {
                    console.error('Could not open file handle: ', error);
                    alert('Could not save file.');
                });
            } else {
                alert('The File System Access API is not supported by your browser.');
            }
        });
    }

    loadObjectEventListeners(){
        const loadButton = document.getElementById("load-object");
        loadButton.addEventListener("click", (event) => {
            // open file dialog
            var input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.onchange = (event) => {
                var file = event.target.files[0];
                var reader = new FileReader();
                console.log(reader);
                reader.onload = () => {
                    // this.importShapes(reader.result);
                    var jsonShapes = JSON.parse(reader.result);
                    var mesh = Mesh.fromJSON(jsonShapes);
                    this.object.add(mesh);

                    buildHTML(this.scene.toJSON(), document.getElementById('container'));
                };
                reader.readAsText(file);
            };
            input.click();
        });
    }

    changeNameEventListeners(){
        const renameForm = document.getElementById("rename-form");
        const shapenameInput = document.getElementById("shapename");

        renameForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent form from submitting the traditional way
            const newName = shapenameInput.value;

            // Update the shape's name
            this.object._name = newName;

            // Optionally, update the scene or any other elements
            buildHTML(this.scene.toJSON(), document.getElementById('container'));

            alert(`Shape renamed to: ${newName}`);
        });
    }
}

export default TreeControls;