一个简单的字符串转ReactElement的工具

主要的功能是把一个html字符串转为可自定义的ReactElement对象。

例子: 我们把后台返回的一些数据中的字符串转为标签 并添加点击事件
```
import React, { Fragment, ReactNode } from 'react';

class Page extends React.Component {
  state = {
    resData:[
      '猫的品种有很多，<span>蓝猫</span>是其中的一种, ',
      '狗的品种有很多，<span>拉布拉多</span>是其中的一种',
    ]
  }
  render (){
    return <div>
    {
      this.state.res.Data.map((item,index)=>{
        return <li key="index">{ item }</li>
      })
    }
    </div>
  }
}
```

上述代码中，标签会被直接转译成字符串，这并不是我们想要的结果。我们可以使用以下方法来处理
```
import React, { Fragment, ReactNode } from 'react';
import TextToRE from './text2RE';


// 我们自己定义的承载标签的组件
class Pet extends React.Component {
  onClick = (e) => {
    this.props.onClick(e, this.props.children.join(''));
  }
  render() {
    const {name, children, ...others} = this.props;
    if(name==='span'){
      return <span className="pet" onClick={this.onClick} >{this.props.children}</span>
    }
    return this.props.children;
  }
}


const PetTag = text2RE(Pet);

class Page extends React.Component {
  state = {
    resData:[
      '猫的品种有很多，<span>蓝猫</span>是其中的一种, ',
      '狗的品种有很多，<span>拉布拉多</span>是其中的一种',
    ]
  }
  onClick = (_e,text) => {
    alert(`您点击了 ${text}`);
  }
  render (){
    return <div>
    {
      this.state.res.Data.map((item,index)=>{
        return <li key="index">
          <PetTag onClick={this.onClick}>{ item }</PetTag>
        </li>
      })
    }
    </div>
  }
}
```

我们需要定义一个 Class 或者 function 来存放标签的内容 类似于上面的Pet类

它接收的参数为
```
{
    name:string;         // 标签名
    children:[]          // 子元素列表
    ...others:{}         // html标签上原本的一些属性 和自己手动传入的一些属性
}
```

