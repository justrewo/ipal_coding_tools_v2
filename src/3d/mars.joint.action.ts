import {JOINT_ID} from "./mars.joint.mngr";


export class MarsMoveParam {
  public moveRate:number = 10;
  public targetDistance:number = 0;
  public currentDistance:number = 0;

}

export class  MarsJointAction {
  public jointID:JOINT_ID = JOINT_ID.JOINT_ID_NONE;
  public target:number = -1;
  public contextParam:any = null;

}


export class  AvatorKeyFrame {
  private acts:Array<MarsJointAction> = [];

  public constructor() {
    return;
  }

  public addJontAction(jointAction:MarsJointAction) {
    this.acts.forEach(function (item) {
      if (item.jointID == jointAction.jointID) {
        throw "同一帧里不能有重复的关节";
      }
    });
    this.acts.push(jointAction);
  }

  public getAllJointActions():Array<MarsJointAction> {
    return this.acts;
  }

  public clone():AvatorKeyFrame {
    let cloneKeyFrame = new AvatorKeyFrame();
    this.acts.forEach(function (item) {
      let tmp_action = new MarsJointAction();
      tmp_action.jointID = item.jointID;
      tmp_action.target = item.target;

      if (tmp_action.jointID == JOINT_ID.JOINT_ID_MOVE) {
        if (item.contextParam != null) {
          let tmp_move_param:MarsMoveParam = item.contextParam;
          let in_move_param:MarsMoveParam = new MarsMoveParam();
          in_move_param.targetDistance = tmp_move_param.targetDistance;
          in_move_param.currentDistance = 0;
          in_move_param.moveRate = tmp_move_param.moveRate;

          tmp_action.contextParam = in_move_param;
        }
      }

      cloneKeyFrame.addJontAction(tmp_action);
    });

    return cloneKeyFrame;
  }
}



export class AvatorFrames {
  private frames:Array<AvatorKeyFrame> = [];

  public constructor() {
    return;
  }

  public addKeyFrame(frame:AvatorKeyFrame) {
    this.frames.push(frame);
  }

  public getKeyFrames():Array<AvatorKeyFrame> {
    return this.frames;
  }


  public keyFrameCount() {
    return this.frames.length;
  }


  public getHeadKeyFrame():AvatorKeyFrame {
    if (this.frames.length > 0) {
      return this.frames[0];
    }

    return null;
  }


  public removeHeadKeyFrame() {
    if (this.frames.length > 0) {
      this.frames.splice(0,1);
    }
  }
}

