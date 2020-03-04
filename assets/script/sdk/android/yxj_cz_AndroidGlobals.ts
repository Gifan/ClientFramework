
// declare global variable "D"

// window.iOSSendMsg = (str)=>{

//     console.log('ios oc传过来的'+str)

//     cc.game.emit(str); //通知游戏界面过关动画开始
    
//     return 'abcd'
// }


//评论我们
export function commentToUS(){
    if (cc.sys.isNative&&cc.sys.os==cc.sys.OS_ANDROID) {//判断是否是源生平台并且是否是Android平台 
        return;
        jsb.reflection.callStaticMethod("AppController","onCommentBtn"); 
        
    }
}

//更多游戏
export function moreGame(){
    if (cc.sys.isNative&&cc.sys.os==cc.sys.OS_ANDROID) {//判断是否是源生平台并且是否是Android平台 
        return;
        jsb.reflection.callStaticMethod("AppController","moreGame"); 
        
    }
}