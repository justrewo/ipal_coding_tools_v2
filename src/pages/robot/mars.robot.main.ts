import {ChangeDetectorRef, Component, ViewChild} from "@angular/core";

import {Mars3DContext, MarsModelService} from "../../service/mars.model.service";
import {MarsRobotViewer} from "./mars.robot.viewer";
import {Events, NavController, ToastController} from "ionic-angular";
import {JOINT_ID, MarsJointStatus} from "../../3d/mars.joint.mngr";
import {AvatorKeyFrame, MarsJointAction} from "../../3d/mars.joint.action";
import {MarsRobotEmulator} from "./mars.robot.emulator";
import {MarsActSerials} from "./mars.act.serials";


enum UIMODEL {
  UIMODEL_VIEW,             //处于查看状态
  UIMODEL_FRAME_COMPOSE,    //生成一帧
}


@Component ({
    selector:"mars-robot-main",
    templateUrl:"mars.robot.main.html"
})export class MarsRobotMain {
  private lastJointStatus:Array<MarsJointStatus> = null;
  private actionList:Array<AvatorKeyFrame> = [];

  private mode:UIMODEL = UIMODEL.UIMODEL_VIEW;
  public action:string = "1";
  public angle:number = 1;

  public minAngle:number = 0;
  public maxAngle:number = 0;
  public targetAngle:number = 0;

  private currentJoint:JOINT_ID = JOINT_ID.JOINT_ID_NONE;


  @ViewChild(MarsRobotViewer)
  public robotView:MarsRobotViewer;

  private mars3DContext:Mars3DContext = null;


  public constructor(private modelMngr:MarsModelService,
                     private event:Events,
                     private cd:ChangeDetectorRef,
                     private toastCtrl:ToastController,
                     private naviCtrl:NavController) {


    this.event.subscribe("raycast",(obj)=>{
      this.handleRaycastEvent(obj);
    });





    this.event.subscribe("meshPicker",(obj)=>{
      this.handleMeshPickerEvent(obj);
    });

  }

  public onValueChange(obj) {
    if ((this.mars3DContext) && (this.currentJoint != JOINT_ID.JOINT_ID_NONE)) {
      this.mars3DContext.bodyMngr.rotateJoint2Angle(this.currentJoint,this.targetAngle);

    }
  }

  public onSelectChange() {
    switch (this.action) {
      case "1": {
        this.currentJoint = JOINT_ID.JOINT_ID_HEAD_Y;
        break;
      }

      case "2": {
        this.currentJoint = JOINT_ID.JOINT_ID_HEAD_X;
        break;
      }

      case "3": {
        this.currentJoint = JOINT_ID.JOINT_ID_HIP;
        break;
      }

      case "4": {
        this.currentJoint = JOINT_ID.JOINT_ID_LEFT_SHOULDER_X;
        break;
      }

      case "5": {
        this.currentJoint = JOINT_ID.JOINT_ID_RIGHT_SHOULDER_X;
        break;
      }

      case "6": {
        this.currentJoint = JOINT_ID.JOINT_ID_LEFT_SHOULDER_Z;
        break;
      }

      case "7": {
        this.currentJoint = JOINT_ID.JOINT_ID_RIGHT_SHOULDER_Z;
        break;
      }

      case "8": {
        this.currentJoint = JOINT_ID.JOINT_ID_LEFT_ELBOW_ROTATE;
        break;
      }

      case "9": {
        this.currentJoint = JOINT_ID.JOINT_ID_RIGHT_ELBOW_ROTATE;
        break;
      }

      case "10": {
        this.currentJoint = JOINT_ID.JOINT_ID_LEFT_ELBOW_BEND;
        break;
      }

      case "11": {
        this.currentJoint = JOINT_ID.JOINT_ID_RIGHT_ELBOW_BEND;
        break;
      }

      case "12": {
        this.currentJoint = JOINT_ID.JOINT_ID_LEFT_PALM_ROTATE;
        break;
      }

      case "13": {
        this.currentJoint = JOINT_ID.JOINT_ID_RIGHT_PALM_ROTATE;
        break;
      }

      case "14": {
        this.currentJoint = JOINT_ID.JOINT_ID_CHASSIS_ROTATE;
        break;
      }

      default: {
        break;
      }
    }

    if (this.currentJoint != JOINT_ID.JOINT_ID_NONE) {
      this.minAngle= this.mars3DContext.bodyMngr.getJointMinValue(this.currentJoint);
      this.maxAngle = this.mars3DContext.bodyMngr.getJointMaxValue(this.currentJoint);
      this.targetAngle = this.mars3DContext.bodyMngr.getJointCurrentValue(this.currentJoint);

      this.cd.detectChanges();
    }
  }



  private handleRaycastEvent(raycastObj:any) {
    console.log(raycastObj);
  }


  private handleMeshPickerEvent(pickedObj:any) {
    console.log(pickedObj);

  }


  public onRobotModelReady(model:any) {
    this.mars3DContext = model;
    let that = this;

    if (this.robotView && this.robotView.marsModelViewer) {
      this.robotView.marsModelViewer.startRun();

      this.mars3DContext.sceneMngr.resizeContainer();

      this.currentJoint = JOINT_ID.JOINT_ID_HEAD_Y;
      this.minAngle= this.mars3DContext.bodyMngr.getJointMinValue(JOINT_ID.JOINT_ID_HEAD_Y);
      this.maxAngle = this.mars3DContext.bodyMngr.getJointMaxValue(JOINT_ID.JOINT_ID_HEAD_Y);
      this.targetAngle = this.mars3DContext.bodyMngr.getJointCurrentValue(JOINT_ID.JOINT_ID_HEAD_Y);
      this.cd.detectChanges();
    }

  }

  public onFrameActProgress(progress:any) {

  }

  public onPickObject(obj:any) {

  }

  public onJointRotate(obj:any) {

  }

  public onSimulatorStop() {
    return;
  }



  public ionViewDidEnter() {
    if (this.robotView &&  (!this.mars3DContext)) {
      this.robotView.loadRobotModel();
    } else {
      this.robotView.marsModelViewer.startRun();
    }
  }

  public ionViewWillEnter() {

  }

  public ionViewWillLeave() {
    if (this.robotView && this.robotView.marsModelViewer) {
      this.robotView.marsModelViewer.stopRun();
    }
  }


  public modelButtonAction() {
    if (this.mars3DContext == null) {
      return;
    }

    switch (this.mode) {
      case UIMODEL.UIMODEL_VIEW: {
        this.mode = UIMODEL.UIMODEL_FRAME_COMPOSE;
        if (this.mars3DContext) {
          if (this.lastJointStatus == null) {
            this.lastJointStatus = this.mars3DContext.bodyMngr.getAllJointStatus();
          }
        }
        break;
      }

      case UIMODEL.UIMODEL_FRAME_COMPOSE: {
        this.mode = UIMODEL.UIMODEL_VIEW;
        break;
      }
    }

    this.cd.detectChanges();
  }

  public acceptButtonAction() {
    if (this.mars3DContext == null) {
      return;
    }

    if (this.mode == UIMODEL.UIMODEL_FRAME_COMPOSE) {
      let current_status = this.mars3DContext.bodyMngr.getAllJointStatus();
      let diff_status = this.diffMarsJointsStatus(this.lastJointStatus, current_status);

      if (diff_status.length > 0) {
        this.addJointsStatus2Acts(diff_status);
        this.lastJointStatus = this.mars3DContext.bodyMngr.getAllJointStatus();

      } else {
        this.showToastInfo("没有任何关节状态改变");
        return;
      }
      this.mode = UIMODEL.UIMODEL_VIEW;
    }
    this.cd.detectChanges();
  }


  public emulatorButtonAction() {
    let tmp_list:Array<AvatorKeyFrame> = [];
    this.actionList.forEach(function (item) {
      let cloneKeyFrame = item.clone();
      tmp_list.push(cloneKeyFrame);
    });

    this.naviCtrl.push(MarsRobotEmulator,{
      "avatorList":tmp_list
    }).then();
  }

  public filmButtonAction() {
    if (this.lastJointStatus == null) {
      this.lastJointStatus = this.mars3DContext.bodyMngr.getAllJointStatus();
    }

    this.naviCtrl.push(MarsActSerials,{
      "jointsLabel":this.lastJointStatus,
      "actList":this.actionList
    }).then();
  }

  public resetAction() {
    this.mars3DContext.bodyMngr.reset();
    this.lastJointStatus = this.mars3DContext.bodyMngr.getAllJointStatus();
    this.actionList.length = 0;

    this.cd.detectChanges();

  }


  public getIconForModeButton():string {
    switch (this.mode) {
      case UIMODEL.UIMODEL_VIEW: {
        return "add-circle";
      }

      case UIMODEL.UIMODEL_FRAME_COMPOSE: {
        return "ios-close-circle";
      }
    }
  }

  public isSimulateButtonEnable():boolean {
    switch (this.mode) {
      case UIMODEL.UIMODEL_VIEW: {
        if (this.actionList.length > 0) {
          return true;
        } else {
          return false;
        }
      }
      default: {
        return false;
      }
    }
  }

  public isFilmButtonEnable():boolean {
    switch (this.mode) {
      case UIMODEL.UIMODEL_VIEW: {
        if (this.actionList.length > 0) {
          return true;
        }
        break;
      }

      default: {
        break;
      }
    }

    return false;
  }


  public isAcceptButtonEnable() {
    switch (this.mode) {
      case UIMODEL.UIMODEL_FRAME_COMPOSE: {
        return true;
      }
      default: {
        return false;
      }
    }
  }

  public isJointSelectEnable() {
    switch (this.mode) {
      case UIMODEL.UIMODEL_FRAME_COMPOSE: {
        return true;
      }

      default: {
        return false;
      }
    }
  }

  public isRangeEnable() {
    switch (this.mode) {
      case UIMODEL.UIMODEL_FRAME_COMPOSE: {
        return true;
      }
      default: {
        return false;
      }
    }
  }


  public isResetEnable():boolean {
    switch (this.mode) {
      case UIMODEL.UIMODEL_VIEW: {
        if (this.actionList.length > 0) {
          return true;
        }
        break;
      }
    }
    return false;
  }



  public fuckClick() {
    return;
  }



  private diffMarsJointsStatus(prev:Array<MarsJointStatus>, current:Array<MarsJointStatus>):Array<MarsJointStatus> {
    let diff_list:Array<MarsJointStatus> = [];

    current.forEach(function (current_item) {
      prev.forEach(function (prev_item) {
        if (current_item.jointID == prev_item.jointID) {
          if (current_item.currentAngle != prev_item.currentAngle) {
            let tmp_status = new MarsJointStatus();
            tmp_status.alias = prev_item.alias;
            tmp_status.jointID = prev_item.jointID;
            tmp_status.currentAngle = current_item.currentAngle;

            diff_list.push(tmp_status);
          }
        }
      });
    });
    return diff_list;
  }


  private addJointsStatus2Acts(joints_status:Array<MarsJointStatus>) {
    if (joints_status.length == 0) {
      return;
    }

    let keyFrame = new AvatorKeyFrame();

    joints_status.forEach(function (item) {
      let jointAction = new MarsJointAction();
      jointAction.jointID = item.jointID;
      jointAction.target = item.currentAngle;

      keyFrame.addJontAction(jointAction);

    });

    this.actionList.push(keyFrame);
  }


  private showToastInfo(info:string) {
    let toast = this.toastCtrl.create({
      message:info,
      duration:2000
    });

    toast.present().then();
  }

  public getBadget():number {
    if (this.actionList == null) {
      return 0;
    }

    return this.actionList.length;
  }


}
