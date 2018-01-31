import {Injectable} from "@angular/core";
import {MarsBodyMngr} from "../3d/mars.body.mngr";
import {MarsJointMngr} from "../3d/mars.joint.mngr";
import {MarsSceneMngr} from "../3d/mars.scene.mngr";


declare let THREE;

export class Mars3DContext {
  public attachNode:any = null;
  public bodyMngr:MarsBodyMngr = null;
  public sceneMngr:MarsSceneMngr = null;


  public  constructor() {
    this.bodyMngr = null;
    this.sceneMngr = null;
  }


}


@Injectable()
export class MarsModelService {
  private mars3DContext:Mars3DContext = null;
  private emulator3DContext:Mars3DContext = null;
  private scaleNode:any = null;


  public constructor () {
    this.mars3DContext = null;
    this.emulator3DContext = null;

  }


  private loadEmulator3DContext():Promise<Mars3DContext> {
    let that = this;
    let promise = new Promise<Mars3DContext>((resolve, reject) => {
      if (that.emulator3DContext) {
        resolve(that.emulator3DContext);
      } else {
        let onModelLoadProgress = function (resp) {
          console.log("mars:" + resp);
        };

        let onModelLoadError = function (resp) {
          console.log("mars:" + resp);
          reject("模型加载错误")
        };

        let attachRoot = new THREE.Group();
        attachRoot.position.set(0, 0, 0);

        let mngr = new THREE.LoadingManager();
        mngr.onProgress = function (item,loaded,total) {
          console.log("mars:" + item + "  " + loaded + "  " + total);
        };

        let loader = new THREE.TextureLoader();
        loader.load("./assets/model/robot_Diffuse.png",function (texture) {
          let meshIndex = 1;
          let mesh_loader = new THREE.OBJLoader(mngr);
          mesh_loader.load("./assets/model/R.obj",function (obj) {
            obj.traverse( function ( child ) {
              if ( child instanceof THREE.Mesh ) {
                child.material.map = texture;
                child.meshIndex = meshIndex ++;
              }
            });

            let bodyMngr = new MarsBodyMngr(obj);
            let sceneMngr = new MarsSceneMngr();
            let mars3DContext = new Mars3DContext();

            bodyMngr.addModel2Scene(attachRoot);

            mars3DContext.attachNode = attachRoot;
            mars3DContext.sceneMngr = sceneMngr;
            mars3DContext.bodyMngr = bodyMngr;
            that.emulator3DContext = mars3DContext;
            sceneMngr.setMars3DContext(mars3DContext);
            resolve(mars3DContext);

          },onModelLoadProgress, onModelLoadError);
        });
      }
    });

    return promise;
  }



  private loadRobotModel():Promise<Mars3DContext> {
    let that = this;

    let promise = new Promise<Mars3DContext>((resolve, reject) => {
      if (that.mars3DContext) {
        resolve(that.mars3DContext);
      } else {
        let onModelLoadProgress = function (resp) {
          console.log("mars:" + resp);
        };

        let onModelLoadError = function (resp) {
          console.log("mars:" + resp);
          reject("模型加载错误")
        };

        let attachRoot = new THREE.Group();
        attachRoot.position.set(0, 0, 0);

        let mngr = new THREE.LoadingManager();
        mngr.onProgress = function (item,loaded,total) {
          console.log("mars:" + item + "  " + loaded + "  " + total);
        };

        let loader = new THREE.TextureLoader();
        loader.load("./assets/model/robot_Diffuse.png",function (texture) {
          let meshIndex = 1;
          let mesh_loader = new THREE.OBJLoader(mngr);
          mesh_loader.load("./assets/model/R.obj",function (obj) {
            obj.traverse( function ( child ) {
              if ( child instanceof THREE.Mesh ) {
                child.material.map = texture;
                child.meshIndex = meshIndex ++;
              }
            });

            let bodyMngr = new MarsBodyMngr(obj);
            let sceneMngr = new MarsSceneMngr();
            let mars3DContext = new Mars3DContext();

            bodyMngr.addModel2Scene(attachRoot);

            mars3DContext.attachNode = attachRoot;
            mars3DContext.sceneMngr = sceneMngr;
            mars3DContext.bodyMngr = bodyMngr;

            that.mars3DContext = mars3DContext;
            sceneMngr.setMars3DContext(mars3DContext);

            resolve(mars3DContext);

            /*

            that.asyncLoadScale().then(function (scal_node) {
              mars3DContext.attachNode.add(scal_node);
              resolve(mars3DContext);

            },function (msg) {
              resolve(mars3DContext);
            });*/



          },onModelLoadProgress, onModelLoadError);
        });
      }
    });

    return promise;
  }


  private loadScale():Promise<any> {
    let that = this;


    let promise = new Promise<any>((resolve, reject)=>{
      if (that.scaleNode != null) {
        resolve(that.scaleNode);
      } else {
        let onModelLoadProgress = function (resp) {
          console.log("mars:" + resp);
        };

        let onModelLoadError = function (resp) {
          console.log("mars:" + resp);
        };

        let mngr = new THREE.LoadingManager();
        mngr.onProgress = function () {
        };

        let loader = new THREE.TextureLoader();
        loader.load("./assets/model/1.png",function (texture) {
          let meshIndex = 1;
          let mesh_loader = new THREE.OBJLoader(mngr);
          mesh_loader.load("./assets/model/xiantiao.obj",function (obj) {
            resolve(obj);

          },onModelLoadProgress, onModelLoadError);
        });
      }

    });
    return promise;
  }


  public async asyLoadMarsRobotModule():Promise<Mars3DContext> {
    let context = await this.loadRobotModel();
    return context;

  }



  public async asyncLoadEmulator3DContext():Promise<Mars3DContext> {
    let context = await this.loadEmulator3DContext();
    return context;
  }


  public async asyncLoadScale():Promise<any> {
    let context = await this.loadScale();
    return context;
  }

}
