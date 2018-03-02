import {Mars3DContext, MarsModelService} from "../service/mars.model.service";
import {MarsBodyMngr, MarsBodyPart} from "./mars.body.mngr";
import {MarsJointMngr} from "./mars.joint.mngr";

declare const THREE;
declare const Stats;
declare const Ammo;

export class MarsSceneMngr {
  private rigidBodies = [];
  private softBodies = [];
  private mouseCoords = new THREE.Vector2();
  private ballMaterial = new THREE.MeshPhongMaterial( { color: 0x202020 });

  private physicsWorld:any = null;

  private stats:any = null;
  private continueRun:boolean = false;
  private pickEnable:boolean = true;


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
    camera.position.set(-17.9,1020,1514);
    camera.quaternion.set(-0.2920,  -0.005653,  -0.0017266, 0.95637);
    scene.add(camera);


    let ctrl = new THREE.OrbitControls(camera,renderer.domElement);
    ctrl.target = new THREE.Vector3(0,0,0);



    let root = new THREE.Group();
    scene.add(root);
    //root.position.set(0, -100, 0);
    root.position.set(0, -98, 0);
    //root.scale.set(0.1,0.1,0.1);
    root.scale.set(1,1,1);

    let rayCast = new THREE.Raycaster();

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.root = root;
    this.raycast = rayCast;
    this.orbitControl = ctrl;

    this.stats = new Stats();

    this.stats.domElement.style.position = 'absolute'; //绝对坐标
    this.stats.domElement.style.left = '0px';         // (0,0)px,左上角
    this.stats.domElement.style.top = '0px';

    window.addEventListener("resize",this.onWindowResize.bind(this),false);

    this.renderer.domElement.addEventListener( 'touchmove', this.onTouchMove.bind(this), false );
    this.renderer.domElement.addEventListener("click",this.onMouseClick.bind(this),false);

    this.initPhysics();
    this.initInput();
    this.createFloor2();

    //this.createObjects();
    this.createObjects2();

    return;
  }


  private createFloor2():void {
    let pos = new THREE.Vector3();
    let quat = new THREE.Quaternion();

    // Ground
    pos.set( 0, - 100, 0 );
    quat.set( 0, 0, 0, 1 );

    let ground = this.createParalellepiped(8000,
      2,
      8000,
      0,
      pos,
      quat,
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF }));

    ground.castShadow = true;
    ground.receiveShadow = true;

    let loader:any = new THREE.TextureLoader();
    loader.load("./assets/model/hardwood2_diffuse.jpg",
      function(texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = 4;
        texture.repeat.set(5, 12);

        ground.material.map = texture;
        ground.material.needsUpdate = true;
      });
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
    if (this.bodyMngr) {
      this.bodyMngr.animationStep(delta);
    }

    this.stats.update();
    this.updatePhysics(delta);

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
    this.container.appendChild(this.stats.dom);
    this.container.appendChild(this.renderer.domElement);
    this.onWindowResize();
  }


  public setMars3DContext(mars3dContext:Mars3DContext) {
    let that = this;

    if (mars3dContext != null) {

      if (mars3dContext.attachNode.parent != this.root) {
        this.root.add(mars3dContext.attachNode);
      }

      this.bodyMngr = mars3dContext.bodyMngr;
      this.mars3DContext = mars3dContext;

      setTimeout(()=>{
        that.initBodyPhysics();

      },50);
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

  private initPhysics() {
    let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    let dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    let broadphase = new Ammo.btDbvtBroadphase();
    let solver = new Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
    //this.physicsWorld = new Ammo.btSoftRigidDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
    this.physicsWorld.setGravity(new Ammo.btVector3(0, -37.8 * 10, 0));

    //this.physicsWorld.getWorldInfo().set_m_gravity(new Ammo.btVector3(0, -37.9, 0));
  }



  private updatePhysics(deltaTime:number) {
    this.physicsWorld.stepSimulation(deltaTime, 15);

    // Update soft volumes
    for ( let i = 0, il = this.softBodies.length; i < il; i++ ) {
      let volume = this.softBodies[ i ];
      let geometry = volume.geometry;
      let softBody = volume.userData.physicsBody;
      let volumePositions = geometry.attributes.position.array;
      let volumeNormals = geometry.attributes.normal.array;
      let association = geometry.ammoIndexAssociation;
      let numVerts = association.length;
      let nodes = softBody.get_m_nodes();

      for ( let j = 0; j < numVerts; j ++ ) {
        let node = nodes.at( j );
        let nodePos = node.get_m_x();
        let x = nodePos.x();
        let y = nodePos.y();
        let z = nodePos.z();
        let nodeNormal = node.get_m_n();
        let nx = nodeNormal.x();
        let ny = nodeNormal.y();
        let nz = nodeNormal.z();

        let assocVertex = association[ j ];

        for ( let k = 0, kl = assocVertex.length; k < kl; k++ ) {
          let indexVertex = assocVertex[ k ];
          volumePositions[ indexVertex ] = x;
          volumeNormals[ indexVertex ] = nx;
          indexVertex++;
          volumePositions[ indexVertex ] = y;
          volumeNormals[ indexVertex ] = ny;
          indexVertex++;
          volumePositions[ indexVertex ] = z;
          volumeNormals[ indexVertex ] = nz;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.normal.needsUpdate = true;

    }

    let transformAux1 = new Ammo.btTransform();

    for (let i = 0, il = this.rigidBodies.length; i < il; i++ ) {
      let objThree = this.rigidBodies[i];
      let objPhys = objThree.userData.physicsBody;
      let ms = objPhys.getMotionState();

      if ( ms ) {
        ms.getWorldTransform( transformAux1 );
        let p = transformAux1.getOrigin();
        let q = transformAux1.getRotation();
        objThree.position.set( p.x(), p.y(), p.z() );
        objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );
        objThree.userData.collided = false;
      }
    }
  }

  private  initInput() {
    let that = this;
    let pos = new THREE.Vector3();
    let quat = new THREE.Quaternion();

    window.addEventListener('mousedown', function(event) {
      if (!event.shiftKey) {
        return;
      }

      that.mouseCoords.set((event.clientX / window.innerWidth ) * 2 - 1, -(event.clientY / window.innerHeight ) * 2 + 1);
      that.raycast.setFromCamera(that.mouseCoords, that.camera);

      let ballMass = 500;
      let ballRadius =15 * 3;
      let ball = new THREE.Mesh( new THREE.SphereGeometry( ballRadius, 14, 10 ), that.ballMaterial );

      ball.castShadow = true;
      ball.receiveShadow = true;

      let ballShape = new Ammo.btSphereShape(ballRadius);

      ballShape.setMargin( 0.05 );

      pos.copy( that.raycast.ray.direction );
      pos.add( that.raycast.ray.origin );

      quat.set( 0, 0, 0, 1 );
      let ballBody = that.createRigidBody(ball, ballShape, ballMass, pos, quat,null,null );

      pos.copy( that.raycast.ray.direction );
      pos.multiplyScalar( 100 * 10 );
      let tmp_vect = new Ammo.btVector3( pos.x, pos.y, pos.z);
      ballBody.setLinearVelocity(tmp_vect);
      Ammo.destroy(tmp_vect);

    }, false);
  }


  public throwBall():void {
    let that = this;
    let pos = new THREE.Vector3();
    let quat = new THREE.Quaternion();

    that.mouseCoords.set(0, 0);
    that.raycast.setFromCamera(that.mouseCoords, that.camera);

    let ballMass = 500;
    let ballRadius =15 * 3;
    let ball = new THREE.Mesh( new THREE.SphereGeometry( ballRadius, 14, 10 ), that.ballMaterial );

    ball.castShadow = true;
    ball.receiveShadow = true;

    let ballShape = new Ammo.btSphereShape(ballRadius);

    ballShape.setMargin( 0.05 );

    pos.copy( that.raycast.ray.direction );
    pos.add( that.raycast.ray.origin );

    quat.set( 0, 0, 0, 1 );
    let ballBody = that.createRigidBody(ball, ballShape, ballMass, pos, quat,null,null );

    pos.copy( that.raycast.ray.direction );
    pos.multiplyScalar( 100 * 10 * 2);
    let tmp_vect = new Ammo.btVector3( pos.x, pos.y, pos.z);
    ballBody.setLinearVelocity(tmp_vect);
    Ammo.destroy(tmp_vect);
  }


  public createRigidBody(object:any, physicsShape:any, mass:number, pos:any, quat:any, vel:any, angVel:any) {
    if (pos) {
      object.position.copy(pos);

    } else {
      pos = object.position;
    }

    if (quat) {
      object.quaternion.copy( quat );

    } else {
      quat = object.quaternion;
    }

    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation(new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );

    let motionState = new Ammo.btDefaultMotionState( transform );
    let localInertia = new Ammo.btVector3( 0, 0, 0 );

    physicsShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );

    body.setFriction(0.5 * 10);
    body.setRestitution(0.1);

    if (vel) {
      body.setLinearVelocity(new Ammo.btVector3( vel.x, vel.y, vel.z ));
    }

    if (angVel) {
      body.setAngularVelocity(new Ammo.btVector3( angVel.x, angVel.y, angVel.z));
    }

    object.userData.physicsBody = body;
    object.userData.collided = false;

    this.scene.add(object);

    if (mass > 0) {
      this.rigidBodies.push(object);
      body.setActivationState(4);
    }

    this.physicsWorld.addRigidBody( body );
    return body;
  }


  public createStaticRigidBody(object:any, physicsShape:any) {
    let pos = object.getWorldPosition();
    let quat = object.getWorldQuaternion();

    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation(new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );

    let motionState = new Ammo.btDefaultMotionState( transform );
    let localInertia = new Ammo.btVector3( 0, 0, 0 );

    physicsShape.calculateLocalInertia(0, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(0, motionState, physicsShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );

    body.setFriction(0.5);

    object.userData.physicsBody = body;
    object.userData.collided = false;

    this.physicsWorld.addRigidBody(body);

    return body;
  }


  private createParalellepiped( sx, sy, sz, mass, pos, quat, material ) {
    let threeObject = new THREE.Mesh(new THREE.BoxGeometry( sx, sy, sz, 1, 1, 1 ), material);
    let shape = new Ammo.btBoxShape(new Ammo.btVector3( sx * 0.5, sy * 0.5, sz * 0.5 ));
    shape.setMargin( 0.05 );

    this.createRigidBody(threeObject, shape, mass, pos, quat,null,null);
    return threeObject;
  }


  public createTriangleMeshShapFromThreeMesh(meshObj:any):any {
    let _vec3_1 = new Ammo.btVector3(0,0,0);
    let _vec3_2 = new Ammo.btVector3(0,0,0);
    let _vec3_3 = new Ammo.btVector3(0,0,0);

    let gemotry:any = null;

    let tmp_bufferGeometry:any = meshObj.geometry;
    if ((tmp_bufferGeometry.isBufferGeometry)) {
      gemotry = new THREE.Geometry().fromBufferGeometry(tmp_bufferGeometry);

    } else {
      return null;
    }

    let vertices = gemotry.vertices;
    let triangles = [];

    for (let index = 0; index < gemotry.faces.length; index ++) {
      let face = gemotry.faces[index];
      if (face instanceof THREE.Face3) {
        triangles.push([
          { x: vertices[face.a].x, y: vertices[face.a].y, z: vertices[face.a].z },
          { x: vertices[face.b].x, y: vertices[face.b].y, z: vertices[face.b].z },
          { x: vertices[face.c].x, y: vertices[face.c].y, z: vertices[face.c].z }
        ]);
      } else if (face instanceof THREE.Face4) {
        triangles.push([
          { x: vertices[face.a].x, y: vertices[face.a].y, z: vertices[face.a].z },
          { x: vertices[face.b].x, y: vertices[face.b].y, z: vertices[face.b].z },
          { x: vertices[face.d].x, y: vertices[face.d].y, z: vertices[face.d].z }
        ]);
        triangles.push([
          { x: vertices[face.b].x, y: vertices[face.b].y, z: vertices[face.b].z },
          { x: vertices[face.c].x, y: vertices[face.c].y, z: vertices[face.c].z },
          { x: vertices[face.d].x, y: vertices[face.d].y, z: vertices[face.d].z }
        ]);
      }
    }

    let triangle_mesh = new Ammo.btTriangleMesh;
    for (let index = 0; index < triangles.length; index ++) {
      let triangle = triangles[index];

      _vec3_1.setX(triangle[0].x);
      _vec3_1.setY(triangle[0].y);
      _vec3_1.setZ(triangle[0].z);

      _vec3_2.setX(triangle[1].x);
      _vec3_2.setY(triangle[1].y);
      _vec3_2.setZ(triangle[1].z);

      _vec3_3.setX(triangle[2].x);
      _vec3_3.setY(triangle[2].y);
      _vec3_3.setZ(triangle[2].z);

      triangle_mesh.addTriangle(_vec3_1,_vec3_2,_vec3_3, true);
    }

    let shape = new Ammo.btBvhTriangleMeshShape(triangle_mesh,true,true);
    return shape;
  }


  private initBodyPhysics():any {
    let that = this;

    let bodyPartList = this.bodyMngr.getAllBodyPartList();
    bodyPartList.forEach(function (body) {
      that.initPhysicsForBodyPart(body);
    });
  }



  private initPhysicsForBodyPart(bodyPart:MarsBodyPart) {
    let that = this;

    bodyPart.meshObjects.forEach(function (meshObj) {
      that.createStaticRigidBody(meshObj,meshObj.p_shape);
    });

    bodyPart.subBodyPart.forEach(function (subBody) {
      that.initPhysicsForBodyPart(subBody);
    });
  }


  public get3DContext():Mars3DContext {
    return this.mars3DContext;
  }


  private createRandomColor() {
    return Math.floor( Math.random() * ( 1 << 24 ) );
  }

  private createMaterial() {
    return new THREE.MeshPhongMaterial( { color: this.createRandomColor() } );
  }

  private createObjects2() {
    let pos = new THREE.Vector3();
    let quat = new THREE.Quaternion();

    // Wall
    let brickMass = 100;

    let brickLength = 300;
    let brickDepth = 40;

    let brickHeight = brickLength * 0.5;
    let numBricksLength = 5;
    let numBricksHeight = 5;
    let z0 =  -700;//- numBricksLength * brickLength * 0.5;
    //pos.set( 0, brickHeight * 0.5, z0 );

    pos.set( -1000, -50, z0 );
    quat.set( 0, 0, 0, 1 );

    for ( let j = 0; j < numBricksHeight; j ++ ) {
      let oddRow = ( j % 2 ) == 1;

      pos.z = z0;

      if ( oddRow ) {
        pos.z -= 0.25 * brickLength;
      }

      let nRow = oddRow? numBricksLength + 1 : numBricksLength;
      for ( let i = 0; i < nRow; i ++ ) {
        let brickLengthCurrent = brickLength;
        let brickMassCurrent = brickMass;
        if ( oddRow && ( i == 0 || i == nRow - 1 ) ) {
          brickLengthCurrent *= 0.5;
          brickMassCurrent *= 0.5;
        }
        let brick = this.createParalellepiped( brickDepth, brickHeight, brickLengthCurrent, brickMassCurrent, pos, quat, this.createMaterial() );
        brick.castShadow = true;
        brick.receiveShadow = true;

        if ( oddRow && ( i == 0 || i == nRow - 2 ) ) {
          pos.z += 0.75 * brickLength;
        }
        else {
          pos.z += brickLength;
        }
      }
      pos.y += brickHeight;
    }

    z0 =  -700;//- numBricksLength * brickLength * 0.5;
    //pos.set( 0, brickHeight * 0.5, z0 );

    pos.set( 1000, -50, z0 );
    quat.set( 0, 0, 0, 1 );

    for ( let j = 0; j < numBricksHeight; j ++ ) {
      let oddRow = ( j % 2 ) == 1;

      pos.z = z0;

      if ( oddRow ) {
        pos.z -= 0.25 * brickLength;
      }

      let nRow = oddRow? numBricksLength + 1 : numBricksLength;
      for ( let i = 0; i < nRow; i ++ ) {

        let brickLengthCurrent = brickLength;
        let brickMassCurrent = brickMass;
        if ( oddRow && ( i == 0 || i == nRow - 1 ) ) {
          brickLengthCurrent *= 0.5;
          brickMassCurrent *= 0.5;
        }

        let brick = this.createParalellepiped( brickDepth, brickHeight, brickLengthCurrent, brickMassCurrent, pos, quat, this.createMaterial() );
        brick.castShadow = true;
        brick.receiveShadow = true;

        if ( oddRow && ( i == 0 || i == nRow - 2 ) ) {
          pos.z += 0.75 * brickLength;
        }
        else {
          pos.z += brickLength;
        }

      }
      pos.y += brickHeight;
    }


  }


  public createObjects() {
    let pos = new THREE.Vector3();
    let quat = new THREE.Quaternion();

     // Create soft volumes
    let volumeMass = 15;

    let sphereGeometry = new THREE.SphereBufferGeometry( 140, 40, 25 );
    sphereGeometry.translate( 5, 80, 0 );
    this.createSoftVolume( sphereGeometry, volumeMass, 250 );

    let boxGeometry = new THREE.BufferGeometry().fromGeometry( new THREE.BoxGeometry( 100, 100, 5, 4, 4, 100 ) );
    boxGeometry.translate( -2, 30, 0 );
    this.createSoftVolume( boxGeometry, volumeMass, 120 );

    // Ramp
    pos.set( 3, 1, 0 );
    quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), 30 * Math.PI / 180 );
    let obstacle = this.createParalellepiped( 10, 1, 4, 0, pos, quat, new THREE.MeshPhongMaterial( { color: 0x606060 } ) );
    obstacle.castShadow = true;
    obstacle.receiveShadow = true;

  }



  private createSoftVolume( bufferGeom, mass, pressure ) {
    let softBodyHelpers = new Ammo.btSoftBodyHelpers();
    let textureLoader = new THREE.TextureLoader();
    this.processGeometry( bufferGeom );
    let volume = new THREE.Mesh( bufferGeom, new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ) );

    volume.castShadow = true;
    volume.receiveShadow = true;
    volume.frustumCulled = false;
    this.scene.add( volume );

    textureLoader.load( "./assets/imgs/colors.png", function( texture ) {
      volume.material.map = texture;
      volume.material.needsUpdate = true;
    } );

    // Volume physic object
    let volumeSoftBody = softBodyHelpers.CreateFromTriMesh(
      this.physicsWorld.getWorldInfo(),
      bufferGeom.ammoVertices,
      bufferGeom.ammoIndices,
      bufferGeom.ammoIndices.length / 3,
      true );

    let sbConfig = volumeSoftBody.get_m_cfg();
    sbConfig.set_viterations( 40 );
    sbConfig.set_piterations( 40 );

    // Soft-soft and soft-rigid collisions
    sbConfig.set_collisions( 0x11 );

    // Friction
    sbConfig.set_kDF( 0.1 );
    // Damping
    sbConfig.set_kDP( 0.01 );
    // Pressure
    sbConfig.set_kPR( pressure );
    // Stiffness
    volumeSoftBody.get_m_materials().at( 0 ).set_m_kLST( 0.9 );
    volumeSoftBody.get_m_materials().at( 0 ).set_m_kAST( 0.9 );

    volumeSoftBody.setTotalMass( mass, false )
    Ammo.castObject( volumeSoftBody, Ammo.btCollisionObject ).getCollisionShape().setMargin( 0.05 );
    this.physicsWorld.addSoftBody( volumeSoftBody, 1, -1 );
    volume.userData.physicsBody = volumeSoftBody;
    // Disable deactivation
    volumeSoftBody.setActivationState( 4 );



    this.softBodies.push( volume );



  }


  private processGeometry( bufGeometry ) {

    // Obtain a Geometry
    let geometry = new THREE.Geometry().fromBufferGeometry( bufGeometry );

    // Merge the vertices so the triangle soup is converted to indexed triangles
    let vertsDiff = geometry.mergeVertices();

    // Convert again to BufferGeometry, indexed
    let  indexedBufferGeom = this.createIndexedBufferGeometryFromGeometry( geometry );

    // Create index arrays mapping the indexed vertices to bufGeometry vertices
    this.mapIndices( bufGeometry, indexedBufferGeom );

  }


  private createIndexedBufferGeometryFromGeometry( geometry ) {

    let numVertices = geometry.vertices.length;
    let numFaces = geometry.faces.length;

    let bufferGeom = new THREE.BufferGeometry();
    let vertices = new Float32Array( numVertices * 3 );
    let indices = new ( numFaces * 3 > 65535 ? Uint32Array : Uint16Array )( numFaces * 3 );

    for ( let i = 0; i < numVertices; i++ ) {
      let p = geometry.vertices[ i ];
      let i3 = i * 3;

      vertices[ i3 ] = p.x;
      vertices[ i3 + 1 ] = p.y;
      vertices[ i3 + 2 ] = p.z;
    }

    for ( let i = 0; i < numFaces; i++ ) {
      let f = geometry.faces[ i ];
      let i3 = i * 3;
      indices[ i3 ] = f.a;
      indices[ i3 + 1 ] = f.b;
      indices[ i3 + 2 ] = f.c;
    }

    bufferGeom.setIndex( new THREE.BufferAttribute( indices, 1 ) );
    bufferGeom.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    return bufferGeom;
  }


  private mapIndices( bufGeometry, indexedBufferGeom ) {
    let vertices = bufGeometry.attributes.position.array;
    let idxVertices = indexedBufferGeom.attributes.position.array;
    let indices = indexedBufferGeom.index.array;

    let numIdxVertices = idxVertices.length / 3;
    let numVertices = vertices.length / 3;

    bufGeometry.ammoVertices = idxVertices;
    bufGeometry.ammoIndices = indices;
    bufGeometry.ammoIndexAssociation = [];

    for ( let i = 0; i < numIdxVertices; i++ ) {

      let association = [];
      bufGeometry.ammoIndexAssociation.push( association );

      let i3 = i * 3;

      for ( let j = 0; j < numVertices; j++ ) {
        let j3 = j * 3;
        if ( this.isEqual( idxVertices[ i3 ], idxVertices[ i3 + 1 ],  idxVertices[ i3 + 2 ],
            vertices[ j3 ], vertices[ j3 + 1 ], vertices[ j3 + 2 ] ) ) {
          association.push( j3 );
        }
      }

    }

  }


  private isEqual( x1, y1, z1, x2, y2, z2 ) {
    let delta = 0.000001;
    return Math.abs( x2 - x1 ) < delta &&
      Math.abs( y2 - y1 ) < delta &&
      Math.abs( z2 - z1 ) < delta;
  }

}
