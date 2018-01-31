import {Component} from "@angular/core";
import {JOINT_ID, MarsJointStatus} from "../../3d/mars.joint.mngr";
import {NavParams} from "ionic-angular";
import {AvatorKeyFrame} from "../../3d/mars.joint.action";





@Component({
  templateUrl:"mars.act.serials.html"
})
export class MarsActSerials {
  public jointsLable:Array<MarsJointStatus> = null;
  public actList:Array<AvatorKeyFrame> = null;

  public badgetList:Array<number>;

  public constructor(private navParam:NavParams) {
    this.jointsLable = this.navParam.get("jointsLabel");
    this.actList = this.navParam.get("actList");

    this.badgetList = [];

    for (let idx = 0; idx < this.actList.length; idx ++) {
      this.badgetList.push(idx + 1);
    }


  }


  public getJointDisplayLabel(jointID:JOINT_ID, keyFrame:AvatorKeyFrame):string {
    let result = "";

    keyFrame.getAllJointActions().forEach(function (item) {
      if (item.jointID == jointID) {
        result = item.target + "";
      }
    });

    return result;

  }


}
