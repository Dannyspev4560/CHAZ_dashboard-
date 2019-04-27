const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const logger = require("morgan");
const sql=require('mssql');
const sql2=require('mssql');
const API_PORT = 3002;
const app = express();
const router = express.Router();
app.use(cors());

const firstCycle="14916";
const lastCycle="14924";

const SELECT_RUNNING_CYCLES_temp="select c.ID,c.Description,sum(case when Ex.Status=1 then 1 else 0 end) as Ex_Running, " +
    "sum(case when Ex.Status in (2,5) then 1 else 0 end) as Ex_Completed, " +
    "sum(case when Ex.Status=0 then 1 else 0 end) as Ex_Pending, " +
    "sum(case when Ex.Result=6 and Ex.ReRunCount=1 then 1 else 0 end) as Ex_Failed, "+
    "sum(case when Ex.Result=1 and Ex.Status=2 then 1 else 0 end) as Ex_Passed, "+
    "sum(case when Ex.Status=3 then 1 else 0 end ) as Ex_Terminated, "+
    "sum(case when Ex.Status=5 then 1 else 0 end ) as Ex_TimeOut "+
    "from Executions Ex " +
    "join CycleDefinition cd on Ex.CycleDefinitionID=cd.ID " +
    "Join Cycles c  on cd.CycleID=c.ID "+
    `where c.ID between ${firstCycle} and ${lastCycle} `+
    "group by c.ID, c.Description " +
    "order by c.ID desc";
const SELECT_EXEC_BY_CYCLE_ID = "select c.ID, ex.PlatformProperties, Ex.DUTSerial, ex.stationName,substring(ex.resultInfo,1,200),er.Name, datediff( MINUTE,Ex.StartDateTime, ex.EndDateTime) " +
    "from Executions Ex " +
    "Join CycleDefinition cd on Ex.CycleDefinitionID=cd.ID " +
    "join TestPlans tp on  tp.id = cd.TestID " +
    "Join Cycles c  on cd.CycleID=c.ID " +
    "join CycleTypes CT on c.CycleTypeId=CT.ID " +
    "join EnumExecutionStatuses EXS on ex.status=EXS.Id " +
    "join EnumResults er on er.Id = ex.Result " +
    "where c.ID in(13089) and er.Name != 'NONE' " +
    "order by ex.stationName asc";
const SELECT_OVEN_STATUS_BY_STATIONNAME="SELECT  count(sm.status) as 'Count',e.Name from SetupMappings sm" +
    "  join Stations s on sm.StationID=s.ID" +
    "  join EnumSetupMappingStatuses e on e.Id=sm.Status" +
    "  where s.Name LIKE '%tfn-ovn11%'" +
    "  group by e.Name";
const SELECT_CHAMBER_BY_NAME="select c.Name,cs.Name 'State',cm.Name 'Mode',c.CurrentTemperature,c.GoalTemperature,c.ProgramName,c.Host,c.ChamberStatusAdditionalInfo from chamber.Chamber c " +
    "join  chamber.ChamberState cs on cs.ID=c.ChamberStateID " +
    "join chamber.ChamberMode cm on cm.ID=c.ChamberModeID " +
    "where c.Name='ovn11'";
const SELECT_TOTAL_EXEC_BY_CYCLE="select ex.ID,CycleDefinitionID,eem.Name 'Status',er.Name 'Result',ex.PlatformProperties from Executions ex " +
    "join CycleDefinition cd on Ex.CycleDefinitionID=cd.ID " +
    "Join Cycles c  on cd.CycleID=c.ID " +
    "join EnumExecutionStatuses eem on eem.Id=ex.Status " +
    "join EnumResults er on er.Id=ex.Result " +
    `where c.ID between ${firstCycle} and ${lastCycle} and eem.Name!='Replaced' and ex.ReRunRequest!='1'`



const config={
    server:'10.24.8.188',
    user:'daniel',
    password:'D95a8nnyS123',
    database:'Swift_Prod_33',
};
const configAutomationMain={
    server:'10.24.8.188',
    user:'daniel',
    password:'D95a8nnyS123',
    database:'AutomationMain',
};

const pool = sql.connect(config);
//const pool2 = sql2.connect(configAutomationMain);

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

router.get("/getData", (req, res) => {
    return res.json({ success: true});
});

// router.get("/cycles", (req, res) => {
//   new sql.Request().query(SELECT_RUNNING_CYCLES_temp, (err, result) => {
//     return res.json({result});
//
//   })
// });

router.get("/cycles", (req, res) => {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(SELECT_RUNNING_CYCLES_temp)
    }).then(result => {
        let rows = result.recordset;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(rows);
        sql.close();
    }).catch(err => {
        router.get("/cycles", (req, res) => {
            res.status(500).send({message: `${err}`});
        });

        sql.close();
    });
});


router.get("/ovenUtil", (req, res) => {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(SELECT_OVEN_STATUS_BY_STATIONNAME)
    }).then(result => {
        let rows = result.recordset;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(rows);
        sql.close();
    }).catch(err => {
        router.get("/cycles", (req, res) => {
            res.status(500).send({message: `${err}`});
        });

        sql.close();
    });
});

router.get("/executions", (req, res) => {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(SELECT_TOTAL_EXEC_BY_CYCLE)
    }).then(result => {
        let rows = result.recordset;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(rows);
        sql.close();
    }).catch(err => {
        res.status(500).send({ message: `${err}`});
        sql.close();
    });
});





router.get("/chamber", (req, res) => {
    new sql.ConnectionPool(configAutomationMain).connect().then(pool => {
        return pool.request().query(SELECT_CHAMBER_BY_NAME)
    }).then(result => {
        let rows = result.recordset
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).json(rows);
        sql.close();
    }).catch(err => {
        res.status(500).send({ message: `${err}`});
        sql.close();
    });
});


router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  console.log("-------got it-----");
  console.log(id);
  console.log(update);
  return res.json({ success: true });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));