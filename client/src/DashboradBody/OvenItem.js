import React from 'react';
import './OvenItem.css';
import Loader from "../reusableComponents/Loader";


class OvenItem extends React.Component{

    ovenState(state){
        if (state=== 'Active')
            return (<div><span className="green"/></div>)
        else return (<div><span className="yellow"/></div>)
    }

    render(){
    const DotGreen="dotOven green";
    const DotYellow="dotOven yellow";
    let ovenview=null;
    if (this.props.data!=null) {
    if (this.props.data.get("Name") != null) {
        const data = this.props.data;
        console.log(data.get("Name"),data.get("Name_"));
        ovenview = <div className="oven-wrapper" key={data.get("Name")}>
            <div className="oven-section1" alt={this.props.data.get("ChamberStatusAdditionalInfo")}>
                <div className={this.props.data.get("state") == "Active" ? DotGreen : DotYellow}></div>
                <div className="ovnTitle">{data.get("oven")}</div>
                <div> CurrentTemperature {data.get("CurrentTemperature")} C</div>
            </div>
            <div className="oven-section2">
                <div className="profile-sec2 inner-border">Profile:{data.get("ProgramName")}</div>
                <div className="inner-border">Mode: {data.get("mode")}</div>
                <div
                    className="inner-border">Goal:{data.get("GoalTemperature") != "" ? (data.get("GoalTemperature")) : ("0")} C
                </div>

            </div>
            <div className="oven-section3">
                <div
                    className="inner-border">ReadyForSelfTest: {data.get("ReadyForSelfTest") != null ? data.get("ReadyForSelfTest") : 0}</div>
                <div
                    className="inner-border">Available: {data.get("Available") != null ? data.get("Available") : 0}</div>
                <div
                    className="sec3-2rows inner-border">Found: {data.get("Found") != null ? data.get("Found") : 0}</div>
                <div className="inner-border">NotFound: {data.get("NotFound") != null ? data.get("NotFound") : 0}</div>
                <div
                    className="inner-border">NotAvailable: {data.get("NotAvailable") != null ? data.get("NotAvailable") : 0}</div>
            </div>
            {/*<div className="oven-section4">*/}
            {/*analytics*/}
            {/*<ul>*/}
            {/*<li>FLX50000 hasnt been used for 2 weeks</li>*/}
            {/*</ul>*/}
            {/*</div>*/}
        </div>
    }
}


    return(
        <div>
            {ovenview ? ovenview : <Loader/>}
        </div>
    )
}
}

export default OvenItem;