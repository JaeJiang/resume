/**
 * Created by zm on 2017/1/22.
 */
import AV from 'leancloud-storage';

export default {

    remoteSave:function (items) {
        let AVTodo = AV.Object.extend("todos");
        let avTodo = new AVTodo();
        avTodo.set("items",items);
        //设置ACL
        let acl = new AV.ACL();
        acl.setReadAccess(AV.User.current(),true);
        acl.setWriteAccess(AV.User.current(),true);
        avTodo.setACL(acl);

        return avTodo.save().then((todo) => {
            let {id,createdAt,updatedAt} = todo;
            return {id,createdAt,updatedAt};
        }, (error)=>{console.log(error)})
    },
    remoteFetch:function (list) {
        let query = new AV.Query("todos");
        query.find().then((results)=> {
            let result = results[results.length-1].attributes.items;
            for(let i=0;i<result.length;i++){
                list.push(result[i]);
            }
        },(error)=>{console.log(error)})
    }    
}
