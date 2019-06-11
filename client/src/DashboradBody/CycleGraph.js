import React from 'react';
import PieChart from 'react-minimal-pie-chart';
import './CycleGraph.css';
import Loader from "../reusableComponents/Loader";


let pending=0;
let passed=0;
let failed=0;
let running=0;


class CycleGraph extends React.Component {
    render() {
        let view=<Loader/>

        if (this.props.data.length>0){

            for(let i=0;i<this.props.data.length;i++){
                pending+= this.props.data[i].Ex_Pending;
                passed+=this.props.data[i].Ex_Passed;
                failed+=this.props.data[i].Ex_Failed;
                running+=this.props.data[i].Ex_Running;
            }
            pending= pending == 0 ? 0 : parseInt(pending);
            passed= passed == 0 ? 0 : parseInt(passed);
            failed= failed == 0 ? 0 : parseInt(failed);
            running= running == 0 ? 0 : parseInt(running);

            view=<div className="wrapper-chart">
                <div className="chart-sec">
                <PieChart data={[
                    {
                        title: 'Pending',
                        value: pending,
                        color: '#ffe286'
                    },
                    {
                        title: 'Passed',
                        value: passed,
                        color: '#45c176'
                    },
                    {
                        title: 'Failed',
                        value: failed,
                        color: '#b02d2c',

                    },
                    {
                        title: 'Running',
                        value: running,
                        color: '#55b8cc',
                    }
                ]}

                          lineWidth={20}
                          paddingAngle={-5}
                          lengthAngle={-360}


                          label={({ data, dataIndex }) =>
                              (Math.round(data[dataIndex].percentage)!=0)? `${Math.round(data[dataIndex].percentage)}%`: ''
                          }
                          labelStyle={{
                              fontSize: '8px',
                              fontFamily: 'sans-serif',
                              fontColor: '#fff'}}
                          labelPosition={70}
                          animate


                />
                </div>
                <div className="chart-titles">
                    <div className="titleChart1"><span className="dot yellow"/>Pending</div>
                    <div className="titleChart2"><span className="dot green"/>Passed</div>
                    <div className="titleChart3"><span className="dot red"/>Failed</div>
                    <div className="titleChart4"><span className="dot blue"/>Running</div>
                </div>

            </div>
        }

        return (
            <div >
                {view}
            </div>
        );
    }
}

export default CycleGraph;





