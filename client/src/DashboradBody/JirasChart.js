import React from 'react';
import { Chart } from "react-google-charts";
import {ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";
import Loader from "../reusableComponents/Loader";
const JirasChart=(props)=>{


    function jiraChartCreator() {
        if(props.jiraData.length>0){
            var mappedKeys=props.jiraData.map(obj=>obj.Issue_Key);
            mappedKeys=Object.entries(mappedKeys.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {}));
            var dataToChart=[];
            for(var i in mappedKeys)
            {
                dataToChart.push({name:mappedKeys[i][0],count:mappedKeys[i][1].toString()})
            }
            console.log(dataToChart);
            return(
                <div >
                    <ComposedChart layout="vertical" width={250} height={260} data={dataToChart}
                                   margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                        <CartesianGrid stroke='#f5f5f5'/>
                        <XAxis type='number'/>
                        <YAxis dataKey="name" type="category"/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey='count'  barSize={12} fill='#72a3db'/>

                    </ComposedChart>
                </div>
            )

        }
        else return (
            <div>
                <h2>NO Jiras</h2>
            </div>
        )

    }

    return(
        <div >
            {jiraChartCreator()}
        </div>
    )
};

export default JirasChart;
/*<Chart

    width={'270px'}
    height={'200px'}
    chartType="BarChart"
    loader={<Loader/>}
    data={dataToChart}
    options={{
        color:'red',
        title: 'Jira count in presented cycles',
        chartArea: { width: '40%' },
        hAxis: {

            minValue: 0,
        },
        vAxis: {

        },
    }}
    // For tests
    rootProps={{ 'data-testid': '1' }}
/>
*/