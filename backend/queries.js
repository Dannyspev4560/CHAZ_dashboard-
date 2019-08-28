

module.exports = Object.freeze({
    GET_ALL_OVENS:"Select c.name oven,cs.name state,cm.name mode,CurrentTemperature,GoalTemperature,ProgramName,ChamberStatusAdditionalInfo from chamber.Chamber c " +
    "join chamber.ChamberMode cm on c.ChamberModeID=cm.ID " +
    "join chamber.ChamberState cs on c.ChamberStateID=cs.ID " +
    "order by c.id desc" ,

    GET_ALL_CHAZ_RUNNING_CYCLES:"select c.ID,c.Description,ct.Name as Type,c.FirmwareVersion,ecs.Name as Status,c.Project,c.CreatedDateTime,c.LabID from Cycles c " +
        "join CycleTypes ct on ct.ID=c.CycleTypeId " +
        "join EnumCycleStatuses ecs on ecs.Id=c.Status  " +
        "where ct.Name in ('Weekly Qual - CHAZ 4.4U','Weekly Qual - CHAZ') " +
        "AND ecs.Name='Running' " +
        "AND c.Description like '%CHAZ%'",

});
