// javascript allows anything to be thrown as an error, so typescript doesn't
// allow you to type exceptions.  This approach makes dealing with promises much
// better.  Clients get meaningful errors without have to unpack exceptions.
export type HttpOk<T> = { status: 'ok', result: T }
export type HttpErrors =
    | { status: 'badStatus', code: number }
    | { status: 'badBody' }
    | { status: 'aborted' }
    | { status: 'network' };
export type HttpResponse<T> = HttpOk<T> | HttpErrors;

// this is a pretty basic implementation; in a real app this would be a little
// more built out.  For example, you'd want to handle responses that aren't json
// or responses with no body.
export async function http<T>(...args: Parameters<typeof fetch>): Promise<HttpResponse<T>> {
    try {
        const res = await fetch(...args);
        if (res.ok) {
            const result: T = await res.json();
            return { status: 'ok', result };
        }
        return { status: 'badStatus', code: res.status };
    } catch (e) {
        if (e instanceof Error) {
            if (e.name === 'AbortError') {
                return { status: 'aborted' };
            } else if (e.name === 'SyntaxError') {
                return { status: 'badBody' };
            }
        }
    }
    return { status: 'network' };
}