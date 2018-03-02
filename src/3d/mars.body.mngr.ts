import {JOINT_ID, JointLimitConfigure, MarsJointMngr, MarsJointProfile, MarsJointStatus} from "./mars.joint.mngr";
import {AvatorFrames, AvatorKeyFrame, MarsJointAction, MarsMoveParam} from "./mars.joint.action";
import {MarsEventService} from "../service/mars.event.service";
import {MarsSceneMngr} from "./mars.scene.mngr";



declare const THREE;
declare const Ammo;


const GLOBAL_X_OFFSET:number = -1130.39;
const coor_debug:boolean = false;


export class MarsBodyPart {
  public aliasName:String = "";
  public meshIDs:Array<Number>;

  public model_x_offset:Number = 0;
  public model_y_offset:number = 0;
  public model_z_offset:number = 0;

  public meshObjects:Array<any>;
  public subBodyPart:Array<MarsBodyPart>;
  public attatchNode:any = null;

  public constructor() {
    this.aliasName = "";        //部位的名称
    this.meshIDs = [];          //元素ID集合
    this.meshObjects = [];      //元素集合
    this.attatchNode = null;

    this.model_x_offset = 0;    //模型的X偏移
    this.model_y_offset = 0;    //模型的Y偏移
    this.model_z_offset = 0;    //模型的Z偏移


    this.subBodyPart = [];      //子部位
  }


  public displayMeshVetcs() {
    if (this.meshObjects.length > 0) {
      this.meshObjects.forEach(function (item) {
        let tmp_bufferGeometry:any = item.geometry;
        let tmp_position = tmp_bufferGeometry.getAttribute("position");
        console.log("Count:" + tmp_position.count + "  ");
      });

    } else {
      console.log("No mesh");
    }

    this.subBodyPart.forEach(function (item) {
      item.displayMeshVetcs();
    });
  }




}

export class MarsBodyMngr {
  private baseRoot:any = null;
  private sceneMngr:any = null;
  private stepAnimation: boolean = false;
  private bodyParts: Array<MarsBodyPart> = [];
  private bodyRoot: any = null;
  private jointMngr: MarsJointMngr = null;

  private avatarActFrames: Array<AvatorFrames> = [];


  public constructor(objModel: any, _sceneMngr:MarsSceneMngr) {
    let that: any = this;

    this.jointMngr = new MarsJointMngr();
    this.sceneMngr = _sceneMngr;

    /* 底盘部分 */
    let chassisPart: MarsBodyPart = new MarsBodyPart();
    chassisPart.aliasName = "chassis";
    chassisPart.meshIDs.push(2);

    chassisPart.attatchNode = new THREE.Group();
    chassisPart.attatchNode.position.set(0, 0, 0);

    chassisPart.model_x_offset = GLOBAL_X_OFFSET;
    chassisPart.model_y_offset = 0;
    chassisPart.model_z_offset = 0;

    let chassisJoint: MarsJointProfile = new MarsJointProfile(JOINT_ID.JOINT_ID_CHASSIS_ROTATE,
      JointLimitConfigure.JOINT_ID_CHASSIS_ROTATE.min,
      JointLimitConfigure.JOINT_ID_CHASSIS_ROTATE.max);

    chassisJoint.attatchNode = chassisPart.attatchNode;
    chassisJoint.rotateAxis = new THREE.Vector3(0, 1, 0);
    this.jointMngr.addJoint(chassisJoint);
    this.baseRoot = chassisPart.attatchNode;

    if (coor_debug) {
      chassisPart.attatchNode.add(MarsBodyMngr.makeCoordinates());
    }

    /**************************************** 主体部分 ******************************************/
    let mainPart: MarsBodyPart = new MarsBodyPart();
    mainPart.aliasName = "main";
    mainPart.meshIDs.push(3);

    mainPart.model_x_offset = GLOBAL_X_OFFSET;
    mainPart.model_y_offset = -115.5 * 4;
    mainPart.model_z_offset = 2.4 * 4 + 4;


    mainPart.attatchNode = new THREE.Group();
    mainPart.attatchNode.position.set(0, 115.5 * 4, -4.4 * 4);
    if (coor_debug) {
      mainPart.attatchNode.add(MarsBodyMngr.makeCoordinates());
    }

    chassisPart.subBodyPart.push(mainPart);

    let hip_joint: MarsJointProfile = new MarsJointProfile(JOINT_ID.JOINT_ID_HIP,
      JointLimitConfigure.JOINT_ID_HIP.min,
      JointLimitConfigure.JOINT_ID_HIP.max);

    hip_joint.rotateAxis = new THREE.Vector3(1, 0, 0);
    hip_joint.attatchNode = mainPart.attatchNode;
    this.jointMngr.addJoint(hip_joint);

    /**************************************** 主体部分 ******************************************/


    /***************************************** 头部 *******************************/
    let headPart: MarsBodyPart = new MarsBodyPart();
    headPart.aliasName = "head";
    headPart.meshIDs.push(4);

    headPart.model_x_offset = GLOBAL_X_OFFSET;
    headPart.model_y_offset = -115.5 * 8 + 130 - 25;
    headPart.model_z_offset = 8 + 4.69 * 4;

    headPart.attatchNode = new THREE.Group();
    headPart.attatchNode.position.set(0, 115.5 * 2 + 125, -7);
    if (coor_debug) {
      headPart.attatchNode.add(MarsBodyMngr.makeCoordinates());
    }

    //头部关节
    let head_joint_y: MarsJointProfile = new MarsJointProfile(JOINT_ID.JOINT_ID_HEAD_Y,
      JointLimitConfigure.JOINT_ID_HEAD_Y.min,
      JointLimitConfigure.JOINT_ID_HEAD_Y.max);

    head_joint_y.rotateAxis = new THREE.Vector3(0, 1, 0);
    head_joint_y.attatchNode = headPart.attatchNode;
    this.jointMngr.addJoint(head_joint_y);

    let head_joint_x: MarsJointProfile = new MarsJointProfile(JOINT_ID.JOINT_ID_HEAD_X,
      JointLimitConfigure.JOINT_ID_HEAD_X.min,
      JointLimitConfigure.JOINT_ID_HEAD_X.max);

    head_joint_x.rotateAxis = new THREE.Vector3(1, 0, 0);
    head_joint_x.attatchNode = headPart.attatchNode;
    this.jointMngr.addJoint(head_joint_x);
    /**************************************** 头部 **********************************/


    /******************************左手***********************************************/
    let left_root_part: MarsBodyPart = new MarsBodyPart();
    left_root_part.aliasName = "left_tmp_body_part";
    left_root_part.model_x_offset = 0;
    left_root_part.model_y_offset = 0;
    left_root_part.model_z_offset = 0;
    left_root_part.attatchNode = new THREE.Group();
    left_root_part.attatchNode.position.set(120, 245, -10);


    let leftArmPart: MarsBodyPart = new MarsBodyPart();
    leftArmPart.aliasName = "leftArm";
    leftArmPart.meshIDs.push(8, 5);

    leftArmPart.model_x_offset = GLOBAL_X_OFFSET - 26.80 * 4;
    leftArmPart.model_y_offset = -115.5 * 8 + 130 - 7 + 23.0 * 4;
    leftArmPart.model_z_offset = 6.85 * 4;


    leftArmPart.attatchNode = new THREE.Group();
    leftArmPart.attatchNode.position.set(0, 0, 0);

    left_root_part.subBodyPart.push(leftArmPart);

    let leftArmSub_01_part: MarsBodyPart = new MarsBodyPart();
    leftArmSub_01_part.aliasName = "leftArmSub_01_part";
    leftArmSub_01_part.meshIDs.push(9);

    leftArmSub_01_part.model_x_offset = GLOBAL_X_OFFSET - 44 * 4;
    leftArmSub_01_part.model_y_offset = -156 * 4;
    leftArmSub_01_part.model_z_offset = 7 * 4 + 1;

    leftArmSub_01_part.attatchNode = new THREE.Group();
    leftArmSub_01_part.attatchNode.position.set(70, -83, 0);

    if (coor_debug) {
      leftArmSub_01_part.attatchNode.add(MarsBodyMngr.makeCoordinates());
    }

    {//确定肘关节的旋转轴
      let plane_pt_01: any = new THREE.Vector3(41.3, 36.8, -7.1);
      let plane_pt_02: any = new THREE.Vector3(49.2, 38.9, 3.6);
      let plane_pt_03: any = new THREE.Vector3(46.3, 38.1, -10.0);
      plane_pt_01.negate();

      plane_pt_02.add(plane_pt_01);
      plane_pt_03.add(plane_pt_01);

      let plane_normal: any = new THREE.Vector3();
      plane_normal.crossVectors(plane_pt_02, plane_pt_03);
      plane_normal.normalize();

      if (coor_debug) {
        let origin_pt_kv: any = new THREE.Vector3(0, 0, 0);
        let end_point: any = new THREE.Vector3(plane_normal.x, plane_normal.y, plane_normal.z);
        end_point.multiplyScalar(1000);
        leftArmSub_01_part.attatchNode.add(MarsBodyMngr.makeLine(origin_pt_kv, end_point));
      }

      let left_elbow_rotate_joint: MarsJointProfile = new MarsJointProfile(JOINT_ID.JOINT_ID_LEFT_ELBOW_ROTATE,
        JointLimitConfigure.JOINT_ID_LEFT_ELBOW_ROTATE.min,
        JointLimitConfigure.JOINT_ID_LEFT_ELBOW_ROTATE.max);

      left_elbow_rotate_joint.rotateAxis = new THREE.Vector3(plane_normal.x, plane_normal.y, plane_normal.z);
      left_elbow_rotate_joint.attatchNode = leftArmSub_01_part.attatchNode;
      this.jointMngr.addJoint(left_elbow_rotate_joint);
    }

    leftArmPart.subBodyPart.push(leftArmSub_01_part);

    //关节定义
    let leftShoulder_joint_x: MarsJointProfile = new MarsJointProfile(JOINT_ID.JOINT_ID_LEFT_SHOULDER_X,
      JointLimitConfigure.JOINT_ID_LEFT_SHOULDER_X.min,
      JointLimitConfigure.JOINT_ID_LEFT_SHOULDER_X.max);

    leftShoulder_joint_x.rotateAxis = new THREE.Vector3(1, 0, 0);
    leftShoulder_joint_x.attatchNode = leftArmPart.attatchNode;
    this.jointMngr.addJoint(leftShoulder_joint_x);


    let leftShoulder_joint_z: MarsJointProfile = new MarsJointProfile(JOINT_ID.JOINT_ID_LEFT_SHOULDER_Z,
      JointLimitConfigure.JOINT_ID_LEFT_SHOULDER_Z.min,
      JointLimitConfigure.JOINT_ID_LEFT_SHOULDER_Z.max);

    leftShoulder_joint_z.rotateAxis = new THREE.Vector3(0, 0, 1);
    leftShoulder_joint_z.attatchNode = left_root_part.attatchNode;
    this.jointMngr.addJoint(leftShoulder_joint_z);


    /*肘关节弯曲部分*/
    let left_bend_elbow: MarsBodyPart = new MarsBodyPart();
    left_bend_elbow.aliasName = "leftBendElbow";
    left_bend_elbow.meshIDs.push(15, 12);

    left_bend_elbow.model_x_offset = GLOBAL_X_OFFSET - 43.8 * 4 - 5;
    left_bend_elbow.model_y_offset = -148.3 * 4;
    left_bend_elbow.model_z_offset = (2.21 + 5.68) * 4;

    left_bend_elbow.attatchNode = new THREE.Group();
    left_bend_elbow.attatchNode.position.set(3.5, -30.0, -3);
    leftArmSub_01_part.subBodyPart.push(left_bend_elbow);

    let bend_left_elbow_joint: MarsJointProfile = new MarsJointProfile(JOINT_ID.JOINT_ID_LEFT_ELBOW_BEND,
      JointLimitConfigure.JOINT_ID_LEFT_ELBOW_BEND.min,
      JointLimitConfigure.JOINT_ID_LEFT_ELBOW_BEND.max);


    bend_left_elbow_joint.rotateAxis = new THREE.Vector3(0, 0, 1);
    bend_left_elbow_joint.attatchNode = left_bend_elbow.attatchNode;
    this.jointMngr.addJoint(bend_left_elbow_joint);

    /* 手掌部分 */
    let left_palm: MarsBodyPart = new MarsBodyPart();
    left_palm.aliasName = "leftPalm";
    left_palm.meshIDs.push(13,
      17, 19, 20, 18, 21,
      22, 32, 46, 48,
      23, 29, 42, 45, 30, 43, 44,
      24, 33, 39, 40, 28, 38, 41,
      25, 26, 34, 37, 27, 35, 36);


    left_palm.model_x_offset = GLOBAL_X_OFFSET - 53.02652054397498 * 4;
    left_palm.model_y_offset = -118.08438545935437 * 4;
    left_palm.model_z_offset = 8.518684994313052 * 4;
    left_palm.attatchNode = new THREE.Group();
    left_palm.attatchNode.position.set(32.2, -121, -2);
    left_bend_elbow.subBodyPart.push(left_palm);


    //左手掌的旋转平面
    {
      let plane_pt_01: any = new THREE.Vector3(-1.414511932456378, -0.3790166629824796, 5.799708194664732);
      let plane_pt_02: any = new THREE.Vector3(6.301864173659794, 1.6885823444102073, 1.3750125681964747);
      let plane_normal: any = new THREE.Vector3();

      plane_normal.crossVectors(plane_pt_01, plane_pt_02);
      plane_normal.normalize();


      if (coor_debug) {
        let origin_pt: any = new THREE.Vector3(0, 0, 0);
        let end_point: any = new THREE.Vector3(plane_normal.x, plane_normal.y, plane_normal.z);
        end_point.multiplyScalar(1000);
        left_palm.attatchNode.add(MarsBodyMngr.makeLine(origin_pt, end_point));
      }

      let left_palm_rotate_joint: MarsJointProfile = new MarsJointProfile(JOINT_ID.JOINT_ID_LEFT_PALM_ROTATE,
        JointLimitConfigure.JOINT_ID_LEFT_PALM_ROTATE.min,
        JointLimitConfigure.JOINT_ID_LEFT_PALM_ROTATE.max);


      left_palm_rotate_joint.rotateAxis = new THREE.Vector3(plane_normal.x, plane_normal.y, plane_normal.z);
      left_palm_rotate_joint.attatchNode = left_palm.attatchNode;
      this.jointMngr.addJoint(left_palm_rotate_joint);
    }
    /*******************************左手***************************************************/


    /******************************** 右手 ******************************************/
    let right_root_part: MarsBodyPart = new MarsBodyPart();
    right_root_part.aliasName = "left_tmp_body_part";
    right_root_part.model_x_offset = 0;
    right_root_part.model_y_offset = 0;
    right_root_part.model_z_offset = 0;
    right_root_part.attatchNode = new THREE.Group();
    right_root_part.attatchNode.position.set(-120, 245, -12);


    let rightArmPart: MarsBodyPart = new MarsBodyPart();
    rightArmPart.aliasName = "rightArm";
    rightArmPart.meshIDs.push(7, 6);
    rightArmPart.model_x_offset = GLOBAL_X_OFFSET + 26.80 * 4;
    rightArmPart.model_y_offset = -115.5 * 8 + 130 - 7 + 23.0 * 4;
    rightArmPart.model_z_offset = 6.85 * 4;

    rightArmPart.attatchNode = new THREE.Group();
    rightArmPart.attatchNode.position.set(0, 0, 0);

    if (coor_debug) {
      rightArmPart.attatchNode.add(MarsBodyMngr.makeCoordinates());
    }

    right_root_part.subBodyPart.push(rightArmPart);

    let rightShoulder_sub_part: MarsBodyPart = new MarsBodyPart();
    rightShoulder_sub_part.aliasName = "rightShoulder_sub_part";
    rightShoulder_sub_part.meshIDs.push(10);
    rightShoulder_sub_part.model_x_offset = GLOBAL_X_OFFSET + 100 + 17 * 4;
    rightShoulder_sub_part.model_y_offset = -156 * 4;
    rightShoulder_sub_part.model_z_offset = 8 * 4;
    rightShoulder_sub_part.attatchNode = new THREE.Group();
    rightShoulder_sub_part.attatchNode.position.set(-61, -85, -4);

    if (coor_debug) {
      rightShoulder_sub_part.attatchNode.add(MarsBodyMngr.makeCoordinates());
    }


    //取平面上三点来确定平面法线方向.亦即肘关节的旋转方向
    {
      let plane_pt_01: any = new THREE.Vector3(-48.32, 38.40, -3.265);
      plane_pt_01.negate();

      let plane_pt_02: any = new THREE.Vector3(-40.13, 36.21, -2.02);
      let plane_pt_03: any = new THREE.Vector3(-51.86, 39.35, -7.58);

      plane_pt_02.add(plane_pt_01);
      plane_pt_03.add(plane_pt_01);

      let plane_normal: any = new THREE.Vector3();
      plane_normal.crossVectors(plane_pt_02, plane_pt_03);
      plane_normal.normalize();

      if (coor_debug) {
        let _origin_pt: any = new THREE.Vector3(0, 0, 0);
        let end_point: any = new THREE.Vector3(plane_normal.x, plane_normal.y, plane_normal.z);
        end_point.multiplyScalar(1000);
        rightShoulder_sub_part.attatchNode.add(MarsBodyMngr.makeLine(_origin_pt, end_point));
      }


      let right_elbow_rotate_joint: MarsJointProfile = new MarsJointProfile(JOINT_ID.JOINT_ID_RIGHT_ELBOW_ROTATE,
        JointLimitConfigure.JOINT_ID_RIGHT_ELBOW_ROTATE.min,
        JointLimitConfigure.JOINT_ID_RIGHT_ELBOW_ROTATE.max);


      right_elbow_rotate_joint.rotateAxis = new THREE.Vector3(plane_normal.x, plane_normal.y, plane_normal.z);
      right_elbow_rotate_joint.attatchNode = rightShoulder_sub_part.attatchNode;
      this.jointMngr.addJoint(right_elbow_rotate_joint);
    }

    rightArmPart.subBodyPart.push(rightShoulder_sub_part);
    let rightShoulder_joint_x = new MarsJointProfile(JOINT_ID.JOINT_ID_RIGHT_SHOULDER_X,
      JointLimitConfigure.JOINT_ID_RIGHT_SHOULDER_X.min,
      JointLimitConfigure.JOINT_ID_RIGHT_SHOULDER_X.max);

    rightShoulder_joint_x.rotateAxis = new THREE.Vector3(1, 0, 0);
    rightShoulder_joint_x.attatchNode = rightArmPart.attatchNode;
    this.jointMngr.addJoint(rightShoulder_joint_x);

    let rightShoulder_joint_z = new MarsJointProfile(JOINT_ID.JOINT_ID_RIGHT_SHOULDER_Z,
      JointLimitConfigure.JOINT_ID_RIGHT_SHOULDER_Z.min,
      JointLimitConfigure.JOINT_ID_RIGHT_SHOULDER_Z.max);

    rightShoulder_joint_z.rotateAxis = new THREE.Vector3(0, 0, 1);
    rightShoulder_joint_z.attatchNode = right_root_part.attatchNode;
    this.jointMngr.addJoint(rightShoulder_joint_z);

    /* 右手肘关节弯曲部分*/
    let right_bend_elbow: MarsBodyPart = new MarsBodyPart();
    right_bend_elbow.aliasName = "RightBendElbow";
    right_bend_elbow.meshIDs.push(16, 11);

    right_bend_elbow.model_x_offset = GLOBAL_X_OFFSET + 45.08902776010524 * 4;
    right_bend_elbow.model_y_offset = -148.3 * 4;
    right_bend_elbow.model_z_offset = (2.21 + 5.68) * 4;
    right_bend_elbow.attatchNode = new THREE.Group();
    right_bend_elbow.attatchNode.position.set(-10, -33.0, 1);

    if (coor_debug) {
      right_bend_elbow.attatchNode.add(MarsBodyMngr.makeCoordinates());
    }

    rightShoulder_sub_part.subBodyPart.push(right_bend_elbow);

    let bend_right_elbow_joint: MarsJointProfile = new MarsJointProfile(JOINT_ID.JOINT_ID_RIGHT_ELBOW_BEND,
      JointLimitConfigure.JOINT_ID_RIGHT_ELBOW_BEND.min,
      JointLimitConfigure.JOINT_ID_RIGHT_ELBOW_BEND.max);


    bend_right_elbow_joint.rotateAxis = new THREE.Vector3(0, 0, 1);
    bend_right_elbow_joint.attatchNode = right_bend_elbow.attatchNode;
    this.jointMngr.addJoint(bend_right_elbow_joint);

    /* 右手掌*/
    let right_palm: MarsBodyPart = new MarsBodyPart();
    right_palm.aliasName = "leftPalm";
    right_palm.meshIDs.push(14,
      50, 52, 53, 51, 54,
      55, 56, 58, 60, 57, 59, 61,
      67, 66, 64, 62, 68, 65, 63,
      69, 71, 72, 74, 70, 73, 75,
      81, 79, 77, 76, 1, 80, 78);

    right_palm.model_x_offset = GLOBAL_X_OFFSET + 53 * 4 + 0.47 * 4;
    right_palm.model_y_offset = -118.08438545935437 * 4;
    right_palm.model_z_offset = 8.518684994313052 * 4;
    right_palm.attatchNode = new THREE.Group();
    right_palm.attatchNode.position.set(-34.0, -121, -3.3);

    if (coor_debug) {
      right_palm.attatchNode.add(MarsBodyMngr.makeCoordinates());
    }


    right_bend_elbow.subBodyPart.push(right_palm);

    /*右手掌的法线方向 */
    {
      let plane_pt_01: any = new THREE.Vector3(0.16219920107798202, 0.014017554298234813, -5.844339882071953);
      let plane_pt_02: any = new THREE.Vector3(-5.589695854784139, 1.5552322974365609, 3.0248920022010966);
      let plane_normal: any = new THREE.Vector3();

      plane_normal.crossVectors(plane_pt_01, plane_pt_02);
      plane_normal.normalize();

      if (coor_debug) {
        let _origin_pt: any = new THREE.Vector3(0, 0, 0);
        let end_point: any = new THREE.Vector3(plane_normal.x, plane_normal.y, plane_normal.z);
        end_point.multiplyScalar(1000);
        right_palm.attatchNode.add(MarsBodyMngr.makeLine(_origin_pt, end_point));
      }


      let right_palm_rotate_joint: MarsJointProfile = new MarsJointProfile(JOINT_ID.JOINT_ID_RIGHT_PALM_ROTATE,
        JointLimitConfigure.JOINT_ID_RIGHT_PALM_ROTATE.min,
        JointLimitConfigure.JOINT_ID_RIGHT_PALM_ROTATE.max);


      right_palm_rotate_joint.rotateAxis = new THREE.Vector3(plane_normal.x, plane_normal.y, plane_normal.z);
      right_palm_rotate_joint.attatchNode = right_palm.attatchNode;
      this.jointMngr.addJoint(right_palm_rotate_joint);
    }
    /******************************** 右手 ******************************************/
    mainPart.subBodyPart.push(headPart);
    mainPart.subBodyPart.push(left_root_part);
    mainPart.subBodyPart.push(right_root_part);

    this.bodyParts.push(chassisPart);
    let bodyMeshSet: Array<any> = [];


    objModel.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        bodyMeshSet.push(child);
      }
    });

    this.bodyRoot = new THREE.Group();
    this.bodyRoot.position.set(0, 0, 0);

    if (coor_debug) {
      this.bodyRoot.add(MarsBodyMngr.makeCoordinates());
    }


    for (let item of bodyMeshSet) {
      this.importMesh(this.bodyParts, item);
    }


    this.bodyParts.forEach(function (item) {
      that.bodyRoot.add(item.attatchNode);
    });


    //创建各个部分的PhysicsShape;
    this.bodyParts.forEach(function (bodyPart) {
      that.makePhysicsShape(bodyPart);
    });

    return;
  }


  //通用关节转动函数
  public rotateJoint2Angle(jointID: JOINT_ID, angle: number) {
    this.jointMngr.rotateJoint2Angle(jointID, angle);

    this.updateAllBodyPartsPhysics();
  }


  public getJointMinValue(jointID: JOINT_ID): number {
    return this.jointMngr.getMinAngle(jointID);
  }

  public getJointMaxValue(jointID: JOINT_ID): number {
    return this.jointMngr.getMaxAngle(jointID);
  }

  public getJointCurrentValue(jointID: JOINT_ID): number {
    return this.jointMngr.getCurrentAngle(jointID);
  }


  private static idInBodyPart(bodyPart: MarsBodyPart, meshIndex: Number): boolean {
    for (let index of bodyPart.meshIDs) {
      if (index == meshIndex) {
        return true;
      }
    }
    return false;
  }


  private importMesh(bodyArray: Array<MarsBodyPart>, meshObj: any):void {
    let that = this;

    for (let item of bodyArray) {
      if (MarsBodyMngr.idInBodyPart(item, meshObj.meshIndex)) {
        if (item.attatchNode) {
          meshObj.position.set(item.model_x_offset, item.model_y_offset, item.model_z_offset);
          item.attatchNode.add(meshObj);
        }
        item.meshObjects.push(meshObj);

      } else {
        that.importMesh(item.subBodyPart, meshObj);
      }

      for (let sub_item of item.subBodyPart) {
        item.attatchNode.add(sub_item.attatchNode);
      }
    }
  }


  public addModel2Scene(attatchPoint: any):void {
    attatchPoint.add(this.bodyRoot);
  }



  public reset(): void {
    this.stepAnimation = false;

    if (this.jointMngr) {
      this.jointMngr.reset();
    }

    this.avatarActFrames.length = 0;
  }



  private static makeLine(pt_01: any, pt_02: any):any {
    let line_material:any = new THREE.LineBasicMaterial({
      color: 0xFFF00F
    });

    let line_geometry:any = new THREE.Geometry();
    line_geometry.vertices.push(pt_01,
      pt_02,
    );
    return new THREE.Line(line_geometry, line_material);
  }


  private static makeCoordinates(): any {
    let _x_material: any = new THREE.LineBasicMaterial({
      color: 0xFF0000
    });

    let _y_material: any = new THREE.LineBasicMaterial({
      color: 0x00FF00
    });

    let _z_material: any = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });

    let _coordinate: any = new THREE.Group();

    //x 轴
    let _x_geometry: any = new THREE.Geometry();
    _x_geometry.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(10000, 0, 0),
    );
    let _x_line: any = new THREE.Line(_x_geometry, _x_material);
    //y 轴
    let _y_geometry = new THREE.Geometry();
    _y_geometry.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 10000, 0),
    );
    let _y_line: any = new THREE.Line(_y_geometry, _y_material);
    //z 轴
    let _z_geometry: any = new THREE.Geometry();

    _z_geometry.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 10000),
    );

    let z_line_t: any = new THREE.Line(_z_geometry, _z_material);
    _coordinate.add(_x_line);
    _coordinate.add(_y_line);
    _coordinate.add(z_line_t);

    return _coordinate;
  }


  private isKeyFrameFinished(keyFrame: AvatorKeyFrame):boolean {
    let that = this;
    let allJointActions: any = keyFrame.getAllJointActions();
    let finished: boolean = true;

    allJointActions.forEach(function (item) {
      if (item.jointID != JOINT_ID.JOINT_ID_MOVE) {
        if ( Math.abs(that.jointMngr.getCurrentAngle(item.jointID) - item.target) > 0.0001) {
          finished = false;
        }
      } else {
        let moveParam:MarsMoveParam = item.contextParam;
        if (Math.abs(moveParam.targetDistance - moveParam.currentDistance) > 0.0001) {
          finished = false;
        }
      }

    });
    return finished;
  }


  public addAvatarAnimation(animation: AvatorFrames): void {
    this.avatarActFrames.push(animation);
  }


  private animationStepJoint(jointAction: MarsJointAction, delta: number):void {
    if (jointAction.jointID != JOINT_ID.JOINT_ID_MOVE) {
      let delta_angle:number = this.jointMngr.getActionRate(jointAction.jointID) * delta;
      let current_angle:number = this.jointMngr.getCurrentAngle(jointAction.jointID);
      let target_angle:number = jointAction.target;

      let angle_offset:number = target_angle - current_angle;

      if (angle_offset > 0) {
        if (delta_angle > angle_offset) {
          delta_angle = angle_offset;
        }

        this.rotateJoint2Angle(jointAction.jointID, current_angle + delta_angle);

      } else if (angle_offset < 0) {
        delta_angle = - delta_angle;

        if ((current_angle + delta_angle) < target_angle) {
          delta_angle = target_angle - current_angle;
        }
        this.rotateJoint2Angle(jointAction.jointID, current_angle + delta_angle);
      }
    } else {
      let moveParam:MarsMoveParam = jointAction.contextParam;
      let dist_delta = moveParam.moveRate * delta;

      if ((moveParam.currentDistance + dist_delta) > moveParam.targetDistance) {
        dist_delta = moveParam.targetDistance - moveParam.currentDistance;
      }

      moveParam.currentDistance = moveParam.currentDistance + dist_delta;
      this.moveForward(dist_delta);
     }
  }


  private animationStepKeyFrame(delta: number, keyFrame: AvatorKeyFrame):void {
    let allJoint = keyFrame.getAllJointActions();
    let that = this;

    allJoint.forEach(function (item) {
      that.animationStepJoint(item, delta);
    });
  }


  public animationStep(delta: number):void {
    if (this.stepAnimation) {
      if (this.avatarActFrames.length > 0) {
        let acts: AvatorFrames = (this.avatarActFrames)[0];
        let keyFrame: AvatorKeyFrame = acts.getHeadKeyFrame();

        if (keyFrame != null) {
          this.animationStepKeyFrame(delta, keyFrame);
          if (this.isKeyFrameFinished(keyFrame)) {
            console.log("a KeyFrame finish");
            acts.removeHeadKeyFrame();
          }
        }
        if (acts.keyFrameCount() == 0) {
          this.avatarActFrames.splice(0, 1);
        }

        if (this.avatarActFrames.length == 0) {
          MarsEventService.getSigleton().getEventHub().publish("animationFinished",this);
        }

      } else {
        this.stopAnimation();
      }
    }
  }

  public startAnimation():void {
    this.stepAnimation = true;
  }


  public stopAnimation():void {
    this.stepAnimation = false;
  }


  public clearAnimation():void {
    this.avatarActFrames.length = 0;
  }



  public getAllJointStatus():Array<MarsJointStatus> {
    let result:Array<MarsJointStatus> =null;

    if (this.jointMngr) {
      result = this.jointMngr.getCurrentAngleList();
    }

    return result;
  }


  public getAllBodyPartList():Array<MarsBodyPart> {
    return this.bodyParts;
  }



  private makePhysicsShape(bodyPart:MarsBodyPart) {
    let that = this;
    bodyPart.meshObjects.forEach(function (meshItem) {
      let tmp_shape = that.meshShapeFromThreeObj(meshItem);
      meshItem.p_shape = tmp_shape;
    });

    bodyPart.subBodyPart.forEach(function (subBody) {
      that.makePhysicsShape(subBody);
    });
  }



  private meshShapeFromThreeObj(meshObj:any):any {
    return this.sceneMngr.createTriangleMeshShapFromThreeMesh(meshObj);
  }



  public updateAllBodyPartsPhysics() {
    //更新所有部分的物理位置

    let that = this;

    this.bodyParts.forEach(function (bodyPart) {
      that.updateBodyPartPhysicsPosition(bodyPart);
    });

  }


  private updateBodyPartPhysicsPosition(bodyPart:MarsBodyPart) {
    let that = this;
    bodyPart.meshObjects.forEach(function (meshObj) {
      //根据模型的位置重新计算物理物体的位置

      {
        if ((meshObj.userData) && (meshObj.userData.physicsBody)) {
          let pos = meshObj.getWorldPosition();
          let quat = meshObj.getWorldQuaternion();

          let transform = new Ammo.btTransform();
          let vect = new Ammo.btVector3(pos.x, pos.y, pos.z);
          let qua = new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w);

          transform.setIdentity();
          transform.setOrigin(vect);
          transform.setRotation(qua);

          let motionState = new Ammo.btDefaultMotionState(transform);
          meshObj.userData.physicsBody.setMotionState(motionState);

          Ammo.destroy(transform);
          Ammo.destroy(vect);
          Ammo.destroy(qua);
          Ammo.destroy(motionState);
        }
      }
    });

    //递归设置子部分的位置
    bodyPart.subBodyPart.forEach(function (bodyInfo) {
      that.updateBodyPartPhysicsPosition(bodyInfo);
    });

  }


  public moveForward(dist_delta:number) {
    let pos =this.bodyRoot.position;
    let qua = this.baseRoot.quaternion;

    let vector = new THREE.Vector3( 0, 0, dist_delta);
    vector = vector.applyQuaternion(qua);

    let dist_pos = new THREE.Vector3(pos.x + vector.x, pos.y, pos.z + vector.z);
    this.bodyRoot.position.set(dist_pos.x, dist_pos.y, dist_pos.z);
    this.updateAllBodyPartsPhysics();

  }

}
