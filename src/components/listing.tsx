import React from 'react';
import { RedditParams, Posts } from '../services/reddit';
import { AsyncOp, tryGetResult } from '../utils/async';
import { PostList } from './post-list';
import { Pager } from './pager';

type Props = {
    onSearch: (params: RedditParams) => void;
    results: AsyncOp<Posts>
}

export function Listing(props: Props) {
    const { onSearch, results } = props;
    const [params, setParams] = React.useState<RedditParams>({ subreddit: '' });

    React.useEffect(() => onSearch(params), [params]);

    const { subreddit } = params;
    const { before, after } = tryGetResult(results) ?? {};
    const next = before ? () => setParams({ subreddit, before }) : undefined;
    const prev = after ? () => setParams({ subreddit, after }) : undefined;

    function Posts() {
        switch (results.status) {
            case 'notStarted':
                return <p>Enter a subreddit to get started.</p>;
            case 'pending':
                return <div>Loading...</div>;
            case 'success':
                return <PostList posts={results.result.data} />;
            case 'failure':
                return <div data-testid="failure">Something went wrong.</div>;
        }
    }

    return <div className="container is-widescreen">
        <div className="field">
            <div className={`control ${results.status === 'pending' ? 'is-loading' : ''}`}>
                <input className="input" type="text" onChange={e => setParams({ subreddit: e.target.value })} />
            </div>
        </div>
        <div className="field"><Pager onPrev={prev} onNext={next} /></div>
        <div className="field"><Posts /></div>
    </div>
}
