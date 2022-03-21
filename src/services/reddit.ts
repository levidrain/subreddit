import { http, HttpResponse } from './http';

export type Posts = {
    after?: string;
    before?: string;
    data: Post[];
};

export type Post = {
    id: string;
    title: string;
    author: string;
    selftext: string;
    thumbnail: string;
    created_utc: number;
};

export type RedditParams = { subreddit: string, limit?: number } & ({ before?: string } | { after?: string });

export type RedditResponse = HttpResponse<Posts>

// reddit has apparently locked down the json responses, it is now blocked under CORS.
// I found a way around this by using the pushshift api instead.  But the respose
// doesn't include the thumbnail.  There is a transform hack at the end of this function
// to mock the thumbnail and make a response nicer to use
export async function getSubreddit(params: RedditParams, signal: AbortSignal): Promise<RedditResponse> {
    const { limit = 3, ...rest } = params;
    const queryStr = new URLSearchParams({ ...rest, size: String(limit), sort: 'desc', sort_type: 'created_utc' }).toString();

    // in a real app, this would obviously be an environment
    const uri = `https://api.pushshift.io/reddit/search/submission/?${queryStr}`;

    const response = await http<Posts>(uri, { signal });

    // HACK
    if (response.status === 'ok') {
        const subreddit = encodeURIComponent(params.subreddit);
        const { data = [] } = response.result;
        const posts: Post[] = data.map(x => ({ ...x, thumbnail: `https://loremflickr.com/128/128/${subreddit}?r=${x.id}` }));
        const after = posts[0]?.created_utc?.toString();
        const before = posts[posts.length - 1]?.created_utc?.toString();
        return { status: 'ok', result: { data: posts, before, after } };
    }
    return response;
}