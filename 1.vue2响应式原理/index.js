// 订阅器模式
let  Dep = {
    // 容器
    list: [],
    // 订阅
    listen: function(key, fn) {
        (this.list[key] || (this.list[key] = [])).push(fn)
    },
    // 发布
    trigger: function() {
        // 类数组装换成真数组
        let key = Array.prototype.shift.call(arguments),
            fns = this.list[key];

        if(!fns || fns.length === 0) {
            return;
        }
        for(let i = 0, fn; fn = fns[i++];) {
            fn.apply(this,arguments)
        }
    }
}

let dataHijack = function({data, tag, datakey, selector}) {
    let value = '',
        el = document.querySelector(selector);
    // 数据劫持
    Object.defineProperty(data, datakey, {
        get: function() {
            console.log('取值');
            return value;
        },
        set: function(val) {
            console.log(val);
            value = val;
            // 数据改变 => 发布
            Dep.trigger(tag, val)
        }
    })

    Dep.listen(tag, function(text) {
        el.innerHTML = text;
    })
}