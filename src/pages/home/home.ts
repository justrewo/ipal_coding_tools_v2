import {ChangeDetectorRef, Component, ViewChild} from "@angular/core";

import {Mars3DContext, MarsModelService} from "../../service/mars.model.service";
import {MarsRobotViewer} from "../robot/mars.robot.viewer";
import {Events, NavController, ToastController} from "ionic-angular";
import {JOINT_ID, MarsJointStatus} from "../../3d/mars.joint.mngr";
import {AvatorKeyFrame, MarsJointAction} from "../../3d/mars.joint.action";
import {MarsRobotEmulator} from "../robot/mars.robot.emulator";
import {MarsActSerials} from "../robot/mars.act.serials";


enum MODEL_LOAD_STATUS {
  MODEL_LOAD_STATUS_INIT,
  MODEL_LOAD_STATUS_LOADING,
  MODEL_LOAD_STATUS_LOADED,
  MODEL_LOAD_STATUS_ERR
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public minAngle:number = 0;
  public maxAngle:number = 0;
  public targetAngle:number = 0;

  private currentJoint:JOINT_ID = JOINT_ID.JOINT_ID_NONE;

  @ViewChild(MarsRobotViewer)
  public robotView:MarsRobotViewer;

  private mars3DContext:Mars3DContext = null;

  constructor(private navCtrl: NavController,
              private modelMngr:MarsModelService,
              private event:Events,
              private cd:ChangeDetectorRef,
              private toastCtrl:ToastController) {

    this.event.subscribe("raycast",(obj)=>{
      this.handleRaycastEvent(obj);
    });

    this.event.subscribe("meshPicker",(obj)=>{
      this.handleMeshPickerEvent(obj);
    });
  }

  public ionViewDidEnter() {
    if (this.robotView &&  (!this.mars3DContext)) {
      this.robotView.loadRobotModel();
    } else {
      this.robotView.marsModelViewer.startRun();
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

}
