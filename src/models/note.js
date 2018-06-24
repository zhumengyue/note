import {getNote} from '../services/note';

export default {

  namespace: 'note',
  state: {
    // 便利贴信息
    noteItem: [],

    // 当前item相对位置
    divLeft: 0,
    divTop: 50,
    zIndex: 0,

    // 移动、缩放等相关位置信息
    relplace: {
      _startX  : 0,
      _startY  : 0,
      _offsetX : 0,
      _offsetY : 0
    },

    // 当前被操作对象
    dragObj : null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({pathname}) => {
        if(pathname === '/')
          dispatch({type: 'loadData'})
      })
    },
  },

  effects: {
    *getNote({payload},{call,put}) {
      const data = yield call(getNote)
      yield put({type: 'save', payload: {noteItem: data.data}})
    },
    *addNote({ payload },{ call, put, select}) {
      let { divLeft, divTop } = yield select(state=>state.note);
      let newItem;

      if (payload) {
        const { key, value } = payload;
        newItem = [{
          id: key,
          content : value[0],
          width   : parseInt(value[1]),
          height  : parseInt(value[2]),
          left    : parseInt(value[3]),
          top     : parseInt(value[4]),
          zIndex  : parseInt(value[5]),
        }]
      } else {
        newItem = [{
          id: new Date().getTime(),
          content: '',
          width: 180,
          height: 170,
          left: divLeft,
          top: divTop,
          zIndex: 0,
        }];
      }

      const preitem = yield select(state=>state.note.noteItem)
      const noteItem = preitem.concat(newItem)

      divLeft += 200;
      if(divLeft >= 1200) {
        divTop += 200;
        divLeft = 0;
      }
      yield put({ type: 'save', payload: { noteItem, divLeft, divTop } })
    },

    *clickNote({ payload },{ call, put, select}) {
      let { dragObj, zIndex, relplace } = yield select(state=>state.note);
      let { _startX, _startY, _offsetX, _offsetY} = relplace;

      if (payload.target.className === 'noteTitle') {
        dragObj = payload.target.parentNode;
        zIndex += 1;
        _startX = payload.clientX;
        _startY = payload.clientY;
        _offsetX = dragObj.offsetLeft;
        _offsetY = dragObj.offsetTop;

        relplace = { _startX, _startY, _offsetX, _offsetY };

        yield put({ type: 'save', payload: { relplace, zIndex, dragObj }})
      } else if (payload.target.className === 'drag') {
        dragObj = payload.target.parentNode;
        _startX = payload.clientX;
        _startY = payload.clientY;
        _offsetX = dragObj.offsetLeft;
        _offsetY = dragObj.offsetTop;
        zIndex += 1;
        relplace = { _startX, _startY, _offsetX, _offsetY };
        yield put({ type: 'save', payload: { relplace, dragObj, zIndex }})
      }

    },

    *dragNote({ payload },{ call, put, select}) {
      let { dragObj, zIndex, relplace,noteItem } = yield select(state=>state.note);
      const { _startX, _startY, _offsetX, _offsetY} = relplace;
      noteItem.find((value) => {
        if (value.id == dragObj.id) {
          value.left = _offsetX + payload.clientX - _startX - 5;
          value.top  = _offsetY + payload.clientY - _startY - 5;
          value.zIndex = zIndex
        }
      })

      yield put({ type: 'save', payload: { noteItem } })
    },

    *scaleNote({ payload },{ call, put, select}) {
      let { dragObj, relplace, noteItem, zIndex } = yield select(state=>state.note);
      const { _offsetX, _offsetY} = relplace;
      noteItem.find((value) => {
        if (value.id == dragObj.id) {
          value.width = payload.clientX - _offsetX +5;
          value.height = payload.clientY - _offsetY +5;
          value.zIndex = zIndex;
        }
      })
      yield put({ type: 'save', payload: { noteItem } })
    },

    *delNote({ payload },{ call, put, select}) {
      let noteItem = yield select(state=>state.note.noteItem)
      noteItem = noteItem.filter(item => item.id != payload.id);
      yield put({ type: 'save', payload: { noteItem }})
      localStorage.removeItem(payload.id)
    },

    *loadData({},{put}) {
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i),
            value = localStorage.getItem(key).split('|&|');
        yield put({ type: 'addNote', payload: { key, value }})
      }
    },

    *saveNote({payload},{put,select}) {
      const { id, content } = payload;
      let noteItem = yield select(state => state.note.noteItem);
      noteItem.find((value)=> {
        if (value.id == id) {
          value.content = content
        }
      })
      let item = noteItem.filter(item => item.id == id)[0]
      yield put({ type: 'save', payload: { noteItem }})
      let value;
      if (content ? content : item.content) {
        console.log('yes')
        value = (content ? content : item.content) + '|&|' + item.width + '|&|' + item.height + '|&|' + item.left + '|&|' + item.top + '|&|' + item.zIndex;
      }
      localStorage.setItem(id,value)
    },

    *delAllNote({},{put}) {
      yield put({
        type: 'save',
        payload: {
          noteItem : [],
          divLeft  : 0,
          divTop   : 50,
          zIndex   : 0,
          relplace: {
            _startX  : 0,
            _startY  : 0,
            _offsetX : 0,
            _offsetY : 0
          },
        }
      })
      localStorage.clear();
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },

};
