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
  selector:"mars-emulator-viewer",
  templateUrl:"mars.emulator.viewer.html"

})
export class MarsEmulatorViewer implements AfterViewInit,OnDestroy{
  public  mars3DContext:Mars3DContext = null;
  private loadingStatus:MODEL_LOAD_STATUS = MODEL_LOAD_STATUS.MODEL_LOAD_STATUS_INIT;

  @ViewChild(MarsModelViewer)
  public marsModelViewer:MarsModelViewer;

  @Output("onRobotModelReady")
  public onRobotModelReady = new EventEmitter<any>();


  public constructor(private model_service:MarsModelService) {

  }


  public loadRobotModel():void {
    let that = this;
    this.model_service.asyncLoadEmulator3DContext().then((model)=>{
      that.loadingStatus = MODEL_LOAD_STATUS.MODEL_LOAD_STATUS_LOADED;

      that.mars3DContext = model;
      that.marsModelViewer.setMars3DContext(model);
      that.onRobotModelReady.emit(model);

    }).catch((err)=>{
      that.loadingStatus = MODEL_LOAD_STATUS.MODEL_LOAD_STATUS_ERR;
      that.mars3DContext = null;
      console.log(err);
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
