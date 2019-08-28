import React from 'react';
import './Title.css';


const Title=(props)=>{
    function printDate() {

        var today = new Date();
        var now =new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '/' + mm + '/' + yyyy;
        return  now.getHours()+ ":" +now.getMinutes() + "  " + today ;
    }
    return (
        <div className="">
            <div className="title">CHAZ Dashboard : {props.title}</div>
            <div className="side_title">Last update : {printDate()} </div>
        </div>
    )
}

export default Title;