import {ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {Mars3DContext} from "../../service/mars.model.service";
import {MarsEmulatorViewer} from "./mars.emulator.viewer";
import {JOINT_ID} from "../../3d/mars.joint.mngr";
import {NavParams} from "ionic-angular";
import {AvatorFrames, AvatorKeyFrame} from "../../3d/mars.joint.action";
import {MarsEventService} from "../../service/mars.event.service";
import {MarsBodyMngr} from "../../3d/mars.body.mngr";



enum EMULATOR_STATUS {
  EMULATOR_STATUS_IDLE,
  EMULATOR_STATUS_RUNNING,    //正在运行
  EMULATOR_STATUS_PAUSING,    //暂停
  EMULATOR_STATUS_FINISHED,   //完成
}


@Component({
  selector:"mars-robot-emulator",
  templateUrl:"mars.robot.emulator.html"
})
export class  MarsRobotEmulator {
  private originActList:Array<AvatorKeyFrame> = null;
  private actList:Array<AvatorKeyFrame> = null;
  public run_status:EMULATOR_STATUS = EMULATOR_STATUS.EMULATOR_STATUS_IDLE;

  public constructor(private cd:ChangeDetectorRef,
                     private navParam:NavParams) {

    let tmp_actList:Array<AvatorKeyFrame> = this.navParam.get("avatorList");
    if (tmp_actList) {
      let tmp_origin_list:Array<AvatorKeyFrame> = [];
      let tmp_act_list:Array<AvatorKeyFrame> = [];

      tmp_actList.forEach(function (item) {
        let tmp_keyFrame_01 = item.clone();
        let tmp_keyFrame_02 = item.clone();

        tmp_origin_list.push(tmp_keyFrame_01);
        tmp_act_list.push(tmp_keyFrame_02);
      });

      this.originActList = tmp_origin_list;
      this.actList = tmp_actList;
    }

    MarsEventService.getSigleton().getEventHub().subscribe("animationFinished",(bodyMngr)=>{
      this.handleAnimitionFinished(bodyMngr);
    });
    return;
  }

  @ViewChild(MarsEmulatorViewer)
  public emulatorView:MarsEmulatorViewer;

  private mars3DContext:Mars3DContext = null;


  private handleAnimitionFinished(bodyMngr:MarsBodyMngr) {
    this.run_status = EMULATOR_STATUS.EMULATOR_STATUS_FINISHED;
    //this.cd.detectChanges();

  }


  public ionViewDidEnter() {
    if (this.emulatorView &&  (!this.mars3DContext)) {
      this.emulatorView.loadRobotModel();
    }
  }


  public ionViewWillLeave() {
    if (this.emulatorView && this.emulatorView.marsModelViewer) {
      this.emulatorView.marsModelViewer.stopRun();

      if (this.mars3DContext && this.mars3DContext.bodyMngr) {
        this.mars3DContext.bodyMngr.reset();
      }

    }
  }


  public onRobotModelReady(model:any) {
    this.mars3DContext = model;
    if (this.emulatorView && this.emulatorView.marsModelViewer) {
      this.emulatorView.marsModelViewer.startRun();
      this.mars3DContext.sceneMngr.resizeContainer();

      if (this.actList) {
        this.mars3DContext.bodyMngr.reset();
        this.addAnimation(this.actList);
      }

      this.cd.detectChanges();
    }
  }


  private addAnimation(actList:Array<AvatorKeyFrame>) {
    let that = this;

    if (this.mars3DContext) {
      let acts = new AvatorFrames();
      actList.forEach(function (item) {
        acts.addKeyFrame(item);
      });

      this.mars3DContext.bodyMngr.addAvatarAnimation(acts);

      setTimeout(()=>{
        that.run_status = EMULATOR_STATUS.EMULATOR_STATUS_RUNNING;
        that.mars3DContext.bodyMngr.startAnimation();

        that.cd.detectChanges();
      },1000);


    }
  }

  public getIconName():string {
    let iconName:string = "";

    switch (this.run_status) {
      case EMULATOR_STATUS.EMULATOR_STATUS_IDLE: {
        break;
      }

      case EMULATOR_STATUS.EMULATOR_STATUS_FINISHED: {
        iconName = "ios-refresh";

        break;
      }

      case EMULATOR_STATUS.EMULATOR_STATUS_PAUSING: {
        iconName = "ios-skip-forward";

        break;
      }

      case EMULATOR_STATUS.EMULATOR_STATUS_RUNNING: {
        iconName = "ios-pause";
        break;
      }
    }

    return iconName;
  }


  public isActionButtonHide():boolean {
    return this.run_status == EMULATOR_STATUS.EMULATOR_STATUS_IDLE;
  }


  public buttonAction() {
    switch (this.run_status) {
      case EMULATOR_STATUS.EMULATOR_STATUS_IDLE: {
        break;
      }

      case EMULATOR_STATUS.EMULATOR_STATUS_FINISHED: {
        let tmp_act_list:Array<AvatorKeyFrame> = [];
        this.originActList.forEach(function (item) {
          tmp_act_list.push(item.clone());

        });
        this.mars3DContext.bodyMngr.reset();
        this.addAnimation(this.actList);
        break;
      }

      case EMULATOR_STATUS.EMULATOR_STATUS_PAUSING: {
        this.run_status = EMULATOR_STATUS.EMULATOR_STATUS_RUNNING;
        this.mars3DContext.bodyMngr.startAnimation();
        this.cd.detectChanges();

        break;
      }

      case EMULATOR_STATUS.EMULATOR_STATUS_RUNNING: {
        this.mars3DContext.bodyMngr.stopAnimation();
        this.run_status = EMULATOR_STATUS.EMULATOR_STATUS_PAUSING;
        this.cd.detectChanges();
        break;
      }

    }
  }

}
