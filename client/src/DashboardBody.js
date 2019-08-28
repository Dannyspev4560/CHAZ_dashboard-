import React from 'react';
import './DashboardBody.css';
import Progress from './DashboradBody/Progress';
import CycleTable from './DashboradBody/CycleTable';
import OvensView from './DashboradBody/OvensView.js';
import axios from 'axios';
import Title from './Title';
import FilterBar from './DashboradBody/FilterBar';
import JirasChart from './DashboradBody/JirasChart';


class DashboardBody extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            id: 0,
            message: null,
            intervalIsSet: false,
            objectToUpdate: null,
            loading: true,
            table_data: [],
            executions_data:[],
            chamber_data:[],
            setups_status:[],
            activeIndex: null,
            DB:[],
            Oven:[],
            cycle:[],
            //ovens:this.props.ovensState,
            IsDataToServerOK:true,
            // ovenUtilsDeneb:[],
            // ovenUtilsEnif:[],
            jiraData:[],
        };
        this.getDataFromDb = this.getDataFromDb.bind(this);
    }


    componentDidMount() {
        this.getDataFromDb();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getDataFromDb, 60000);//timeout currently one minute
            this.setState({ intervalIsSet: interval });
        }
    }

    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({ intervalIsSet: null });
        }
    }


    getDataFromDb = ()=> {

        axios.get('http://localhost:3002/api/cycles', {})
            .then((res) => {
                this.setState({table_data: res.data});
                console.log(this.state.table_data);
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:3002/api/executions', {})
            .then((res) => {
                this.setState({executions_data: res.data});
                console.log(this.state.executions_data);

            })
            .catch(function (error) {
                console.log(error);
            });

        axios.get('http://localhost:3002/api/jiras',{})
            .then((res)=>{
                this.setState({jiraData:res.data});//here im returning res instead of res.data
                console.log(this.state.jiraData);
            })
            .catch(function (error) {
                console.log(error);
            });
    };


    toDB = (e)=>{
      console.log(e);
      for (var k in e){
          console.log(`${k} : ${e[k]}`);
          if (k==="Oven"){
              this.setState({Oven:e[k]});
              console.log(this.state.Oven)
          }
          if(k==="DB")
              this.setState({DB:e[k]});
          if (e[k]===0 || e[k]==="")
          {
              this.setState(prevState => ({
                  IsDataToServerOK: !prevState.IsDataToServerOK
              }))
              return;
          }
      }
        axios.post("http://localhost:3002/api/updateData", {
            id: 1,
            body: { message: e }
        }).then(function (response) {
            console.log("status 200 from server" );
        })
            .catch(function (error) {
                console.log(error);
                window.alert(error);
            });
      this.setState({IsDataToServerOK:true});
      this.componentDidMount();
    };

    // Map_OvenData_ByName(){
    //     var mappedData=[];
    //     const ovensState=this.props.ovensState;
    //     const ovensUtilDeneb=this.state.ovenUtilsDeneb;
    //     const ovensUtilEnif=this.state.ovenUtilsEnif;
    //     if(ovensState!=null) {
    //         if (ovensState.length > 0 && ovensUtilDeneb.length > 0 && ovensUtilEnif.length > 0) {
    //             const ovensUtil = ovensUtilDeneb.concat(ovensUtilEnif);//add in future more databases if needed
    //             const ovenArr = ovensState.filter(obj => obj.oven.toLowerCase().includes("ovn"));
    //
    //
    //             for (var ovenArrIndex in ovenArr) {
    //
    //                 for (var ovenUtilArrIndex = 0; ovenUtilArrIndex < ovensUtil.length; ovenUtilArrIndex++) {
    //                     for (var ovnUtilprop in ovensUtil[ovenUtilArrIndex]) {
    //                         if (ovnUtilprop == "Name") {
    //                             var nameStr = ovensUtil[ovenUtilArrIndex][ovnUtilprop].toLowerCase().replace(/e|rack|-|l|r/g, "");
    //                             var namestr2 = ovenArr[ovenArrIndex]["oven"].replace("-", "").toLowerCase();
    //                             if (nameStr.includes(namestr2)) {
    //
    //                                 var mappedObj = new Map();
    //                                 for (var tmpKey in ovensUtil[ovenUtilArrIndex]) {
    //                                     mappedObj.set(tmpKey, ovensUtil[ovenUtilArrIndex][tmpKey])
    //                                 }
    //                                 for (var tmpKey_ in ovenArr[ovenArrIndex]) {
    //                                     mappedObj.set(tmpKey_, ovenArr[ovenArrIndex][tmpKey_])
    //                                 }
    //
    //                                 if (mappedData.filter(rackObj => rackObj.get("Name") == mappedObj.get("Name")).length == 0)//check if doesnt exist already
    //                                     mappedData.push(mappedObj);
    //                             }
    //                         }
    //                     }
    //
    //                 }
    //
    //             }
    //         }
    //     }
    //
    //     return mappedData
    // }

    ConvObjToArr_ovenData(){
        var mappedOvenData=new Map();
        if (this.state.chamber_data.length>0 && this.state.setups_status.length>0){
            const chamber=this.state.chamber_data[0];
            const setups=this.state.setups_status;
            for(var k in chamber )
            {
                mappedOvenData.set(k,chamber[k])
            }
            let arr=[];
            let cnt=0;
            for(let i=0;i<setups.length;i++)
            {

                for(var z in setups[i] ){
                    arr[cnt]=setups[i][z];
                    if(cnt===1){
                        mappedOvenData.set(arr[1],arr[0]);
                        cnt=0;
                    }
                    else{cnt++};
                }
            }
        }
        return mappedOvenData;
    }

    getOvensNamesFromExecutions(){
        try{
        if(this.state.executions_data!=null && this.state.executions_data.length>0){
        var stationNames=this.state.executions_data.flatMap(execution=>execution.StationName!=null ?execution.StationName.split("-")[1].slice(0, -1):[]);
        var mappedracks=stationNames.filter((v, i, a) => a.indexOf(v) === i);//oven names
        console.log("dashboard.getOvensNamesFromExecutions==>",mappedracks);
        return mappedracks;
        }
        else return 0;}
        catch (e) {
            console.log(`Error : ${e} ,maybe not oven stations :(`);
            return 0;
        }
    }


    render() {

        return (
            <div className="grid-container">
                <div className="header">
                    <div className="">
                        <h1><Title title={this.props.title}/></h1>
                    </div>
                </div>
                <div className="sidebar">
                   <FilterBar data={this.props.ovensState} toDB={(e)=>this.toDB(e)} IsDataToServerOK={this.state.IsDataToServerOK}/>
                </div>
                <div className="dash">
                        <div className="status">
                            <Progress data={this.state.executions_data}/>
                        </div>
                        <div className="table">
                            <CycleTable data={this.state.table_data}/>
                            {/*{postView}*/}
                        </div>
                        <div className="stats">
                            <JirasChart jiraData={this.state.jiraData}/>
                        </div>

                        <div className="ovens">
                            <OvensView  ovensData={this.props.ovensData} ovenNames={this.getOvensNamesFromExecutions()}/>
                        </div>
                </div>
            </div>
        )
    }
}


export default DashboardBody;