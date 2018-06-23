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
    this.state = {
      count: 0,
    }
  }

  addNote = () => {
    this.dispatch({
      type: 'note/addNote',
    })
  }

  componentDidMount() {
    document.querySelector('#addNote').addEventListener('click', this.addNote ,false)
  }

  render() {
    const { dispatch, note } = this.props;
    const NoteItems = note.noteItem.map(item => {
      return (
        <Item
          {...item}
          key={item.id}
        />
      )
    })

    return(
      <div>
        <input type="button" value="新增便利贴" id="addNote" className={styles.btn}/>
        <input type="button" value="清除所有便利贴" id="removeAllNote" className={styles.btn}/>
        <hr />
        {NoteItems}
      </div>
    )
  }
}

export default connect(({note})=>({note}))(Note);
