/**
 * Created by WebStorm
 * User : zhumengyue
 * Date : 2018/6/23
 * Time : 14:14
 * Desc :
 */
import React from 'react';
import { connect } from 'dva';
import Item from '../../components/NoteItem';
import styles from './index.css';

class Note extends React.Component{

  constructor(props) {
    super(props)
    this.dispatch = props.dispatch;
  }

  addNote = () => {
    this.dispatch({ type: 'note/addNote' })
  }

  delNote = (id) => {
    this.dispatch({ type: 'note/delNote', payload: { id } })
  }

  delAllNote = () => {
    this.dispatch({ type: 'note/delAllNote' })
  }

  onfocusHandler = (id) => {
    this.dispatch({ type: 'note/onfocus', payload: { id }})
  }

  onblurHandler = (id) => {
    const content = document.getElementById(id).childNodes[1].innerHTML;
    if (content) this.dispatch({ type: 'note/saveNote', payload: { id, content } })
  }

  mousedownHandler = (e) => {
    this.dispatch({
      type: 'note/clickNote',
      payload: e,
    })
    e.stopPropagation();

    if(e.target.className === 'noteTitle') {
      document.addEventListener('mousemove', this.mousemoveHandler, false);
    } else if(e.target.className === 'drag') {
      document.addEventListener('mousemove', this.mousescaleHandler, false);
    }
  }

  mouseupHandler = (e) => {
    let obj = e.target.parentNode;
    if (obj.className === 'note' && obj.childNodes[1].innerHTML)
      this.dispatch({ type: 'note/saveNote', payload: { id: obj.id, content: obj.childNodes[1].innerHTML } })

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

  componentDidMount() {
    document.addEventListener('mousedown', this.mousedownHandler, false);
    document.addEventListener('mouseup', this.mouseupHandler, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.mousedownHandler, false)
    document.removeEventListener('mouseup', this.mouseupHandler, false)
  }

  render() {
    const { note } = this.props;
    const NoteItems = note.noteItem.map(item => {
      return (
        <Item
          {...item}
          key={item.id}
          delNote={this.delNote}
          onblur={this.onblurHandler}
          onfocus={this.onfocusHandler}
        />
      )
    })

    return(
      <div>
        <input type="button" value="新增便利贴" id="addNote" onClick={this.addNote} className={styles.btn}/>
        <input type="button" value="清除所有便利贴" id="removeAllNote" onClick={this.delAllNote} className={styles.btn}/>
        <hr />
        {NoteItems}
      </div>
    )
  }
}

export default connect(({note})=>({note}))(Note);
