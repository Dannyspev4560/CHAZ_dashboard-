import React from 'react';
import DashboardBody from "./DashboardBody";
import { Menu } from 'semantic-ui-react';
import './Main.css';
import Loader from "./reusableComponents/Loader";

class Main extends React.Component {
    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

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
                <div>
                    {activeItem!="" ? <DashboardBody/>: (<div><h2>NA</h2></div>)}
                </div>
            </div>
        );
    }
}

export default Main;