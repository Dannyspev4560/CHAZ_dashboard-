const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const logger = require("morgan");
const sql=require('mssql');
const API_PORT = 3002;
const app = express();
const router = express.Router();
app.use(cors());


let cyclesStr="16586,16587,16588,16589,16590,16591";
let source_Site_ID="33";
let database="Swift_Prod_33";
//TODO: timer that gets queries from the db

getSqlData();
generalSqlData();
setInterval(()=>{
    console.log('-----------request started-----------------');
    getSqlData();
}, 300000);//5 minutes
setInterval(()=>{
    console.log('-----------request started-----------------');
    generalSqlData();
}, 43200000);//12 hours


function runningCyclesQuery(){
    return "select c.ID,c.Description,sum(case when Ex.Status=1 then 1 else 0 end) as Ex_Running, " +
        "sum(case when Ex.Status in (2,5) and Ex.ReRunCount=0 then 1 else 0 end) as Ex_Completed, " +
        "sum(case when Ex.Status=0 then 1 else 0 end) as Ex_Pending, " +
        "sum(case when Ex.Status in (2) and Ex.Result in (2,3,6) and Ex.ReRunCount=0 then 1 else 0 end) as Ex_Failed, "+
        "sum(case when Ex.Result=1 and Ex.Status=2 then 1 else 0 end) as Ex_Passed, "+
        "sum(case when Ex.Status=3 then 1 else 0 end ) as Ex_Terminated, "+
        "sum(case when Ex.Status=5 then 1 else 0 end ) as Ex_TimeOut "+
        "from Executions Ex " +
        "join CycleDefinition cd on Ex.CycleDefinitionID=cd.ID " +
        "Join Cycles c  on cd.CycleID=c.ID "+
        `where c.ID in (${cyclesStr})`+
        "group by c.ID, c.Description " +
        "order by c.ID desc";
}
let SELECT_RUNNING_CYCLES_temp="select c.ID,c.Description,sum(case when Ex.Status=1 then 1 else 0 end) as Ex_Running, " +
    "sum(case when Ex.Status in (2,5) then 1 else 0 end) as Ex_Completed, " +
    "sum(case when Ex.Status=0 then 1 else 0 end) as Ex_Pending, " +
    "sum(case when Ex.Status in (2) and Ex.Result in (2,3,6) and Ex.ReRunCount=0 then 1 else 0 end) as Ex_Failed, "+
    "sum(case when Ex.Result=1 and Ex.Status=2 then 1 else 0 end) as Ex_Passed, "+
    "sum(case when Ex.Status=3 then 1 else 0 end ) as Ex_Terminated, "+
    "sum(case when Ex.Status=5 then 1 else 0 end ) as Ex_TimeOut "+
    "from Executions Ex " +
    "join CycleDefinition cd on Ex.CycleDefinitionID=cd.ID " +
    "Join Cycles c  on cd.CycleID=c.ID "+
    `where c.ID in (${cyclesStr})`+
    "group by c.ID, c.Description " +
    "order by c.ID desc";

const GET_ALL_OVENS="Select c.name oven,cs.name state,cm.name mode,CurrentTemperature,GoalTemperature,ProgramName,ChamberStatusAdditionalInfo from chamber.Chamber c " +
    "join chamber.ChamberMode cm on c.ChamberModeID=cm.ID " +
    "join chamber.ChamberState cs on c.ChamberStateID=cs.ID " +
    "order by c.id desc" ;

const GET_SETUP_STATUS_BY_RACK="select r.Name, " +
    "sum(case when e.Name = 'Available' then 1 else 0 end ) as Available, " +
    "sum(case when e.Name = 'NotAvailable' then 1 else 0 end ) as NotAvailable, " +
    "sum(case when e.Name = 'Found' then 1 else 0 end ) as Found, " +
    "sum(case when e.Name = 'ReadyForSelfTest' then 1 else 0 end ) as ReadyForSelfTest, " +
    "sum(case when e.Name = 'NotFound' then 1 else 0 end ) as NotFound " +
    "from Rack r " +
    "join Stations s on s.RackID=r.ID " +
    "join SetupMappings sm on sm.StationID=s.ID " +
    "join EnumSetupMappingStatuses e on e.Id=sm.Status " +
    "where r.name in('Rack-oven11R','Rack-oven11L','Rack-ovn9L','Rack-ovn9R','Rack-Oven1L','Rack-Oven1R', " +
    "'Rack-Oven7L','Rack-Oven7R','Rack-Oven4L','Rack-Oven4R','Rack-Oven5L','Rack-Oven5R','Rack-ovn8L','Rack-ovn8R') " +
    "group by r.Name";

let SELECT_EXEC_BY_CYCLE_ID = "select c.ID, ex.PlatformProperties, Ex.DUTSerial, ex.stationName,substring(ex.resultInfo,1,200),er.Name, datediff( MINUTE,Ex.StartDateTime, ex.EndDateTime) " +
    "from Executions Ex " +
    "Join CycleDefinition cd on Ex.CycleDefinitionID=cd.ID " +
    "join TestPlans tp on  tp.id = cd.TestID " +
    "Join Cycles c  on cd.CycleID=c.ID " +
    "join CycleTypes CT on c.CycleTypeId=CT.ID " +
    "join EnumExecutionStatuses EXS on ex.status=EXS.Id " +
    "join EnumResults er on er.Id = ex.Result " +
    "where c.ID in(13089) and er.Name != 'NONE' " +
    "order by ex.stationName asc";
function ovenStatusQuery() {
    return "SELECT  count(sm.status) as 'Count',e.Name from SetupMappings sm" +
        "  join Stations s on sm.StationID=s.ID" +
        "  join EnumSetupMappingStatuses e on e.Id=sm.Status" +
        "  where s.Name LIKE '%tfn-ovn11%'" +
        "  group by e.Name";
}
function chamberByNameQuery(){
    return "select c.Name,cs.Name 'State',cm.Name 'Mode',c.CurrentTemperature,c.GoalTemperature,c.ProgramName,c.Host,c.ChamberStatusAdditionalInfo from chamber.Chamber c " +
        "join  chamber.ChamberState cs on cs.ID=c.ChamberStateID " +
        "join chamber.ChamberMode cm on cm.ID=c.ChamberModeID " +
        "where c.Name='ovn11'";
}

function executionsByCycleQuery(){
    return "select ex.ID,CycleDefinitionID,eem.Name 'Status',er.Name 'Result',ex.PlatformProperties from Executions ex " +
        "join CycleDefinition cd on Ex.CycleDefinitionID=cd.ID " +
        "Join Cycles c  on cd.CycleID=c.ID " +
        "join EnumExecutionStatuses eem on eem.Id=ex.Status " +
        "join EnumResults er on er.Id=ex.Result " +
        `where c.ID in (${cyclesStr}) and eem.Name!='Replaced' and ex.ReRunRequest!='1'`;
}
function totalTestsByCycleQuery(){
    return "select cd.ID,cd.Quantity,cd.TestID,tp.Description from CycleDefinition cd " +
        "join TestPlans tp on tp.ID=cd.TestID " +
        "Join Cycles c  on cd.CycleID=c.ID " +
        `where c.ID in (${cyclesStr}) `
}
function jirasByCyclesQuery(){
    return "select top 100 j.Issue_Key,  r.Execution_Id, c.Cycle_Id , r.Source_Site_Id from dwh.Dim_JIRA_Issues j  " +
        "inner join dwh.raw_executions r on j.JIRA_Issue_Id = r.jira_issue_id " +
        "inner join dwh.Dim_Cycles c on c.Cycle_Key = r.Cycle_Key " +
        `where c.Cycle_Id in (${cyclesStr})  and r.Source_Site_Id = ${source_Site_ID}`
}


function config188(){
    return {
        server:'10.24.8.188',
        user:'daniel',
        password:'Danny958spevak',
        database:database,
    }
}
const configDeneb33={
    server:'10.24.8.188',
    user:'daniel',
    password:'Danny958spevak',
    database:'Swift_Prod_33',
};
const configEnif35={
    server:'10.24.8.188',
    user:'daniel',
    password:'Danny958spevak',
    database:'Enif_Production_35',
};
const configAutomationMain={
    server:'10.24.8.188',
    user:'daniel',
    password:'Danny958spevak',
    database:'AutomationMain',
};
const configDWH={
    server:'10.24.8.171',
    user:'daniel',
    password:'D95a8nnyS',
    database:'iNAND_BI',
};


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

function generalSqlData(){
    router.get("/allOvens", (req, res) => {
        new sql.ConnectionPool(configAutomationMain).connect().then(pool => {
            return pool.request().query(GET_ALL_OVENS)
        }).then(result => {
            let rows = result.recordset;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).json(rows);
            sql.close();
        }).catch(err => {
            router.get("/allOvens", (req, res) => {
                res.status(500).send({message: `${err}`});
            });
            sql.close();
        });
    });

    router.get("/setupStatusesDeneb", (req, res) => {
        new sql.ConnectionPool(configDeneb33).connect().then(pool => {
            return pool.request().query(GET_SETUP_STATUS_BY_RACK)
        }).then(result => {
            let rows = result.recordset;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).json(rows);
            sql.close();
        }).catch(err => {
            router.get("/setupStatuses", (req, res) => {
                res.status(500).send({message: `${err}`});
            });
            sql.close();
        });
    });
    router.get("/setupStatusesEnif", (req, res) => {
        new sql.ConnectionPool(configEnif35).connect().then(pool => {
            return pool.request().query(GET_SETUP_STATUS_BY_RACK)
        }).then(result => {
            let rows = result.recordset;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).json(rows);
            sql.close();
        }).catch(err => {
            router.get("/setupStatuses", (req, res) => {
                res.status(500).send({message: `${err}`});
            });
            sql.close();
        });
    });

}
function getSqlData ()
{
    router.get("/getData", (req, res) => {
        return res.json({success: true});
    });

    router.get("/cycles", (req, res) => {
        new sql.ConnectionPool(config188()).connect().then(pool => {
            return pool.request().query(runningCyclesQuery())
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
        new sql.ConnectionPool(configEnif35).connect().then(pool => {
            return pool.request().query(ovenStatusQuery())
        }).then(result => {
            let rows = result.recordset;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).json(rows);
            sql.close();
        }).catch(err => {
            router.get("/ovenUtil", (req, res) => {
                res.status(500).send({message: `${err}`});
            });
            sql.close();
        });
    });


    router.get("/executions", (req, res) => {
        new sql.ConnectionPool(config188()).connect().then(pool => {
            return pool.request().query(executionsByCycleQuery())
        }).then(result => {
            let rows = result.recordset;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).json(rows);
            sql.close();
        }).catch(err => {
            res.status(500).send({message: `${err}`});
            sql.close();
        });
    });


    router.get("/chamber", (req, res) => {
        new sql.ConnectionPool(configAutomationMain).connect().then(pool => {
            return pool.request().query(chamberByNameQuery())
        }).then(result => {
            let rows = result.recordset;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).json(rows);
            sql.close();
        }).catch(err => {
            res.status(500).send({message: `${err}`});
            sql.close();
        });
    });

    router.get("/totalTests", (req, res) => {
        new sql.ConnectionPool(config188()).connect().then(pool => {
            return pool.request().query(totalTestsByCycleQuery())
        }).then(result => {
            let rows = result.recordset;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).json(rows);
            sql.close();
        }).catch(err => {
            res.status(500).send({message: `${err}`});
            sql.close();
        });
    });
    router.get("/jiras", (req, res) => {
        new sql.ConnectionPool(configDWH).connect().then(pool => {
            return pool.request().query(jirasByCyclesQuery())
        }).then(result => {
            let rows = result.recordset;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).json(rows);
            sql.close();
        }).catch(err => {
            res.status(500).send({message: `${err}`});
            sql.close();
        });
    });

}


router.post("/updateData", (req, res) => {
  const { id, body } = req.body;
  console.log("-------got data from client-----");
  console.log(id);
  console.log(body);
  console.log(body.message.Oven);
  cyclesStr=body.message.cycle;
  database=body.message.DB;
  getSqlData();
  return res.json({ success: true });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));