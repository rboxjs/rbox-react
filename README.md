# rbox-react

> react的rbox捆绑库


### 文档 
详细的文档请点击 [这里](https://rbox.yujing.link)

### 快速开始
1. 安装依赖

`npm install rbox --save` <br />
`npm install rbox-react --save` <br />

2. 定义数据
```typescript
import {createStore} from 'rbox'

const mArticles = ()=>{
    return createStore({
        loading:false,
        list:[],
        actions:{
            setLoading(status){
              this.core.updateData({
                  loading:status
              })  
            },
            async getPageData(){
                this.actions.setLoading(true)
                try{
                    const data = await fetch('/api/articles');
                    
                    this.core.updateData({
                        list:data
                    })
                }
                finally {
                    this.actions.setLoading(false)
                }
            }
        }
    })
}
```

3. 在react中使用

```typescript jsx
import React,{useEffect} from 'react'
import {useStores} from 'rbox-react'

const ArticlesComponent = ()=>{
    const [sArticles] = useStores([mArticles()])

    useEffect(()=>{
        sArticles.actions.getPageData();
    },[])
    
    if(sArticles.loading){
        return <div>loading...</div>
    }
    
    return sArticles.list.map(item=>{
        return <div>
            <h3>{item.title}</h3>
            <div>{item.content}</div>
        </div>
    })
}
```

### License

[MIT](LICENSE.md)

