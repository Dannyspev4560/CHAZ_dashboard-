import React from 'react';
import './OvensView.css'
import OvenItem from './OvenItem';



class OvensView extends React.Component{



    MapOvenItems(ovenNamerArr,dataArr){
        //console.log(ovenNamerArr);
        var ovenItems=[];
        if (ovenNamerArr.length>0){
            for(var ovenNameIndex in ovenNamerArr) {
                for (var rackIndex in  dataArr) {
                    if (dataArr[rackIndex].get("oven") == ovenNamerArr[ovenNameIndex])
                        var check = ovenNamerArr[0];
                    console.log(check);
                    var tempArr = dataArr.filter(rackObj => rackObj.get("oven") == ovenNamerArr[ovenNameIndex]);
                    if (tempArr.length == 2 && ovenItems.filter(rackObj=>rackObj.get("oven")==ovenNamerArr[ovenNameIndex]).length==0) {
                        var ovnMappedObj = new Map();
                        ovnMappedObj = tempArr[0];
                        ovnMappedObj.set("ReadyForSelfTest", tempArr[0].get("ReadyForSelfTest") + tempArr[1].get("ReadyForSelfTest"));
                        ovnMappedObj.set("NotFound", tempArr[0].get("NotFound") + tempArr[1].get("NotFound"));
                        ovnMappedObj.set("Available", tempArr[0].get("Available") + tempArr[1].get("Available"));
                        ovnMappedObj.set("NotAvailable", tempArr[0].get("NotAvailable") + tempArr[1].get("NotAvailable"));
                        ovnMappedObj.set("Found", tempArr[0].get("Found") + tempArr[1].get("Found"));
                        ovnMappedObj.set("Name_", tempArr[1]);
                        ovenItems.push(ovnMappedObj);
                    }
                }
            }
            let view =ovenItems.map(obj=>{return(
                <OvenItem  data={obj}/>
            )});
            return (
                <div className="ovensDisplay">
                    {view}
                </div>
            )

        }
         else return (
            <div className="ovensDisplay">
                <h2>Please Choose oven</h2>
            </div>
        )
    }


    render() {//TODO :in case of having several oven items in need to use map


        return (
            <div  >
               {this.MapOvenItems(this.props.ovenNames,this.props.ovensData)}
            </div>
        )
    }
};

export default OvensView;

