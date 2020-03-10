let ishided: boolean = false;

cc.game.on(cc.game.EVENT_SHOW, function(){
    // console.log('## 回到游戏')
    // let compoundCommon = CompoundCommon.GetInstance(); 
    // if(compoundCommon.m_eventHideFlag){ 
    //     //切到后台回来才会触发离线收益
    //     compoundCommon.loadOffLineTime(); 
    // }
    // compoundCommon.m_eventHideFlag = false; 
},this);

cc.game.on(cc.game.EVENT_HIDE, function(){
    console.log('## 切到后台')
    // if(!common.debug){
        //切到后台，保存合成数据
    //     let compoundCommon = CompoundCommon.GetInstance();
    //     compoundCommon.m_eventHideFlag  = true;
    //     compoundCommon.saveCompoundCommonData(); 
    // // }
},this);