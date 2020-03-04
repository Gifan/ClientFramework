import IChannelCtrler, { ChannelData, ChannelType } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IChannelCtrler";

export default class FakeChannelCtrler implements IChannelCtrler {
    data: ChannelData;
    constructor(defaultChannel: string) {
        this.data = { enterSource: defaultChannel, type: ChannelType.FAKE }
    }
}
