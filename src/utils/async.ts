import { HttpResponse } from "../services/http";

export type AsyncOp<T, E = string> =
    | { status: 'notStarted' }
    | { status: 'pending', abortController?: AbortController }
    | { status: 'failure', error: E }
    | { status: 'success', result: T }

export function fromHttpResponse<T>(response: HttpResponse<T>): AsyncOp<T> {
    return response.status === 'ok'
        ? { status: 'success', result: response.result }
        : { status: 'failure', error: response.status };
}

export function tryGetResult<T>(asyncOp: AsyncOp<T>) {
    return asyncOp?.status === 'success' ? asyncOp.result : undefined;
}