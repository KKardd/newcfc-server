"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ChauffeurStatus", {
    enumerable: true,
    get: function() {
        return ChauffeurStatus;
    }
});
var ChauffeurStatus = /*#__PURE__*/ function(ChauffeurStatus) {
    ChauffeurStatus["OFF_DUTY"] = "OFF_DUTY";
    ChauffeurStatus["RECEIVED_VEHICLE"] = "RECEIVED_VEHICLE";
    ChauffeurStatus["WAITING_FOR_RESERVATION"] = "WAITING_FOR_RESERVATION";
    ChauffeurStatus["MOVING_TO_DEPARTURE"] = "MOVING_TO_DEPARTURE";
    ChauffeurStatus["WAITING_FOR_PASSENGER"] = "WAITING_FOR_PASSENGER";
    ChauffeurStatus["IN_OPERATION"] = "IN_OPERATION";
    ChauffeurStatus["WAITING_OPERATION"] = "WAITING_OPERATION";
    ChauffeurStatus["OPERATION_COMPLETED"] = "OPERATION_COMPLETED";
    ChauffeurStatus["PAUSED"] = "PAUSED";
    return ChauffeurStatus;
}({});

//# sourceMappingURL=chauffeur-status.enum.js.map