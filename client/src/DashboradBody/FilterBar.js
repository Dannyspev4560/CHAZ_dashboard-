import React from 'react';
import './FilterBar.css';
import { Accordion, Icon,Form, Input, TextArea, Button, Select,Dropdown } from 'semantic-ui-react';


const optionsD=[{key:'Swift_Prod_33',text:'Swift_Prod_33',value:'Swift_Prod_33'},{key:'Enif_Production_35',text:'Enif_Production_35',value:'Enif_Production_35'}]

class FilterBar extends React.Component{
    //TODO: authentication for all 3+ correction to oven input
    state={
    activeIndex:-1,
    chosenData:{
        DB:0,
        Oven:0,
        cycle:0,
        }
};


    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex })
    };
    render(){
        let optionsO=[];
        let cnt=0;
        if(this.props.data.length>0) {
            for (var i in this.props.data) {
                optionsO[cnt] = {
                    key: this.props.data[i].oven,
                    text: this.props.data[i].oven,
                    value: this.props.data[i].oven
                }
                cnt++;
            }
        }
        const { activeIndex } = this.state;
        return(
            <div className="filterBar">
                <Accordion syled>
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                        <Icon name='dropdown' />
                        Filter
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <div className={this.props.IsDataToServerOK ? 'errorMsgHidden' :'errorMsg'}>
                            Please validate your entries
                        </div>
                        <div>
                        <Input type="text" placeholder="choose cycle"
                               value={this.state.chosenData.cycle==0 ? "" : this.state.chosenData.cycle} onChange={e=>this.setState(Object.assign(this.state.chosenData,{cycle:e.target.value}))}/>

                        <Dropdown placeholder="Choose DB" selection options={optionsD} value={this.state.DB} onChange={(e, { value }) => this.setState(Object.assign(this.state.chosenData,{DB:value}))}/>
                        <Dropdown clearable fluid multiple search selection options={optionsO} value={this.state.Oven}   placeholder='Select Oven' onChange={(e, { value }) => this.setState(Object.assign(this.state.chosenData,{Oven:value}))}/>
                        <div>
                        <Button onClick={()=>this.props.toDB(this.state.chosenData)}>set</Button>
                        </div>
                        </div>
                    </Accordion.Content>

                </Accordion>
            </div>
        )
    }
}

export default FilterBar;