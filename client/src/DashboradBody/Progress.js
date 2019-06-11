import React from 'react';
import './Progress.css';
import PieChart from 'react-minimal-pie-chart';
import Loader from '../reusableComponents/Loader';


 function progressCalc(data) {

     let array = [];
     let runningAndCompleted = 0;
     let failed = 0;
     for (var i = 0; i <= data.length; i++) {
         for (var k in data[i]) {
             if (k == 'Status') {
                 if (data[i][k] == 'TimeOut' || data[i][k] == 'Completed' || data[i][k] == 'Running') {
                     runningAndCompleted++;
                 }
             }
         }
     }
     for (var z = 0; z <= data.length; z++) {
         for (var b in data[z]) {
             if (b == 'Result') {
                 if (data[z][b] == 'FailWithException') {
                     failed++;
                 }
             }
         }
     }
         array[0] = Math.round((runningAndCompleted / data.length) * 100);
         array[1] = failed;
         array[2]= Math.round(((runningAndCompleted-failed) / data.length) * 100);
        return array;

 }
     const Progress = (props) => {

         return (
             <div>{props.data.length>0 ? (
                 <div className="wrapper">
                         <div className="parameters">
                             <div>Progress</div>
                             <PieChart
                                 data={[{
                                     value: progressCalc(props.data)[0],
                                     color: progressCalc(props.data)[0] >80 ? '#50c156': '#e3e34f'
                                 }]}
                                 style={{height: '70px'}}
                                 totalValue={100}
                                 lineWidth={20}
                                 label={({ data, dataIndex }) =>
                                     Math.round(data[dataIndex].percentage) + '%'
                                 }
                                 labelStyle={{
                                     fontSize: '25px',
                                     fontFamily: 'sans-serif'
                                 }}
                                 labelPosition={0}
                             />

                         </div>
                         <div className="parameters">
                             <div ><span style={{fontSize:'20px'}}>Failed: <span style={{color:'red'}}>{progressCalc(props.data)[1]}</span></span></div>
                         </div>
                        <div className="parameters">
                            <div>Pass Rate</div>
                            <PieChart
                                data={[{
                                    value: progressCalc(props.data)[2],
                                    color: progressCalc(props.data)[2] >75 ? '#50c156': '#e3e34f'
                                }]}
                                style={{height: '70px'}}
                                totalValue={100}
                                lineWidth={20}
                                label={({ data, dataIndex }) =>
                                    Math.round(data[dataIndex].percentage) + '%'
                                }
                                labelStyle={{
                                    fontSize: '25px',
                                    fontFamily: 'sans-serif'
                                }}
                                labelPosition={0}
                            />

                        </div>

                 </div>
                 ):(
                     <Loader/>
                 )
             }
             </div>
         )
     }



export default Progress;