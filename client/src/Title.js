import React from 'react';
import './Title.css';

const Title=(props)=>{
    return (
        <div className="title">
            <div className="">CHAZ Dashboard : {props.title}</div>
        </div>
    )
}

export default Title;