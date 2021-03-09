
/**
 * 说明： 抖音达人后台 数据统计上报 公共脚本
 * 开发者：叶剑锐
 * 日期：2020/11/15
 */

import { request } from './request.js';
module.exports = {
    domain: 'https://addata-api.zuiqiangyingyu.net', //需要添加合法域名
    launchOpt: null, //启动参数 getLaunchOptionsSync
    query: null, //启动参数 query
    drPid: null,
    preVideoId: null, //拍视频id
    //drType='promote':达人推广  drType='share':达人分享出去的
    drType: null, //用户 类型
    userInfo: {}, //用户数据 
    promoteOpenId: null, //达人 openid
    dr_params: null,

    /**
     * 
     * @param {游戏启动 即调用}}
     */
    ttLogin: function () {
        let that = this;
        // console.log(" -ttLogin--开始登陆 ");

        this.launchOpt = tt.getLaunchOptionsSync();

        // console.log(" launchOpt: ", that.launchOpt);

        this.query = this.launchOpt && this.launchOpt.query;
        // console.log(" query: ", that.query);
        if (this.query) {
            this.drPid = this.query.dr_pid;
            // this.drPid = "L9py5ekLz31rwaG8"; //测试用
            // console.log(" drPid: ", that.drPid);

            this.preVideoId = this.query.pre_video_id;
            // console.log(" preVideoId: ", that.preVideoId);

            this.drType = this.query.dr_type;
            // that.drType = 'promote'; //promote  测试用
            // that.drType = 'share'; //share  测试用
            // that.preVideoId = 'L9py5ekLz31rwaG8H5qTIYA5WihEFgSV';//share  测试用
            // console.log(" drType: ", that.drType);

            //每次 拍视频前 都要重新获取视频前置id，可以获得取多个存起来备用，也可以分享完成后重新获取 针对drType : promote
            if (that.drPid && that.drType && (that.drType == 'promote')) that.getPreVideoId(that.drPid);
        }
        //达人 强制 拉起登录
        if (that.query && that.drType && that.drPid && (that.drType == 'promote')) {
            tt.login({
                success(loginInfo) {
                    // console.log('loginInfo 1', loginInfo);
                    if (that.query && that.drType && that.drPid) {
                        // console.log("类型", that.drType);
                        if (that.drType == 'promote') { //达人分享推广
                            tt.getUserInfo({
                                withCredentials: true,
                                success(userInfo) {
                                    // console.log('userInfo', userInfo);

                                    //上传用户信息
                                    that.uploadUserInfo({
                                        code: loginInfo.code ? loginInfo.code : "",
                                        raw_data: userInfo.rawData ? userInfo.rawData : "",
                                        dr_pid: that.drPid,
                                        bms_app_name: wonderSdk.BMS_APP_NAME
                                    })
                                }
                            })
                        }
                    }
                }
            });
        } else {
            tt.login({
                force: false,
                success(loginInfo) {
                    // console.log('loginInfo 2', loginInfo);
                    //转换openid
                    that.getOpenid({
                        anonymous_code: loginInfo.anonymousCode ? loginInfo.anonymousCode : "",
                        code: loginInfo.code ? loginInfo.code : "",
                        app_name: wonderSdk.BMS_APP_NAME
                    })
                }
            })
        }

    },

    /**
     * 上传用户信息
     */
    uploadUserInfo: function (data) {
        let that = this;
        // console.log("上传用户信息：",data);
        tt.request({
            url: this.domain + '/game/user/auth',
            method: 'POST',
            data,
            success(res) {
                console.warn('uploadUserInfo', res.data);
                that.promoteOpenId = res.data.data.open_id;
                console.warn('this.promoteOpenId : ', that.promoteOpenId);
            },
            fail(res) {
                console.warn('uploadUserInfo', res);
            }
        })
    },

    /**
     * 获取视频前置id
     */
    getPreVideoId: function (drPid) {
        let that = this;
        // console.log("获取视频前置id:", drPid);
        tt.request({
            url: this.domain + '/game/Video/getPreVideoId?dr_pid=' + drPid,
            method: 'GET',
            success(res) {
                console.warn('getPreVideoId', res.data);
                that.preVideoId = res.data.data
                //L9py5ekLz31rwaG8H5qTIYA5WihEFgSV
            },
            fail(res) {
                console.warn('getPreVideoId', res);
            }
        })
    },

    /**
     * 上传视频数据
     */
    uploadVideoId: function (data) {
        // console.log('上传视频数据:', data);
        tt.request({
            url: this.domain + '/game/Video/saveVideo',
            method: 'POST',
            data,
            success(res) {
                console.warn('uploadVideoId', res.data);
            },
            fail(res) {
                console.warn('uploadVideoId', res);
            }
        })
    },

    /**
     * 视频播放完成时上报数据  
     */
    uploadAdPlayDone: function (data) {
        // console.log('uploadAdPlayDone', data);
        // if( this.drType == 'share' ) {
        request('post', this.domain + '/game/Video/apd', data)
        // }
    },

    /**
     * 观看完 视频类广告 需调用 =》 上报数据 
     */
    playVideoEnd() {
        let obj = {};
        if (this.drType == 'share') { //针对 点击分享进来的用户
            obj = {
                dr_pid: this.drPid,
                pre_video_id: this.preVideoId,
                bms_app_name: wonderSdk.BMS_APP_NAME,
                user_info: this.userInfo,
                play_type: "daren"
            }
        } else { //普通用户
            obj = {
                bms_app_name: wonderSdk.BMS_APP_NAME,
                user_info: this.userInfo,
                play_type: "normal"
            }
        }
        this.uploadAdPlayDone(obj);
    },

    /**
     * 激励视频广告展示成功 视频类广告 需调 =》 上报数据 
     */
    playVideoShow() {
        let obj = {};
        if (this.drType == 'share') { //针对 点击分享进来的用户
            obj = {
                event_type: "eps",
                dr_pid: this.drPid,
                pre_video_id: this.preVideoId,
                bms_app_name: wonderSdk.BMS_APP_NAME,
                user_info: this.userInfo,
                play_type: "daren"
            }
        } else { //普通用户
            obj = {
                event_type: "eps",
                bms_app_name: wonderSdk.BMS_APP_NAME,
                user_info: this.userInfo,
                play_type: "normal"
            }
        }
        console.log('playVideoShow', obj);
        request('post', this.domain + '/game/Video/adEvent', obj);
        // .then(res=>{
        //     console.log(res);
        // })
    },

    /**
     * 换取用户openid
     */
    getOpenid: function (data) {
        let that = this;
        // console.log('getOpenid:', data);
        tt.request({
            url: 'https://game.zuiqiangyingyu.net//common/tt/session/sign_in',
            method: 'POST',
            data,
            header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
            success(res) {
                console.warn('getOpenid success', res.data);
                that.userInfo = {
                    anonymous_openid: res.data.data.anonymous_openid,
                    openid: res.data.data.openid,
                };
                // console.log('换取用户openid:', that.userInfo);
            },
            fail(res) {
                console.warn('getOpenid fail', res);
            }
        })
    },

    //测试上报
    test() {
        console.warn('测试userInfo:', this.userInfo);
        this.uploadAdPlayDone({
            dr_pid: this.drPid,
            pre_video_id: this.preVideoId,
            bms_app_name: wonderSdk.BMS_APP_NAME,
            user_info: this.userInfo,
            play_type: "normal"
        });
    }

};