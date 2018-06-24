/**
 * Created by WebStorm
 * User : zhumengyue
 * Date : 2018/6/23
 * Time : 14:15
 * Desc :
 */
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
        if(pathname === '/') dispatch({type: 'loadData'});
      })
    },
  },

  effects: {
    *addNote({ payload },{ put, select}) {
      let { divLeft, divTop } = yield select(state=>state.note);
      let newItem = [];

      if (payload) {
        let value = JSON.parse(payload.value);
        value.zIndex = 0;
        newItem = [value]
        // newItem.find(value => value.zIndex = 0 )
      } else
        newItem = [{
          id      : new Date().getTime(),
          content : '',
          width   : 180,
          height  : 170,
          left    : divLeft,
          top     : divTop,
          zIndex  : 0,
        }];

      const preItem = yield select(state=>state.note.noteItem)
      const noteItem = preItem.concat(newItem)

      divLeft += 200;
      if(divLeft >= 1200) {
        divTop += 200;
        divLeft = 0;
      }
      yield put({ type: 'save', payload: { noteItem, divLeft, divTop } })
    },

    *clickNote({ payload },{ put, select}) {
      let { dragObj, zIndex, relplace } = yield select(state=>state.note);
      let { _startX, _startY, _offsetX, _offsetY } = relplace;

      dragObj = payload.target.parentNode;
      if (payload.target.className === 'noteContent' || payload.target.className === 'noteTitle' || payload.target.className === 'note')
        zIndex += 1;
      _startX = payload.clientX;
      _startY = payload.clientY;
      _offsetX = dragObj.offsetLeft;
      _offsetY = dragObj.offsetTop;
      relplace = { _startX, _startY, _offsetX, _offsetY };

      yield put({ type: 'save', payload: { relplace, zIndex, dragObj }})
    },

    *dragNote({ payload },{ put, select}) {
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

    *scaleNote({ payload },{ put, select}) {
      let { dragObj, relplace, noteItem, zIndex } = yield select(state=>state.note);
      const { _offsetX, _offsetY} = relplace;
      noteItem.find((value) => {
        if (value.id == dragObj.id) {
          value.width = payload.clientX - _offsetX +5;
          value.height = payload.clientY - _offsetY +5;
          value.zIndex = zIndex;
        }
      })
      yield put({ type: 'save', payload: { noteItem } });
    },

    *delNote({ payload },{ put, select}) {
      let noteItem = yield select(state=>state.note.noteItem);
      noteItem = noteItem.filter(item => item.id != payload.id);
      yield put({ type: 'save', payload: { noteItem }});
      localStorage.removeItem(payload.id);
    },

    *delAllNote({ },{ put }) {
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

    *saveNote({ payload },{ put, select }) {
      const { id, content } = payload;
      let noteItems = yield select(state => state.note.noteItem), value, item;
      noteItems.find((value)=> {
        if (value.id == id) value.content = content;
      })
      item = noteItems.filter(item => item.id == id)[0];
      yield put({ type: 'save', payload: { noteItems }});
      if (content ? content : item.content)
        value = JSON.stringify(item)
      localStorage.setItem(id,value);
    },

    *loadData({ },{ put }) {
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i),
          value = localStorage.getItem(key).split('|&|');
        yield put({ type: 'addNote', payload: { key, value }});
      }
    },

    *onfocus({ payload },{ put, select }) {
      let { zIndex, noteItem }= yield select(state=>state.note);
      const { id } = payload;
      noteItem.find(value => {
        if (value.id == id) value.zIndex = zIndex;
      })
      yield put({ type: 'save', payload: { noteItem } })
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },

};
