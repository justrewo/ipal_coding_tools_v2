import {AfterViewInit, Component, EventEmitter, OnDestroy, Output, ViewChild} from "@angular/core";
import {Mars3DContext, MarsModelService} from "../../service/mars.model.service";
import {MarsModelViewer} from "../widget/mars.model.viewer";


enum MODEL_LOAD_STATUS {
  MODEL_LOAD_STATUS_INIT,
  MODEL_LOAD_STATUS_LOADING,
  MODEL_LOAD_STATUS_LOADED,
  MODEL_LOAD_STATUS_ERR
}



@Component({
  selector:"mars-robot-viewer",
  templateUrl:"mars.robot.viewer.html"
})

export  class  MarsRobotViewer implements AfterViewInit,OnDestroy{
  public  mars3DContext:Mars3DContext = null;
  private loadingStatus:MODEL_LOAD_STATUS = MODEL_LOAD_STATUS.MODEL_LOAD_STATUS_INIT;

  @ViewChild(MarsModelViewer)
  public marsModelViewer:MarsModelViewer;

  @Output("onPick")
  public onPick = new EventEmitter<any>();

  @Output("onTouchEnd")
  public onTouchEnd = new EventEmitter<any>();

  @Output("onTouchStart")
  public OnTouchStart = new EventEmitter<any>();

  @Output("onJointRotate")
  public onJointRotate = new EventEmitter<any>();

  @Output("onSimulateStop")
  public onSimulateStop = new EventEmitter<any>();


  @Output("onRobotModelReady")
  public onRobotModelReady = new EventEmitter<any>();

  @Output("onFrameActProgress")
  public onFrameActProgress = new EventEmitter<any>();


  public constructor(private model_service:MarsModelService) {

  }


  public loadRobotModel():void {
    let that = this;

    this.model_service.asyLoadMarsRobotModule().then((model)=>{
      that.loadingStatus = MODEL_LOAD_STATUS.MODEL_LOAD_STATUS_LOADED;
      that.mars3DContext = model;
      that.marsModelViewer.setMars3DContext(model);
      that.onRobotModelReady.emit(model);
    }).catch((err)=>{
      console.log(err);

      that.loadingStatus = MODEL_LOAD_STATUS.MODEL_LOAD_STATUS_ERR;
      that.mars3DContext = null;
      that.onRobotModelReady.emit(null);
    });
  }

  public isLoading():boolean {
    return this.loadingStatus == MODEL_LOAD_STATUS.MODEL_LOAD_STATUS_LOADING;
  }

  public isLoaded():boolean {
    return this.loadingStatus == MODEL_LOAD_STATUS.MODEL_LOAD_STATUS_LOADED;
  }

  ngAfterViewInit() {
    let  that = this;
    that.loadingStatus = MODEL_LOAD_STATUS.MODEL_LOAD_STATUS_LOADING;
    return;
  }

  public ngOnDestroy():void {
    this.mars3DContext = null;
  }
}
