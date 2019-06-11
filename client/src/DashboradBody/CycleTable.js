import React from 'react';
import './CycleTable.css';
import Loader from '../reusableComponents/Loader';
import { Progress } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function totalValues(data,key) {
    let totalVal=0;
    for (var i=0;i<=data.length;i++) {
        for (var k in data[i]) {
            if (k == key) {
                totalVal += data[i][k];
            }
        }
    }
    return totalVal;
}
function getValuePrecentage(value,cycleVals){
    return ((value/(cycleVals.Ex_Running + cycleVals.Ex_Completed + cycleVals.Ex_TimeOut))*100).toFixed(0)
}
//TODO: note that i put val of 25-that means that if its below 25 percent it wont show
function showPrecentage(text,val){
    if (val>0) {
        return val > 30 ? (text+":" + val + "%") : val+"%"
    }
    else return ""
}


const CycleTable=(props)=>{


    let view=null;
    let rows= props.data.map((row)=>{return(
        <tr className="tableContent" key={row.ID}>
            <th>{row.ID}</th>
            <th className="wrapLongWord">{row.Description}</th>
            <th>
                <Progress multi style={{width:'300px',margin:'0.2em',height:'1.8em'}}>
                    <Progress bar animated striped value={getValuePrecentage(row.Ex_Running,row)} color="success">
                        {showPrecentage('Running',getValuePrecentage(row.Ex_Running,row))}
                    </Progress>
                    <Progress bar striped  value={getValuePrecentage(row.Ex_Passed,row)}>
                        {showPrecentage('Passed',getValuePrecentage(row.Ex_Passed,row))}
                    </Progress>
                    <Progress bar color="danger" value={getValuePrecentage(row.Ex_Failed,row)}>
                        {showPrecentage('Failed',getValuePrecentage(row.Ex_Failed,row))}
                    </Progress>
                    <Progress bar striped color="info" value={getValuePrecentage(row.Ex_Pending,row)}>
                        {showPrecentage('Pending',getValuePrecentage(row.Ex_Pending,row))}
                    </Progress>
                </Progress>
            </th>

        </tr>)
    });

    if (props.data.length>0)
    {

        view =
            <table >
            <thead >
            <tr >
                <th>Cycle ID</th>
                <th>Cycle Name</th>
                <th>Cycle Status</th>

            </tr>
            </thead>
            <tbody >
            {rows}
            </tbody>
            <tfoot>
            <tr >
                <th></th>
                <th></th>
                <th>
                    <Progress multi style={{width:'300px',margin:'0.2em',height:'3em'}}>
                    <Progress bar striped animated value={totalValues(props.data,"Ex_Running")} color="success" style={{fontSize:'1.5em'}}>
                        {showPrecentage('Running',totalValues(props.data,"Ex_Running"))}
                    </Progress>
                    <Progress bar  striped value={totalValues(props.data,"Ex_Passed")}>
                        {showPrecentage('Passed',totalValues(props.data,"Ex_Passed"))}
                    </Progress>
                    <Progress bar color="danger" value={totalValues(props.data,"Ex_Failed")}>
                        {showPrecentage('Failed',totalValues(props.data,"Ex_Failed"))}
                    </Progress>
                    <Progress bar striped color="info" value={totalValues(props.data,"Ex_Pending")}>
                        {showPrecentage('Pending',totalValues(props.data,"Ex_Pending"))}
                    </Progress>
                </Progress>
                </th>
            </tr>
            </tfoot>
        </table>

    }
    else{
        view=<Loader/>
    }
    return(
        <div>
            {view!=null ?(
                <div className="ui fixed table" style={{fontWeight:'none'}}>
                    {view}
                </div>
            ):(
                <div>
                    <Loader/>
                </div>
            )
            }
        </div>
    )
}

export default CycleTable;