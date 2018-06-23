
export default {

  namespace: 'note',

  state: {
    // 便利贴信息
    noteItem: [],

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
    },
  },

  effects: {
    *addNote({ e },{ call, put, select}) {
      let { divLeft, divTop } = yield select(state=>state.note);

      const newItem = [{
        id: new Date().getTime(),
        content: '',
        width: 180,
        height: 170,
        left: divLeft,
        top: divTop,
        zIndex: 0,
      }];

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
      //todo 点击便利贴
      if (payload.target.className === 'noteTitle') {
        let { dragObj, zIndex, relplace } = yield select(state=>state.note);
        let { _startX, _startY, _offsetX, _offsetY} = relplace;
        dragObj = payload.target.parentNode;
        const id = dragObj.id;

        const item = yield select(state=>state.note.noteItem)
        const dragitem = item.filter(item=>item.id == id)

        zIndex += 1;

        _startX = payload.clientX;
        _startY = payload.clientY;
        _offsetX = dragObj.offsetLeft;
        _offsetY = dragObj.offsetTop;

        relplace = {
          _startX: _startX,
          _startY: _startY,
          _offsetX: _offsetX,
          _offsetY: _offsetY,
        }

        yield put({ type: 'save', payload: {relplace,zIndex,dragObj}})
      }

    },

    *dragNote({ payload },{ call, put, select}) {
      //todo 拖拽便利贴
      let { dragObj, zIndex, relplace, noteItem } = yield select(state=>state.note);
      const { _startX, _startY, _offsetX, _offsetY} = relplace;
      if (dragObj) {
        dragObj.style.left = (_offsetX + payload.clientX - _startX - 5) + 'px';
        dragObj.style.top  = (_offsetY + payload.clientY - _startY - 5) + 'px';
        dragObj.style.zIndex = zIndex;

        yield put({ type: 'save', payload: { noteItem }})
      }
    },

    *scaleNote({ payload },{ call, put, select}) {
      //todo 缩放便利贴

    },

    *delNote({ payload },{ call, put, select}) {
      //todo 删除便利贴
    },

    *loadData({ payload },{ call, put, select}) {
      //todo 加载已有数据
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },

};
