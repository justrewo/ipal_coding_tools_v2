import {degree2Arc} from "../utility/mars.utility";

declare const THREE;


export enum JOINT_ID {
  JOINT_ID_NONE,
  JOINT_ID_HEAD_Y,                //头部绕Y轴旋转的关节
  JOINT_ID_HEAD_X,                //头部绕X轴旋转的关节

  JOINT_ID_HIP,                   //臀关节

  JOINT_ID_LEFT_SHOULDER_X,      //左臂绕X轴旋转的关节
  JOINT_ID_LEFT_SHOULDER_Z,      //左臂绕Z轴旋转的关节

  JOINT_ID_RIGHT_SHOULDER_X,     //右臂臂绕X轴旋转的关节
  JOINT_ID_RIGHT_SHOULDER_Z,     //右臂绕Z轴旋转的关节

  JOINT_ID_LEFT_ELBOW_ROTATE,     //左肘的旋转关节
  JOINT_ID_LEFT_ELBOW_BEND,       //左肘的弯曲关节

  JOINT_ID_RIGHT_ELBOW_ROTATE,    //右肘的旋转关节
  JOINT_ID_RIGHT_ELBOW_BEND,      //右肘的弯曲关节

  JOINT_ID_LEFT_PALM_ROTATE,      //左手旋转关节
  JOINT_ID_RIGHT_PALM_ROTATE,     //右手旋转关节


  JOINT_ID_CHASSIS_ROTATE,        //底盘旋转
}

export const JointLimitConfigure = {
  JOINT_ID_HEAD_Y: {
    min:-80,
    max:80,
  },

  JOINT_ID_HEAD_X: {
    min:-30,
    max:30
  },

  JOINT_ID_HIP: {
    min:-20,
    max:20
  },

  JOINT_ID_LEFT_SHOULDER_X: {
    min:-130,   //向前
    max:100     //向后
  },

  JOINT_ID_LEFT_SHOULDER_Z: {
    min:-10,
    max:50
  },

  JOINT_ID_RIGHT_SHOULDER_X: {
    min:-130,
    max:100
  },

  JOINT_ID_RIGHT_SHOULDER_Z: {
    min:-50,
    max:10
  },

  JOINT_ID_LEFT_ELBOW_ROTATE: {
    min:-80,
    max:80
  },

  JOINT_ID_LEFT_ELBOW_BEND: {
    min:-80,
    max:4
  },

  JOINT_ID_RIGHT_ELBOW_ROTATE: {
    min:-80,
    max:80
  },

  JOINT_ID_RIGHT_ELBOW_BEND: {
    min:-4,
    max:80,
  },

  JOINT_ID_LEFT_PALM_ROTATE: {
    min:-100,
    max:100
  },

  JOINT_ID_RIGHT_PALM_ROTATE: {
    min:-100,
    max:100
  },

  JOINT_ID_CHASSIS_ROTATE: {
    min:-180,
    max:180
  }
};

 export function getJointAlias(jointID:JOINT_ID):string {
  switch (jointID) {
    case JOINT_ID.JOINT_ID_HEAD_Y: {
      return "头部左右摇动";
    }

    case JOINT_ID.JOINT_ID_HEAD_X: {
      return "头部俯视&仰视";
    }

    case JOINT_ID.JOINT_ID_HIP: {
      return "弯腰&后仰";
    }

    case JOINT_ID.JOINT_ID_LEFT_SHOULDER_X:{
      return "左臂前后旋转";
    }
    case JOINT_ID.JOINT_ID_LEFT_SHOULDER_Z: {      //左臂绕Z轴旋转的关节
      return "左臂张开与收起";
    }

    case JOINT_ID.JOINT_ID_RIGHT_SHOULDER_X: {
      return "右臂前后旋转";
    }
    case JOINT_ID.JOINT_ID_RIGHT_SHOULDER_Z: {
      return "右臂张开与收起";
    }

    case JOINT_ID.JOINT_ID_LEFT_ELBOW_ROTATE: {
      return "左肘关节旋转";
    }
    case JOINT_ID.JOINT_ID_LEFT_ELBOW_BEND: {
      return "左肘关节弯曲";
    }

    case JOINT_ID.JOINT_ID_RIGHT_ELBOW_ROTATE: {
      return "右肘关节旋转";
    }
    case JOINT_ID.JOINT_ID_RIGHT_ELBOW_BEND: {
      return "右肘关节弯曲";
    }

    case JOINT_ID.JOINT_ID_LEFT_PALM_ROTATE: {
      return "左手掌旋转";
    }
    case JOINT_ID.JOINT_ID_RIGHT_PALM_ROTATE: {
      return "右手掌旋转";
    }

    case JOINT_ID.JOINT_ID_CHASSIS_ROTATE: {
      return "底盘旋转";
    }
  }

  return "";

}


export class MarsJointStatus {
  public jointID:JOINT_ID;
  public alias:string;
  public currentAngle:number;

  public constructor() {
    this.jointID = JOINT_ID.JOINT_ID_NONE;
    this.currentAngle = 0;
    this.alias = "";
  }
}

export class MarsJointProfile {
  public jointID:JOINT_ID = JOINT_ID.JOINT_ID_NONE;
  public alias:string;
  public minAngle:number;
  public maxAngle:number;

  public actionRate:number;
  public currentAngle:number;

  public rotateAxis:any = null;   //关节的旋转轴,向量必须单位化
  public attatchNode:any = null;  //关节的挂载节点


  public constructor(jointID:JOINT_ID,min:number,max:number) {
    this.jointID = jointID;
    this.alias = getJointAlias(jointID);
    this.minAngle = min;
    this.maxAngle = max;
    this.actionRate = 50;// (Math.PI / 360) * 30 * 10;

    this.currentAngle = 0;

    this.rotateAxis = new THREE.Vector3(0,0,0);
    this.attatchNode = null;
  }

  public rotateAngle(angle:number) {
    if (this.attatchNode == null) {
      return;
    }

    let targetAngle = this.currentAngle + angle;
    let tmp_angle = angle;

    if (targetAngle > this.maxAngle) {
      tmp_angle = this.maxAngle - this.currentAngle;

    } else if (targetAngle < this.minAngle) {
      tmp_angle = - (this.currentAngle - this.minAngle);
    }

    this.currentAngle +=   tmp_angle;
    let arcVale = degree2Arc(this.currentAngle);

    this.attatchNode.setRotationFromAxisAngle(this.rotateAxis, arcVale);
    return;
  }



  public rotate2Angle(targetAngle:number) {
    if (this.attatchNode == null) {
      return;
    }

    let expectTarget = targetAngle;
    if (targetAngle > this.maxAngle) {
      expectTarget = this.maxAngle;
    }

    if (targetAngle < this.minAngle) {
      expectTarget = this.minAngle;
    }

    let diff = expectTarget - this.currentAngle;

    if (Math.abs(diff) > 0.0000001) {
      this.rotateAngle(diff);
    }
  }
}


export class MarsJointMngr {
  private joint_list:Array<MarsJointProfile> = [];

  public constructor() {
    return;
  }

  public addJoint(joint:MarsJointProfile) {
    if ((joint.jointID == JOINT_ID.JOINT_ID_NONE) ||
      (joint.attatchNode == null) ||
      (Math.abs(joint.rotateAxis.length() -1) > 0.01)) {
      console.log("joint invalid");
      return;
    }

    this.joint_list.forEach(function (item) {
      if (joint.jointID == item.jointID) {
        console.log("jointID is duplicate");
        return;
      }
    });

    this.joint_list.push(joint);
  }


  public rotateJoint2Angle(jointID:JOINT_ID, targetAngle:number) {
    this.joint_list.forEach(function (item) {
      if (item.jointID == jointID) {
        item.rotate2Angle(targetAngle);
      }
    });
  }

  public getMinAngle(jointID:JOINT_ID):number {
    let result:number = 0;

    this.joint_list.forEach(function (item) {
      if (item.jointID == jointID) {
        result = item.minAngle;
      }
    });

    return result;
  }

  public getMaxAngle(jointID:JOINT_ID):number {
    let result:number = 0;

    this.joint_list.forEach(function (item) {
      if (item.jointID == jointID) {
        result = item.maxAngle;
      }
    });
    return result;
  }


  public getCurrentAngle(jointID:JOINT_ID):number {
    let result:number = 0;

    this.joint_list.forEach(function (item) {
      if (item.jointID == jointID) {
        result = item.currentAngle;
      }
    });

    return result;
  }

  public getActionRate(jointID:JOINT_ID):number {
    let result:number = 0;

    this.joint_list.forEach(function (item) {
      if (item.jointID == jointID) {
        result = item.actionRate;
      }
    });

    return result;
  }


  public getCurrentAngleList():Array<MarsJointStatus> {
    let tmp_list:Array<MarsJointStatus> = [];
    this.joint_list.forEach(function (item) {
      let jointStatus = new MarsJointStatus();
      jointStatus.jointID = item.jointID;
      jointStatus.currentAngle = item.currentAngle;
      jointStatus.alias = item.alias;

      tmp_list.push(jointStatus);
    });
    return tmp_list;
  }


  public reset() {
    this.joint_list.forEach(function (item) {
        item.rotate2Angle(0);
    });
  }

}
