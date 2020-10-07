
export interface DecodedTransaction {
    id: string,
    raw: string,
    verified: boolean,
    accountId: string,
    signingKey: string,
    signature: string,
    payload: any
}