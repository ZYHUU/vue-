let Vue;
// 提取key value
const forEachFn = (obj, cb) => {
  Object.keys(obj).forEach((key) => {
    key ? cb(key, obj[key]) : null;
  });
};
class Store {
  constructor(options = {}) {
    // Vuex核心 => 实现数据响应式
    this.vm = new Vue({
      data() {
        return { state: options.state };
      },
    });

    let getters = options.getters || {};
    this.getters = {}; // 当前实例
    //  通过循环拿出键值，绑定get劫持对象所有属性
    forEachFn(getters, (getterName, fn) => {
      Object.defineProperty(this.getters, getterName, {
        get: () => {
          return fn(this.vm.state);
        },
      });
    });

    let mutations = options.mutations || {};
    this.mutations = {};
    forEachFn(mutations, (mutationName, fn) => {
      this.mutations[mutationName] = (payload) => {
        // 内部的第一参数是状态
        fn(this.vm.state, payload);
      };
    });

    let actions = options.actions;
    this.actions = {};
    forEachFn(actions, (actionName, fn) => {
      this.actions[actionName] = (payload) => {
        fn(this, payload);
      };
    });
  }
  commit = (mutationName, payload) => {
    this.mutations[mutationName](payload);
  };
  dispatch = (actionName, payload) => {
    this.actions[actionName](payload);
  };

  // 简化取值操作
  get state() {
    return this.vm.state;
  }
}

// install 插件固定写法
const install = (_Vue) => {
  // _Vue => vue的构造函数
  Vue = _Vue;
  // 混入组件的生命周期
  Vue.mixin({
    beforeCreate() {
      if (this.$options && this.$options.store) {
        // 根组件
        this.$store = this.$options.store;
      } else {
        // 子组件
        this.$store = this.$parent ? this.$parent.$store : {};
      }
      // 为什么不挂在Vue.prototype?
      // 1. new Vue() 每一个都会带store
      // 2. 不会污染原型
      // 3. 单独创建的实例,没有父亲,没有store
    },
  });
};

export default {
  install, // 提供一个注册方法 默认调用
  Store,
};
