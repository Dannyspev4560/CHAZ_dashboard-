import React from 'react';
import DashboardBody from "./DashboardBody";
import { Menu } from 'semantic-ui-react';
import './Main.css';
import Loader from "./reusableComponents/Loader";
import axios from "axios";
import Settings from './Settings';

class Main extends React.Component {
    state = {

        intervalIsSet: false,
        activeData:{},
        OvensUtilizationDeneb:[],
        OvensUtilizationEnif:[],
        OvensState:[],
        RunningCyclesEnif:[],
        PresentedCyclesList:[]//this is very impotant variable dude

    };

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name })
        if (name=='check')
        {
            var msg=[
                {id: 33,
                cycles:"9355,9354,9353,9352,9351,9350",
                DB:"Enif_Production_35"},
                {id:34,
                    cycles:"9355,9354,9353,9352,9351,9350",
                    DB:"Enif_Production_35"
                }

            ];
            axios.post("http://localhost:3002/api/tmp", {
                id: 1,
                body: { message: msg }
            }).then(function (response) {
                console.log("status 200 from server" );
            })
                .catch(function (error) {
                    console.log(error);
                    window.alert(error);
                });

            this.setState({activeItem:'Swift'});
        }

    };

    componentDidMount() {
        this.getDataFromDbMain();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getDataFromDbMain, 120000);//timeout currently 2 minutes
            this.setState({ intervalIsSet: interval });
        }
    }

    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({ intervalIsSet: null });
        }
    }

    getDataFromDbMain = ()=> {

        axios.get('http://localhost:3002/api/runningCyclesEnif',{})
            .then((res)=>{
                this.setState({RunningCyclesEnif:res.data});
                console.log("from Main ==> ",this.state.RunningCyclesEnif);
                this.render();
                //this.Map_OvenData_ByName();//removeLater
                this.mainMenuView();
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:3002/api/allOvens',{})
            .then((res)=>{
                this.setState({OvensState:res.data});
                console.log("from Main ==> ",this.state.OvensState);
                this.render();
                //this.Map_OvenData_ByName();//removeLater
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:3002/api/setupStatusesDeneb',{})
            .then((res)=>{
                this.setState({OvensUtilizationDeneb:res.data});//here im returning res instead of res.data
                console.log("from Main ==> ",this.state.OvensUtilizationDeneb);
                //this.Map_OvenData_ByName();//removeLater
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:3002/api/setupStatusesEnif',{})
            .then((res)=>{
                this.setState({OvensUtilizationEnif:res.data});//here im returning res instead of res.data
                console.log("from Main ==> ",this.state.OvensUtilizationEnif);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    Map_OvenData_ByName(){
        var mappedData=[];
        const ovensState=this.state.OvensState;
        const ovensUtilDeneb=this.state.OvensUtilizationDeneb;
        const ovensUtilEnif=this.state.OvensUtilizationEnif;
        if(ovensState!=null) {
            if (ovensState.length > 0 && ovensUtilDeneb.length > 0 && ovensUtilEnif.length > 0) {
                const ovensUtil = ovensUtilDeneb.concat(ovensUtilEnif);//add in future more databases if needed
                const ovenArr = ovensState.filter(obj => obj.oven.toLowerCase().includes("ovn"));

                for (var ovenArrIndex in ovenArr) {

                    for (var ovenUtilArrIndex = 0; ovenUtilArrIndex < ovensUtil.length; ovenUtilArrIndex++) {
                        for (var ovnUtilprop in ovensUtil[ovenUtilArrIndex]) {
                            if (ovnUtilprop == "Name") {
                                var nameStr = ovensUtil[ovenUtilArrIndex][ovnUtilprop].toLowerCase().replace(/e|rack|-|l|r/g, "");
                                var namestr2 = ovenArr[ovenArrIndex]["oven"].replace("-", "").toLowerCase();
                                if (nameStr.includes(namestr2)) {

                                    var mappedObj = new Map();
                                    for (var tmpKey in ovensUtil[ovenUtilArrIndex]) {
                                        mappedObj.set(tmpKey, ovensUtil[ovenUtilArrIndex][tmpKey])
                                    }
                                    for (var tmpKey_ in ovenArr[ovenArrIndex]) {
                                        mappedObj.set(tmpKey_, ovenArr[ovenArrIndex][tmpKey_])
                                    }

                                    if (mappedData.filter(rackObj => rackObj.get("Name") == mappedObj.get("Name")).length == 0)//check if doesnt exist already
                                        mappedData.push(mappedObj);
                                }
                            }
                        }

                    }

                }
            }
        }

        return mappedData
    }


    mainMenuView= ()=>{

        const cycles=this.state.RunningCyclesEnif;
        var cyclesList=[];//add later on costume option
        var reducedByFW=(cycles.map(fwobj=>fwobj.FirmwareVersion)).filter((v, i, a) => a.indexOf(v) === i);

        for (var FWkey in reducedByFW){
            var tmpCyclesStr="";
            var lastkeyItterated=0;
            for(var cyclekey in cycles){
                if (cycles[cyclekey].FirmwareVersion==reducedByFW[FWkey]){
                    if (tmpCyclesStr=="")
                        tmpCyclesStr =cycles[cyclekey].ID;
                    else    tmpCyclesStr+="," + cycles[cyclekey].ID;
                    lastkeyItterated=cyclekey;
                }

            }
            cyclesList.push({
                id:FWkey+1,
                cycles:tmpCyclesStr,
                labId:cycles[lastkeyItterated].LabID,
                project: cycles[lastkeyItterated].Project
            });
        }
        this.setState({PresentedCyclesList:cyclesList});
        console.log(cyclesList);
        axios.post("http://localhost:3002/api/tmp", {
            id: 101,
            body: { message: this.state.PresentedCyclesList }
        }).then(function (response) {
            console.log(response );
        })
            .catch(function (error) {
                console.log(error);
            });

    }
    render() {


        const { activeItem } = this.state;
        return (
            <div>
                <div >
                    <Menu >
                        <Menu.Item
                            className="tabs"
                            name='Swift'//here i should give the id
                            active={activeItem === 'Swift'}
                            onClick={this.handleItemClick}>
                            Swift
                        </Menu.Item>
                        <Menu.Item
                            className="tabs"
                            name='Sunbird'
                            active={activeItem === 'Sunbird'}
                            onClick={this.handleItemClick}>
                            Sunbird
                        </Menu.Item>
                        <Menu.Item
                            className="tabs "
                            name='check'
                            active={activeItem === 'check'}
                            onClick={this.handleItemClick}>
                            check
                        </Menu.Item>
                        <Menu.Item
                            position='right'
                            className="tabs "
                            name='Settings'
                            active={activeItem === 'Settings'}
                            onClick={this.handleItemClick}>
                            Settings
                        </Menu.Item>
                    </Menu>
            </div>
                <div className={activeItem === 'Swift' ? "visibilityVisible" : "visibilityHidden"} >
                   <DashboardBody title="Swift" ovensState={this.state.OvensState} ovensData={this.Map_OvenData_ByName()}/>
                </div>
                <div className={activeItem === 'Sunbird' ? "visibilityVisible" : "visibilityHidden"} >
                    <DashboardBody title="Sunbird" ovensState={this.state.OvensState} ovensData={this.Map_OvenData_ByName()}/>
                </div>
                <div className={activeItem === 'Settings' ? "visibilityVisible" : "visibilityHidden"}>
                    <Settings/>
                </div>
            </div>
        );
    }
}

export default Main;