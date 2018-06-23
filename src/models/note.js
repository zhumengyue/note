
export default {

  namespace: 'note',

  state: {
    // 便利贴信息
    noteItem: [

    ],

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
    *addNote({ payload },{ call, put, select}) {
      let { divLeft, divTop } = yield select(state=>state.note);

      const newItem = [{
        id: new Date().getTime(),
        content: '',
        width: 180,
        height: 170,
        left: divLeft,
        top: divTop
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

    *delNote({ payload },{ call, put, select}) {
      // 删除便利贴
    },

    *loadData({ payload },{ call, put, select}) {
      // 加载已有数据
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },

};
