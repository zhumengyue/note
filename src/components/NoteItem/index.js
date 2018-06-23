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
    <div className="note" style={{...props}} id={props.id} zindex={props.zIndex}>
      <div className="noteTitle">
        <button className='delIcon' onClick={() => props.delNote(props.id)}>×</button>
      </div>
      <div className="noteContent" contentEditable="true"></div>
      <div className='drag'></div>
    </div>
  )
}

export default Item;
