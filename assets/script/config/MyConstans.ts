
export const Num_initWithdrawalsGold:number =  55000;   //可提现金币初始化数量
export const Num_initGold:number = 5000;   //猫币初始化数量

export const Time_mergePullOpen:number = 0.1; //合并时候拉开时间 
export const Time_merge:number = 0.12;     //合并动画时间 

export const Time_output:number = 5;         //收益飘动提示时间间隔
export const Time_outputMove:number = 0.5;   //收益飘动动作时间

export const Time_addOutput:number = 1;       //增加金币收益金额时间间隔
export const Time_updateGoldUI:number = 5;    //更新金币金额时间间隔
export const Time_addRecommendBuyCd:number = 8;  //添加cd时间间隔

export const Num_shopRecyclingPrice:number = 0.1;    //回收价格，按当前商店价格1折

export const Num_goldCanBuyLv:number = 5;  //商店中金币可以买的等级： 当前最高-5
export const Num_recommendBuyN:number = 6;  //主界面推荐按钮，购买范围n值

export const Num_speedUpSecond:number = 300;  //加速时间，300秒
export const Num_maxSpeedUpSecond:number = 1500;  //加速时间最大值，1500秒
export const Num_speedUpOutput:number = 2;    //加速收益的倍数

export const Num_autoCompoundSecond:number = 10*60;  //自动合成时间，10分钟

export const Num_offLineIncomeMin:number = 120;  // 120秒以上才计算离线收益 
export const Num_offLineIncomeMax:number = 7200; // 2小时 = 7200s， 计算2小时以内的离线收益 
 
export const Num_createTreasureBoxMaxCount:number = 100; //礼包、宝箱当天最大创建数量
export const Time_disappearTreasureBox = 10;  //普通礼包宝箱 10秒 自动打开

export const Num_shopVideoCount :number = 1;   //商店中，观看最高级-2等级的视频次数
export const Num_buyFreeUpdateCountFirst :number = 5;  //购买时候出现免费升级隔一天一开始的次数
export const Num_buyFreeUpdateCount :number = 20;  //购买时候出现免费升级间隔的次数

export const Num_highBoxGetRoles:number = 5;   //高级宝箱打开后获得角色数量

export const Time_boxDropOut:number = 0.15;     //礼包箱子出现时候掉落时间 
export const Num_boxDropOutHeight:number = 450;  //礼包箱子出现时候掉落高度

export const Time_showFlyGoldCloseNodeDelay:number = 0.6;  //显示飞行金币时候，延迟关闭界面时间

export const Num_exchangeMoney:number = 10000;    //金币兑换钱的 兑换比例   10000:1

export const Num_inviteAward:number = 5000;   //每邀请一个好友奖励的金币数
export const Num_getGoldByCodeAward:number = 2500;   //每输入一个邀请码获得的金币数
export const Num_getGoldByCodeCount:number = 20;  //通过邀请码获得金币兑换次数最大值

export const Num_lotteryCount:number = 10;   //抽奖次数

export const Num_createRandomRewardsCount:number = 20; //随机奖励当天最大创建数量
export const Num_createRandomRewardsGoldCount:number = 1; //随机当天金币奖励数

export const Num_randomRewardsGoldMin:number = 250;  //每一个随机奖励获得金币的范围左区间
export const Num_randomRewardsGoldMax:number = 400;  //每一个随机奖励获得金币的范围右区间

export const Num_randomRewardsCatGoldMultipleMin:number = 30;  //每一个随机奖励获得猫币倍数的范围左区间
export const Num_randomRewardsCatGoldMultipleMax:number = 60;  //每一个随机奖励获得猫币倍数的范围右区间

export const iosLinkStr:string = "https://apps.apple.com/cn/app/id1493360418";      //ios链接
export const androidLinkStr:string = "https://ad.toutiao.com/advertiser_package/dl/2d29a558_1652698385854476_1578322355718";  //android链接

//合成状态
export enum mergeState {
    None,    //没合成
    Merge,   //合成
    FreeUpdate,  //免费升级， 免费升级状态时候不进行合成
    getUpgradeAward  //获取升级奖励时候，暂停自动合成
}

//在线礼包、宝箱类型
export enum treasureBoxKind {
    general =1,    //普通
    high =2        //高级
}

//随机奖励类型
export enum randomRewardsKind {
    gold =1,    //金币
    catGold,    //猫币
    gift        //豪华礼包
}

//本地保存数据Key
export enum localStorageKey {
    gridData = "compound_gridData",
    curMergeMaxLevel = "compound_curMergeMaxLevel",
    goldStr = "compound_goldStr",
    withdrawalsGold = "compound_withdrawalsGold",
    roleBuyCountListStr = "compound_roleBuyCountListStr",
    recommendBuyCurCd = "compound_recommendBuyCurCd",
    createTreasureBoxData = "compound_createTreasureBoxData",
    offLineLastTime = "compound_offLineLastTime",
    dateInfo = "compound_dateInfo",
    autoCompoundBeginTime = "compound_autoCompoundBeginTime",
    autoCompoundSecond = "compound_autoCompoundSecond",
    speedUpBeginTime = "compound_speedUpBeginTime",
    speedUpSecond = "compound_speedUpSecond",
    getDailyGoldDateInfo = "compound_getDailyGoldDateInfo",
    taskData = "compound_taskData",
    achievementData = "compound_achievementData",
    loadLoginDays = "compound_loadLoginDays",
    userId = "compound_userId",
    inviteCode = "compound_inviteCode",
    inviteCodeData = "compound_inviteCodeData",
    getGoldByCodeCount = "compound_getGoldByCodeCount",
}

export enum msg {
    setGridItemColliderShow = "msg_compound_setGridItemColliderShow",   //设置格子gridItem的碰撞Node显隐 
    delGridRole = "msg_compound_delGridRole",   //删除格子角色
    updateGoldUI = "msg_compound_updateGoldUI",  //更新金币UI显示
    buyRoleDone = "msg_compound_buyRoleDone",    //角色购买完成
    showDelAddGold = "msg_compound_showDelAddGold", //回收时候显示添加金币动画
    updateRecommendBuyCdUI = "msg_compound_updateRecommendBuyCdUI",   //更新推荐购买cd显示
    updateRecommendBtnUI = "msg_compound_updateRecommendBtnUI",       //更新推荐购买按钮显示，显示购买或金币不足
    updateSpeedUpUI = "msg_compound_updateSpeedUpUI",   //更新加速倒计时显示
    showRolePromote = "msg_compound_showRolePromote",   //显示角色合成升级界面
    updateRole = "msg_compound_updateRole",    //更新显示主界面角色
    updateAutoCompoundUI = "msg_compound_updateAutoCompoundUI",  //更新自动合成倒计时显示
    checkAutoCompound = "msg_compound_checkAutoCompound",    //检测是否能自动合成
    showOffLineIncome = "msg_compound_showOffLineIncome",    //显示离线收益 
    guideNextStep = "msg_compound_guideNextStep",    //新手引导下一步
    createTreasureBox = "msg_compound_createTreasureBox",   //创建在线礼包、宝箱
    showVideoGetNode = "msg_compound_showVideoGetNode",   //显示高级宝箱领取界面
    destroyHighTreasureBox = "msg_compound_destroyHighTreasureBox",  //删除高级宝箱
    delTreasureBox = "msg_compound_delTreasureBox",   //删除礼包宝箱，用于回收对象池
    showNotEnoughGoldNode = "msg_compound_showNotEnoughGoldNode",   //金币不足
    showSpeedUpUINode = "msg_compound_showSpeedUpUINode",   //显示加速提示界面
    speedUpVideoDone = "msg_compound_speedUpVideoDone",     //加速提示播放完视频
    showRoleShowPromoteNode = "msg_compound_showRoleShowPromoteNode",  //商店角色详细界面
    updateRoleShopItem = "msg_compound_updateRoleShopItem",   //刷新商店item
    getRolesNode = "msg_compound_getRolesNode",   //显示获得多个角色
    showTheSameGridRole = "msg_compound_showTheSameGridRole",  //显示相同的格子角色
    cancelShowTheSameGridRole = "msg_compound_cancelShowTheSameGridRole",  //取消显示相同的格子角色
    showGridItemEffects = "msg_compound_showGridItemEffects",    //点击宝箱时候，显示格子特效
    showGoldFlyNode = "msg_compound_showGoldFlyNode",    //显示金币飞行动画
    showFreeUpdateNode = "msg_compound_showFreeUpdateNode",   //显示免费升级界面
    gotoFreeUpdate = "msg_compound_gotoFreeUpdate",   //进行免费升级
    httpRequestConfigSuccess = "msg_compound_httpRequestConfigSuccess",    //成功获取后台配置
    initCommonDone = "msg_compound_initCommonDone",    //common初始化完成
    guideSetGirdOpacity = "msg_compound_guideSetGirdOpacity",    //引导时候设置格子透明度
    updateWithdrawalsGoldUI = "msg_compound_updateWithdrawalsGoldUI",   //更新提现金币UI显示 
    showGetRandomRewardsNode = "msg_compound_showGetRandomRewardsNode",  //显示获得随机奖励
    showflyBoxGetNode = "msg_compound_showflyBoxGetNode",  //显示获得豪华礼包
    showLotteryGetNode = "msg_compound_showLotteryGetNode",  //显示抽奖界面获得宝箱
    delRandomRewards = "msg_compound_delRandomRewards",   //领取随机奖励
    requestHttpConfig = "msg_compound_requestHttpConfig",   //请求后台数据
}


//层级索引
export enum layerIndex {
    smashEgged = 1,    //砸蛋界面
    guide,     //新手引导界面
    getDailyGold,  //天天领金币
    lottery,  //抽奖界面
    lotteryGetNode,  //抽奖获得宝箱界面
    withdrawals,  //提现
    help,       //帮助界面
    videoGet,  //打开高级礼包领取界面
    flyBoxGet,  //打开豪华礼包领取界面
    speedUpUI,  //加速按钮弹窗界面
    freeUpdate,  //免费升级弹窗界面
    getRoles,    //高级礼包宝箱领取角色后弹窗界面
    getRandomRewards,  //获得随机奖励界面
    roleShop,    //角色商店界面 
    rolePromote,     //角色合成升级弹窗界面
    notEnoughGold,   //金币不足界面
}


//合成角色列表
//lv：角色等级   output：收益   priceGold：金币购买价格    addRatio：递增系数   name：角色称号
export const compoundRoleDataList = [
    {"lv":1,"output":4,"priceGold":100,"levelReward":0,"addRatio":1.07,"name":"幼猫"},{"lv":2,"output":9,"priceGold":1500,"levelReward":10000,"addRatio":1.07,"name":"小猫"},{"lv":3,"output":19,"priceGold":4800,"levelReward":10000,"addRatio":1.175,"name":"俄罗斯蓝猫"},{"lv":4,"output":40,"priceGold":14880,"levelReward":10000,"addRatio":1.175,"name":"布偶猫"},{"lv":5,"output":85,"priceGold":46130,"levelReward":10000,"addRatio":1.175,"name":"日本短毛猫"},{"lv":6,"output":178,"priceGold":143000,"levelReward":10000,"addRatio":1.175,"name":"小贼猫"},{"lv":7,"output":375,"priceGold":443300,"levelReward":7500,"addRatio":1.175,"name":"波斯猫"},{"lv":8,"output":790,"priceGold":1374230,"levelReward":7500,"addRatio":1.175,"name":"伯曼猫"},{"lv":9,"output":1660,"priceGold":4260110,"levelReward":7500,"addRatio":1.175,"name":"狞猫"},{"lv":10,"output":3485,"priceGold":13206340,"levelReward":7500,"addRatio":1.175,"name":"美国卷耳猫"},{"lv":11,"output":7320,"priceGold":40939650,"levelReward":7500,"addRatio":1.175,"name":"苏格兰摺耳猫"},{"lv":12,"output":15375,"priceGold":126912920,"levelReward":5000,"addRatio":1.175,"name":"安哥拉猫"},{"lv":13,"output":32288,"priceGold":393430050,"levelReward":5000,"addRatio":1.175,"name":"孟买猫"},{"lv":14,"output":67805,"priceGold":1219633160,"levelReward":5000,"addRatio":1.175,"name":"塞尔卷毛猫"},{"lv":15,"output":142390,"priceGold":3780862800.0,"levelReward":5000,"addRatio":1.175,"name":"狸花猫"},{"lv":16,"output":299020,"priceGold":11720674680.0,"levelReward":5000,"addRatio":1.175,"name":"挪威森林猫"},{"lv":17,"output":627942,"priceGold":36334091510.0,"levelReward":2500,"addRatio":1.175,"name":"沙漠猫"},{"lv":18,"output":1318678,"priceGold":113000000000.0,"levelReward":2500,"addRatio":1.175,"name":"薮猫"},{"lv":19,"output":2769224,"priceGold":349000000000.0,"levelReward":2500,"addRatio":1.175,"name":"化猫"},{"lv":20,"output":5815370,"priceGold":1080000000000.0,"levelReward":2500,"addRatio":1.175,"name":"招财猫"},{"lv":21,"output":12212277,"priceGold":3360000000000.0,"levelReward":2500,"addRatio":1.175,"name":"缅因猫"},{"lv":22,"output":25645782,"priceGold":10400000000000.0,"levelReward":2500,"addRatio":1.175,"name":"孟加拉猫"},{"lv":23,"output":53856142,"priceGold":32200000000000.0,"levelReward":2500,"addRatio":1.175,"name":"埃及猫"},{"lv":24,"output":113097898,"priceGold":100000000000000.0,"levelReward":2500,"addRatio":1.175,"name":"土耳其梵猫"},{"lv":25,"output":237505586,"priceGold":310000000000000.0,"levelReward":2500,"addRatio":1.175,"name":"异国短毛猫"},{"lv":26,"output":498761731,"priceGold":961000000000000.0,"levelReward":2500,"addRatio":1.175,"name":"美国短尾猫"},{"lv":27,"output":1047399635,"priceGold":2.98E+15,"levelReward":2500,"addRatio":1.175,"name":"索马利亚猫"},{"lv":28,"output":2199539234.0,"priceGold":9.23E+15,"levelReward":2500,"addRatio":1.175,"name":"肥猫"},{"lv":29,"output":4619032391.0,"priceGold":2.86E+16,"levelReward":2500,"addRatio":1.175,"name":"E.T猫"},{"lv":30,"output":9699968021.0,"priceGold":8.87E+16,"levelReward":2500,"addRatio":1.175,"name":"忍者猫"},{"lv":31,"output":20369932844.0,"priceGold":2.75E+17,"levelReward":2500,"addRatio":1.175,"name":"苏茜"},{"lv":32,"output":42776858972.0,"priceGold":8.53E+17,"levelReward":2500,"addRatio":1.175,"name":"金神猫"},{"lv":33,"output":89831403841.0,"priceGold":2.64E+18,"levelReward":2500,"addRatio":1.175,"name":"金猪猫"},{"lv":34,"output":189000000000.0,"priceGold":8.19E+18,"levelReward":2500,"addRatio":1.175,"name":"财神猫"},{"lv":35,"output":396000000000.0,"priceGold":2.54E+19,"levelReward":2500,"addRatio":1.175,"name":"百福猫"}
    //,{"lv":36,"output":832000000000.0,"priceGold":7.87E+19,"levelReward":2500,"addRatio":1.175,"name":"角色36"},{"lv":37,"output":1750000000000.0,"priceGold":2.44E+20,"levelReward":2500,"addRatio":1.175,"name":"角色37"},{"lv":38,"output":3670000000000.0,"priceGold":7.57E+20,"levelReward":2500,"addRatio":1.175,"name":"角色38"},{"lv":39,"output":7700000000000.0,"priceGold":2.35E+21,"levelReward":2500,"addRatio":1.175,"name":"角色39"},{"lv":40,"output":16200000000000.0,"priceGold":7.27E+21,"levelReward":2500,"addRatio":1.175,"name":"角色40"},{"lv":41,"output":34000000000000.0,"priceGold":2.25E+22,"levelReward":2500,"addRatio":1.175,"name":"角色41"},{"lv":42,"output":71400000000000.0,"priceGold":6.99E+22,"levelReward":2500,"addRatio":1.175,"name":"角色42"},{"lv":43,"output":150000000000000.0,"priceGold":2.17E+23,"levelReward":2500,"addRatio":1.175,"name":"角色43"},{"lv":44,"output":315000000000000.0,"priceGold":6.72E+23,"levelReward":2500,"addRatio":1.175,"name":"角色44"},{"lv":45,"output":661000000000000.0,"priceGold":2.08E+24,"levelReward":2500,"addRatio":1.175,"name":"角色45"}
];

//天天领金币数据
export const dailyGoldList = [
   200,300,400,600,800,900,1200
];


//每日任务
export const taskList = [
    //title：任务标题   gold：奖励金币  catGoldRatio：奖励猫币系数， 猫币=收益*系数   count：当天任务的次数
    {"title":"每日登录","gold":3000,"catGoldRatio":300,"count":1},
    {"title":"观看视频6次","gold":6000,"catGoldRatio":600,"count":6},
    {"title":"购买猫咪6次","gold":2000,"catGoldRatio":200,"count":6},
    {"title":"抽奖3次","gold":2000,"catGoldRatio":200,"count":3},
    {"title":"合成猫咪6次","gold":2000,"catGoldRatio":200,"count":6},
    {"title":"解锁新等级猫咪1次","gold":4000,"catGoldRatio":400,"count":1}
];
export enum taskIndex { //每日任务索引 (需要与taskList的索引一一对应)
    login = 0,  //每日登录
    video,  //观看视频
    buyCat,  //购买猫咪
    lottery,  //抽奖
    merge,    //合成猫咪
    unlockCat,  //解锁新等级猫咪
}

//成就任务
// export const achievementList = [
//     //title：成就标题   gold：奖励金币
//     {"title":"合成5级猫咪" ,"gold":1000},
//     {"title":"合成10级猫咪","gold":2000},
//     {"title":"合成15级猫咪","gold":3000},
//     {"title":"合成20级猫咪","gold":4000},
//     {"title":"合成25级猫咪","gold":5000},
//     {"title":"合成30级猫咪","gold":6000},
//     {"title":"合成35级猫咪","gold":7000},
//     {"title":"合成40级猫咪","gold":8000},
//     {"title":"合成45级猫咪","gold":9000},
//     {"title":"合成50级猫咪","gold":10000}
// ];
export const achievementList = [
    //lv：达成成就等级   gold：奖励金币
    {"lv":5,"gold":1000},
    {"lv":10,"gold":2000},
    {"lv":15,"gold":3000},
    {"lv":20,"gold":4000},
    {"lv":25,"gold":5000},
    {"lv":30,"gold":6000},
    {"lv":35,"gold":7000},
    {"lv":40,"gold":8000},
    {"lv":45,"gold":9000},
    {"lv":50,"gold":10000}
];

// export const lotteryList = [
//     //probability：概率   catGoldRatio：奖励猫币系数， 猫币=收益*系数    gold金币
//     {"probability":20,"catGoldRatio":100,"gold":0},              //大量猫币     收益×100     0.2
//     {"probability":20,"catGoldRatio":100,"gold":0},              //大量猫币     收益×100     0.2
//     {"probability":20,"catGoldRatio":300,"gold":0},              //海量猫币     收益×300     0.2
//     {"probability":20,"catGoldRatio":0,"gold":0},                //普通宝箱                  0.2
//     {"probability":20,"catGoldRatio":0,"gold":0},                //高级宝箱                  0.1
//     {"probability":20,"catGoldRatio":0,"gold":500}               //金币          500         0.1
// ];

export enum lotteryListAwardKind { //抽奖奖励类型
    catGold = 0,  //大量猫币
    bigCatGold,  //海量猫币
    generalBox,  //普通宝箱
    highBox,  //高级宝箱
    gold,    //金币
}
