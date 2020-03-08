export default interface ILoginCtrler {
    login(successCB: (data: any) => void, failCB?: (msg: string) => void): void;
}