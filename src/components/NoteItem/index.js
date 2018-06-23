/**
 * Created by WebStorm
 * User : zhumengyue
 * Date : 2018/6/23
 * Time : 14:14
 * Desc :
 */
import React from 'react';
import './index.css'

const Item = (props) => {
  return(
    <div className="note" style={{...props}}>
      <div className="noteTitle">
        <img src={require("../../assets/plus.png")} className="addIcon" alt=""/>
        <img src={require("../../assets/minus.png")} className="delIcon" alt=""/>
      </div>
      <div className="noteContent" contentEditable={true}>{props.content}</div>
    </div>
  )
}

export default Item;
