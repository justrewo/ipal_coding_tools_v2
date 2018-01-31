import {NgModule} from "@angular/core";
import {MarsRobotMain} from "../pages/robot/mars.robot.main";
import {IonicModule} from "ionic-angular";
import {MarsModelService} from "../service/mars.model.service";
import {MarsModelViewer} from "../pages/widget/mars.model.viewer";
import {MarsRobotViewer} from "../pages/robot/mars.robot.viewer";
import {MarsEventService} from "../service/mars.event.service";
import {MarsRobotEmulator} from "../pages/robot/mars.robot.emulator";
import {MarsEmulatorViewer} from "../pages/robot/mars.emulator.viewer";
import {MarsActSerials} from "../pages/robot/mars.act.serials";




@NgModule({
  declarations:[MarsRobotMain,MarsModelViewer,MarsRobotViewer,MarsRobotEmulator,MarsEmulatorViewer,MarsActSerials],
  imports:[IonicModule],
  exports:[MarsRobotMain,MarsModelViewer,MarsRobotViewer,MarsRobotEmulator,MarsEmulatorViewer,MarsActSerials],
  providers:[MarsModelService,MarsEventService],
  entryComponents:[MarsRobotMain,MarsRobotEmulator,MarsEmulatorViewer,MarsActSerials]
})
export class MarsUiModule {

}
