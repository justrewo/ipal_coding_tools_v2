import { NavController } from 'ionic-angular';
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
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

}
