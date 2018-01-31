import {Component, ElementRef, Input, ViewChild} from "@angular/core";
import {Mars3DContext} from "../../service/mars.model.service";

@Component({
  selector:"mars-model-viewer",
  templateUrl:"mars.model.viewer.html"
})export class MarsModelViewer {
  @ViewChild("greet")
  greetDiv: ElementRef;

  @Input()
  public mars3DContext:Mars3DContext;


  @Input()
  public cameraPos:number;


  @Input()
  public orbitEnable:boolean;


  @Input()
  public pickEnable:boolean;


  public constructor(private innerEle:ElementRef) {
    this.cameraPos = 0;
    this.orbitEnable = true;
  }

  public ngOnInit() {

  }

  public ngOnDestroy() {
    if (this.mars3DContext) {
      this.mars3DContext.sceneMngr.resetScene();
    }
    this.mars3DContext = null;
  }

  public ngOnChanges() {
  }

  public ngAfterViewInit() {
  }


  public setMars3DContext(context:Mars3DContext) {
    let that = this;
    this.mars3DContext = context;

    let robot_container = this.greetDiv.nativeElement;
    let promise = new Promise(((resolve) => {
      if (that.mars3DContext) {
        that.mars3DContext.sceneMngr.attach2DOMNode(robot_container);
        //that.startRun();

        if ((that.cameraPos != 0)) {
          that.mars3DContext.sceneMngr.setCameraPos(that.cameraPos);
        }

        that.mars3DContext.sceneMngr.enableOrbit(that.orbitEnable);
        that.mars3DContext.sceneMngr.enablePickObject(that.pickEnable);
      }

      resolve();

    }));

    promise.then(function () {
    },function () {
    });
  }

  public startRun() {
    if (this.mars3DContext && this.mars3DContext.sceneMngr) {
      this.mars3DContext.sceneMngr.startRun();
    }
  }


  public stopRun() {
    if (this.mars3DContext && this.mars3DContext.sceneMngr) {
      this.mars3DContext.sceneMngr.stopRun();
    }
  }



  public playAnimation() {
    if (this.mars3DContext) {
      //this.mars3DContext.sceneMngr.runAnimation();
    }
  }

  public enableOrbit(enable:boolean) {
    if (this.mars3DContext) {
      this.mars3DContext.sceneMngr.enableOrbit(enable);
    }
  }

  public enablePickObject(enable:boolean) {
    if (this.mars3DContext) {
      this.mars3DContext.sceneMngr.enablePickObject(enable);
    }
  }

  public resize() {
    if (this.mars3DContext) {
      this.mars3DContext.sceneMngr.resizeContainer();
    }
  }







}
