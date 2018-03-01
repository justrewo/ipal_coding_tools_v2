import {ChangeDetectorRef, ElementRef, Component, ViewChild} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {Mars3DContext, MarsModelService} from "../../service/mars.model.service";
import {MarsRobotViewer} from "../robot/mars.robot.viewer";
import {Events, NavController, ToastController} from "ionic-angular";
import {JOINT_ID, MarsJointStatus} from "../../3d/mars.joint.mngr";
import {AvatorKeyFrame, MarsJointAction} from "../../3d/mars.joint.action";
import {MarsRobotEmulator} from "../robot/mars.robot.emulator";
import {MarsActSerials} from "../robot/mars.act.serials";

declare const Blockly;
declare const robot3D;

enum MODEL_LOAD_STATUS {
  MODEL_LOAD_STATUS_INIT,
  MODEL_LOAD_STATUS_LOADING,
  MODEL_LOAD_STATUS_LOADED,
  MODEL_LOAD_STATUS_ERR
}

const toolboximagepath = "assets/imgs/category/tool_";
const selectedtoolboximagepath = "assets/imgs/category_h/tool_";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public minAngle:number = 0;
  public maxAngle:number = 0;
  public targetAngle:number = 0;
  public blockUrl:any;

  private menuname: any;
  private current_pname:string = null;
  private current_pid: string = null;
  private programe_data:string = null;
  private hardBackKeyCB: any = null;
  private backaftersave:boolean = false;
  private toolBoxSelected:number = -1;
  private workspace:any;
  private currentJoint:JOINT_ID = JOINT_ID.JOINT_ID_NONE;

  private runTimer:any = null;

  @ViewChild("blocklyMenu")
  blocklyMenuDiv: ElementRef;

  @ViewChild(MarsRobotViewer)
  public robotView:MarsRobotViewer;

  private mars3DContext:Mars3DContext = null;

  constructor(private sanitizer:DomSanitizer,
              private navCtrl: NavController,
              private modelMngr:MarsModelService,
              private event:Events,
              private cd:ChangeDetectorRef,
              private toastCtrl:ToastController) {
    this.blockUrl = this.sanitizer.bypassSecurityTrustResourceUrl( "assets/index.html");
    this.blockUrl = null;
    this.menuname = [];
    this.menuname[0] = ["head__", "nod_head", "shake_head", "left_head", "right_head"];
    this.menuname[1] = ["left_arm__", "left_upper_arm_rotate", "left_upper_arm_roll", "left_lower_arm_rotate", "left_lower_arm_roll", "left_wrist_rotate"];
    this.menuname[2] = ["right_arm__", "right_upper_arm_rotate", "right_upper_arm_roll", "right_lower_arm_rotate", "right_lower_arm_roll", "right_wrist_rotate"];
    this.menuname[3] = ["wheel__", "move_forward", "move_backward", "move_turn_left", "move_turn_right"];
    this.menuname[4] = ["voice___", "speak", "background_music", "speak_record"];
    this.menuname[5] = ["emotion___", "emotion_smile", "emotion_laugh", "emotion_sad", "emotion_cry",
                        "emotion_angry", "emotion_amazed","emotion_shy", "emotion_doubt"];
    this.menuname[6] = ["action___", "action_handshake", "action_wavehand", "action_cheer", "action_embrace","action_rubeye", "action_shutup",
                        "action_donottouchme", "action_dance","action_turnpage", "action_takephoto", "action_toweling", "action_upgrade"];
    this.menuname[7] = ["control___", "control_loop", "control_simultaneously"];

    /*
    this.event.subscribe("raycast",(obj)=>{
      this.handleRaycastEvent(obj);
    });

    this.event.subscribe("meshPicker",(obj)=>{
      this.handleMeshPickerEvent(obj);
    });
    */
  }

  public ionViewDidEnter() {
    if (this.robotView &&  (!this.mars3DContext)) {
      this.robotView.loadRobotModel();
    } else {
      this.robotView.marsModelViewer.startRun();
    }

    this.addXMLTag(0);
    document.getElementById('blocklyCategory').style.visibility = "visible";
    this.BlocklyAttach();
  }

  /*
  private handleRaycastEvent(raycastObj:any) {
    console.log(raycastObj);
  }

  private handleMeshPickerEvent(pickedObj:any) {
    console.log(pickedObj);
  }
  */

  public onRobotModelReady(model:any) {
    this.mars3DContext = model;

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

  public setToolboxCategory(index:number) {
    this.toolBoxSelected = index;
    this.addMenu(index);
    this.workspace.updateToolbox(document.getElementById(this.menuname[index][0]));

    let elements = <HTMLElement[]><any>document.getElementsByClassName("blkToolCat");
    for (var i = 0; i < index; i++) {
      elements[i].setAttribute("src", toolboximagepath + elements[i].id + ".png");
    }

    elements[index].setAttribute("src", selectedtoolboximagepath + elements[index].id + ".png");
    for (var i = index + 1; i < elements.length; i++) {
      elements[i].setAttribute("src", toolboximagepath + elements[i].id + ".png");
    }
  }

  private addMenu(index:number) {
    let ele = document.createElement("xml");
    ele.setAttribute("id",this.menuname[index][0]);

    let n = this.menuname[index].length;

    for (let i = 1; i< n; i++) {
      let ele_block_01 = document.createElement("block");
      ele_block_01.setAttribute("type",this.menuname[index][i]);
      ele.appendChild(ele_block_01);
    }

    this.blocklyMenuDiv.nativeElement.appendChild(ele);
  }

  public addXMLTag(index:number) {
    this.addMenu(index);

    let ele = document.createElement("xml");
    ele.setAttribute("id","startBlocks");
    ele.setAttribute("style","display: none");

    let ele_block_01 = document.createElement("block");
    ele_block_01.setAttribute("id","startblock");
    ele_block_01.setAttribute("type","robot_control_start");
    ele_block_01.setAttribute("deletable","false");
    ele.appendChild(ele_block_01);

    this.blocklyMenuDiv.nativeElement.appendChild(ele);
  }

  private BlocklyAttach():void {
    if (!this.workspace) {
      this.workspace = Blockly.inject('blocklyDiv',
                                      { media: 'assets/media/',
                                        toolbox: document.getElementById('head__'),
                                        trashcan: true,
                                        scrollbars: true
                                      });

      document.getElementById('startblock').setAttribute("x", "0");
      document.getElementById('startblock').setAttribute("y", "60");

      Blockly.Xml.domToWorkspace(document.getElementById('startBlocks'), this.workspace);
      Blockly.ContextMenu.show = function () {};
      this.workspace.addChangeListener(Blockly.Events.disableOrphans);
    } else {
      Blockly.svgResize(this.workspace);
    }
  }

  public highlightbuttion(id){
    switch(id)
    {
      case "play":
        document.getElementById("topMenuPlay").setAttribute("src", "assets/imgs/menu/play.png");
        break;

      case "save":
        document.getElementById("topMenuSave").setAttribute("src", "assets/imgs/menu/save.png");
        break;

      default:
        break;
    }
  }

  public resetbuttion(id) {
    switch (id) {
      case "play":
        document.getElementById("topMenuPlay").setAttribute("src", "assets/imgs/menu/play.png");
        break;

      case "save":
        document.getElementById("topMenuSave").setAttribute("src", "assets/imgs/menu/save.png");
        break;

      default:
        break;
    }
  }

  public playaction() {
    var code = Blockly.JavaScript.workspaceToCode(this.workspace);
    console.log(code);

    let engine = new RobotEngine(this.mars3DContext);
    let runtime = robot3D.create(code, engine);
    runtime.onStop = () => {
      console.log("wangjun:" + "runtime stop");
      clearInterval(this.runTimer);
      this.runTimer = null;
    };
    if (this.runTimer == null) {
      this.runTimer = setInterval(() => {
        runtime.run();
      }, 200);
    }

    if ((this.mars3DContext) && (this.currentJoint != JOINT_ID.JOINT_ID_NONE)) {
      this.mars3DContext.bodyMngr.rotateJoint2Angle(this.currentJoint,this.targetAngle);
    }
  }

  public saveaction() {

  }

}

export class RobotEngine {
  private mars3DContext:Mars3DContext = null;

  public constructor(context:Mars3DContext) {
    this.mars3DContext = context;
  }

  public call(self, thrd, type, arg) {
    console.log("wangjun" + "in robot engine call");
    if (type == "nod_head") {
      this.mars3DContext.bodyMngr.rotateJoint2Angle(JOINT_ID.JOINT_ID_HEAD_Y, 20);
    }
    console.log("wangjun type is " + type);
  }
}
