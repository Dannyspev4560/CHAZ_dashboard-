import React from 'react';
import DashboardBody from "./DashboardBody";
import { Menu } from 'semantic-ui-react';
import './Main.css';
import Loader from "./reusableComponents/Loader";
import axios from "axios";

class Main extends React.Component {
    state = {

        intervalIsSet: false,
        activeData:{},
        OvensUtilizationDeneb:[],
        OvensUtilizationEnif:[],
        OvensState:[],

    };

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

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
                console.log(this.state.OvensUtilizationDeneb);
                //this.Map_OvenData_ByName();//removeLater
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:3002/api/setupStatusesEnif',{})
            .then((res)=>{
                this.setState({OvensUtilizationEnif:res.data});//here im returning res instead of res.data
                console.log(this.state.OvensUtilizationEnif);
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
        return(
            <div>
                <h2>Wait...</h2>
            </div>
        )
    }
    render() {


        const { activeItem } = this.state;
        return (
            <div>
                <div >
                    <Menu >
                        <Menu.Item
                            className="tabs"
                            name='Swift'
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
                    </Menu>
            </div>
                <div className={activeItem === 'Swift' ? "visibilityVisible" : "visibilityHidden"} >
                   <DashboardBody title="Swift" ovensState={this.state.OvensState} ovensData={this.Map_OvenData_ByName()}/>
                </div>
                <div className={activeItem === 'Sunbird' ? "visibilityVisible" : "visibilityHidden"} >
                    <DashboardBody title="Sunbird" />
                </div>
            </div>
        );
    }
}

export default Main;