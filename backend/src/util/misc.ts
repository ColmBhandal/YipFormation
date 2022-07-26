export const logAndReturnRejectedPromise = (msg: string) => {
    console.error(msg)
    return Promise.reject(msg)
}

export const logAndReject = (reject: (reason?: any) => void, msg: string) => {
    console.error(msg)
    reject(msg)
}

export const serialize = function(obj: any) {
    return JSON.stringify(obj)
  }