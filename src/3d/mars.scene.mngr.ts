import {Mars3DContext, MarsModelService} from "../service/mars.model.service";
import {MarsBodyMngr} from "./mars.body.mngr";
import {MarsJointMngr} from "./mars.joint.mngr";
import {MarsEventService} from "../service/mars.event.service";

declare const THREE;

export class MarsSceneMngr {
  private continueRun:boolean = false;
  private pickEnable:boolean = true;
  private selectedTips:boolean = false;


  private container:any = null;
  private clock = new THREE.Clock();

  private mars3DContext:Mars3DContext = null;
  private bodyMngr:MarsBodyMngr = null;
  private jointMngr:MarsJointMngr = null;

  private root:any = null;
  private renderer:any = null;
  private scene:any = null;
  private camera:any = null;
  private raycast:any = null;
  private orbitControl:any = null;
  private INTERSECTED:any = null;


  public constructor() {
    let renderer = null;

    try {
      renderer = new THREE.WebGLRenderer({
          antialias:true,       //是否开启反锯齿
          precision:"highp",    //着色精度选择
          alpha:true,           //是否可以设置背景色透明
          premultipliedAlpha:false,
          stencil:false,
          preserveDrawingBuffer:true, //是否保存绘图缓冲
      });

    } catch (exception) {
      renderer = new THREE.CanvasRenderer();
    }

    renderer.setSize(400, 400);
    renderer.setClearColor(0x083B4F);

    let scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x404040));
    let light = new THREE.DirectionalLight(0xffffff, 1, 0);

    light.position.set(10,10,10);
    scene.add(light);

    let camera = new THREE.PerspectiveCamera(60.0, 400 / 400, 0.1, 10000.0);
    camera.position.set(0,100,300);
    camera.lookAt({x:0,y:0,z:0});
    scene.add(camera);


    let ctrl = new THREE.OrbitControls(camera,renderer.domElement);
    ctrl.target = new THREE.Vector3(0,0,0);



    let root = new THREE.Group();
    scene.add(root);
    root.position.set(0, -100, 0);
    root.scale.set(0.25,0.25,0.25);

    let helper = new THREE.GridHelper( 1200, 60, 0x444444, 0x404040 );
    scene.add( helper );
    helper.position.set(0, -110, 0);

    let rayCast = new THREE.Raycaster();

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.root = root;
    this.raycast = rayCast;
    this.orbitControl = ctrl;


    //this.createFloor();

    window.addEventListener("resize",this.onWindowResize.bind(this),false);
    this.renderer.domElement.addEventListener( 'touchstart', this.onTouchStart.bind(this), false );
    this.renderer.domElement.addEventListener( 'touchend', this.onTouchEnd.bind(this), false );
    this.renderer.domElement.addEventListener( 'touchmove', this.onTouchMove.bind(this), false );

    this.renderer.domElement.addEventListener("click",this.onMouseClick.bind(this),false);
    return;
  }


  private createFloor():any{
    let that:any = this;

    let loader:any = new THREE.TextureLoader();
    loader.load("./assets/model/FloorsCheckerboard_S_Diffuse.jpg",
      function(texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        let floorGeometry:any = new THREE.BoxGeometry(1600, 1100, 1);
        let floorMaterial:any = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
        let floor = new THREE.Mesh(floorGeometry, floorMaterial);

        floor.position.y = -98;
        floor.rotation.x = Math.PI / 2;

        that.scene.add(floor);
      }
    )
  }


  private onTouchStart( event:any ) {
    return;
  }

  private onTouchEnd(event:any) {
    return;
  }

  private onTouchMove(event:any) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }



  private onWindowResize() {
    console.log("onWindowResize....");

    if (this.container == null) {
      return;
    }

    this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);

    if (this.orbitControl) {
      this.orbitControl.reset();

    }

  }


  private pickObjectFromMouse(mouse:any) {
    this.raycast.setFromCamera(mouse, this.camera);
    let interSectors = this.raycast.intersectObjects(this.scene.children, true);

    if (interSectors && (interSectors.length > 0)) {
      return interSectors[0].object;
    }
    return null;
  }

  private rayCastInfoFromMouse(mouse:any):any {
    this.raycast.setFromCamera(mouse, this.camera);
    let interSectors = this.raycast.intersectObjects(this.scene.children, true);

    if (interSectors && (interSectors.length > 0)) {
      return interSectors[0];
    }
    return null;
  }


  private onMouseClick(evt:any) {
    evt.preventDefault();

    if (this.container == null) {
      return;
    }

    if (this.pickEnable == false) {
      return;
    }

    let rect = this.container.getBoundingClientRect();

    let mouse = new THREE.Vector2();
    mouse.x = (evt.clientX - rect.left) / this.container.offsetWidth * 2 - 1;
    mouse.y = -((evt.clientY - rect.top) / this.container.offsetHeight) * 2 + 1;
    let meshPicker = this.pickObjectFromMouse(mouse);
    let obj:any = null;

    if (meshPicker) {
        obj = this.rayCastInfoFromMouse(mouse);
    }

    if ((evt.altKey) && (evt.shiftKey)) {//射线检测处理

    } else if (evt.shiftKey) {//重新将模块加入到场景

    } else if (evt.altKey) {//将模块从场景中移除
      /*

      if ( this.INTERSECTED && this.INTERSECTED.material && this.INTERSECTED.material.emissive)  {
        this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
      }
      this.INTERSECTED = null;

      if (meshPicker && (meshPicker.parent != null)) {
        meshPicker.parent.remove(meshPicker);
      }*/

    } else {//选择处理
      /*
      MarsEventService.getSigleton().getEventHub().publish("raycast",obj);
      MarsEventService.getSigleton().getEventHub().publish("meshPicker",meshPicker);

      if (meshPicker) {
        try {
          if (this.INTERSECTED) {
            this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
          }

          this.INTERSECTED = meshPicker;
          this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
          this.INTERSECTED.material.emissive.setHex( 0xff0000 );
        } catch (e) {
        }
      } else {
        if ( this.INTERSECTED && this.INTERSECTED.material && this.INTERSECTED.material.emissive)  {
          this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
        }
        this.INTERSECTED = null;
      }
      */
    }
  }

  public resizeContainer() {
    this.onWindowResize();
  }



  private update() {
    let delta = this.clock.getDelta();
    this.bodyMngr.animationStep(delta);

  }


  private run(callback:Function) {
    let that = this;

    if (this.renderer != null) {
      this.update();
      this.renderer.render(this.scene,this.camera);
      if (this.continueRun) {
        requestAnimationFrame(function () {
          that.run(callback);
        });
      }
    }
  }

  public startRun() {
    if (this.continueRun) {
      return;
    }

    this.continueRun = true;
    let that = this;

    requestAnimationFrame(function () {
      that.run(null);
    });
  }


  public stopRun() {
    this.continueRun = false;
  }



  public attach2DOMNode(domNode:any) {
    this.container = domNode;
    this.container.appendChild(this.renderer.domElement);
    this.onWindowResize();
  }


  public setMars3DContext(mars3dContext:Mars3DContext) {
    if (mars3dContext != null) {
      if (mars3dContext.attachNode.parent != this.root) {
        this.root.add(mars3dContext.attachNode);
      }

      this.bodyMngr = mars3dContext.bodyMngr;
      //this.jointMngr = mars3dContext.jointMngr;
      this.mars3DContext = mars3dContext;

    } else {
      this.removeMars3DModel();

    }

  }

  public removeMars3DModel() {
    if (this.mars3DContext != null) {
      this.root.remove(this.mars3DContext.attachNode);
    }
  }

  public resetScene() {
    if (this.orbitControl) {
      this.orbitControl.enabled = true;

      this.orbitControl.reset();
     }
   }

  public setCameraPos(z_pos:number) {
    this.camera.position.set(0,100,z_pos);
  }


  public enableOrbit(enable:boolean):void {
    if (this.orbitControl) {
      this.orbitControl.enabled = enable;
    }
  }

  public enablePickObject(enable:boolean):void {
    this.pickEnable = enable;

  }

  public cleanScene() {
    if (this.jointMngr) {

    }


    this.mars3DContext = null;
    this.jointMngr = null;
    this.bodyMngr = null;
    this.container = null;
    this.root = null;

    this.INTERSECTED = null;

    this.renderer = null;
    this.camera = null;
    this.clock = null;
    this.raycast = null;
    this.scene = null;

    window.removeEventListener("resize",this.onWindowResize.bind(this),false);


    return;
  }


  public world2Screen(point:any) {
    let pt = new THREE.Vector3(point.x,point.y,point.z);

    let halfWidth = this.container.offsetWidth / 2;
    let halfHeight = this.container.offsetHeight/ 2;

    let t_point = pt.project(this.camera);

    return {
      x: Math.round(t_point.x * halfWidth + halfWidth),
      y: Math.round(-t_point.y * halfHeight + halfHeight)
    };
  }


  private getCoornidates():any {
    let x_material = new THREE.LineBasicMaterial({
      color: 0xFF0000
    });

    let y_material = new THREE.LineBasicMaterial({
      color: 0xFF0000
    });

    let z_material = new THREE.LineBasicMaterial({
      color: 0xFF0000
    });

    let coordinate = new THREE.Group();

    //x 轴
    let x_geometry = new THREE.Geometry();
    x_geometry.vertices.push(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 10000, 0, 0 ),
    );
    let  x_line = new THREE.Line( x_geometry, x_material );


    //y 轴
    let y_geometry = new THREE.Geometry();
    y_geometry.vertices.push(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 0, 10000, 0 ),
    );
    let  y_line = new THREE.Line( y_geometry, y_material );
    //z 轴
    let z_geometry = new THREE.Geometry();
    z_geometry.vertices.push(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 0, 0, 10000 ),
    );
    let  z_line = new THREE.Line( z_geometry, z_material );



    coordinate.add(x_line);
    coordinate.add(y_line);
    coordinate.add(z_line);

    return coordinate;
  }




}
