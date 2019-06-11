import React from 'react';
import { Chart } from "react-google-charts";
import Loader from "../reusableComponents/Loader";
const JirasChart=(props)=>{


    function jiraChartCreator() {
        if(props.jiraData.length>0){
            var mappedKeys=props.jiraData.map(obj=>obj.Issue_Key);
            mappedKeys=Object.entries(mappedKeys.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {}));
            var dataToChart=[];
            for(var i in mappedKeys)
            {
                if (i==0){
                    dataToChart.push(['Jiras','Count']);
                    dataToChart.push(mappedKeys[i]);
                }
                else {
                    dataToChart.push(mappedKeys[i]);
                }
            }
            console.log(dataToChart);
            return(
                <div>
                    <Chart
                        width={'250px'}
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