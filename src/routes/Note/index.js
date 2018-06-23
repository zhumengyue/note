/**
 * Created by WebStorm
 * User : zhumengyue
 * Date : 2018/6/23
 * Time : 14:14
 * Desc :
 */
import React from 'react';
import { connect } from 'dva';
import styles from './index.css';
import Item from '../../components/NoteItem';

class Note extends React.Component{
  constructor(props) {
    super(props)
    this.dispatch = props.dispatch;
  }

  addNote = () => {
    this.dispatch({ type: 'note/addNote' })
  }

  delNote = (id) => {
    this.dispatch({
      type: 'note/delNote',
      payload: {
        id
      }
    })
  }

  delAllNote = () => {
    this.dispatch({ type: 'note/delAllNote' })
  }

  mousedownHandler = (e) => {
    this.dispatch({
      type: 'note/clickNote',
      payload: e,
    })

    if(e.target.className === 'noteTitle') {
      document.addEventListener('mousemove', this.mousemoveHandler, false);
    } else if(e.target.className === 'drag') {
      document.addEventListener('mousemove', this.mousescaleHandler, false);
    }
  }

  mouseupHandler = () => {
    document.removeEventListener('mousemove', this.mousemoveHandler, false);
    document.removeEventListener('mousemove', this.mousescaleHandler, false);
  }

  mousescaleHandler = (e) => {
    this.dispatch({
      type: 'note/scaleNote',
      payload: e
    })
  }

  mousemoveHandler = (e) => {
    this.dispatch({
      type: 'note/dragNote',
      payload: e
    })
  }

  getNote = () => {
    this.dispatch({
      type: 'note/getNote',
    })
  }


  componentDidMount() {
    document.addEventListener('mousedown', this.mousedownHandler, false)
    document.addEventListener('mouseup', this.mouseupHandler, false)
    // document.querySelector('#addNote').addEventListener('click', this.addNote ,false)
  }

  render() {
    const { dispatch, note } = this.props;
    const NoteItems = note.noteItem.map(item => {
      return (
        <Item
          {...item}
          key={item.id}
          delNote={this.delNote}
        />
      )
    })

    return(
      <div>
        <input type="button" value="新增便利贴" id="addNote" onClick={this.addNote} className={styles.btn}/>
        <input type="button" value="清除所有便利贴" id="removeAllNote" onClick={this.delAllNote} className={styles.btn}/>
        <input type="button" value="查看存储数据" id="getNote" onClick={this.getNote} className={styles.btn}/>
        <hr />
        {NoteItems}
      </div>
    )
  }
}

export default connect(({note})=>({note}))(Note);
