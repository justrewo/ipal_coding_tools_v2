import {Injectable} from "@angular/core";
import {Events} from "ionic-angular";



let singleHub:MarsEventService = null;

@Injectable()
export class MarsEventService {
  public constructor(private eventHub:Events) {
    singleHub = this;
  }


  public getEventHub():Events {
    if (singleHub == null) {
      return null;
    }
    return singleHub.eventHub;
  }



  public static getSigleton():MarsEventService {
    return singleHub;
  }


}
