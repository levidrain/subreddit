import React from 'react';
import { AsyncOp, fromHttpResponse } from '../utils/async';
import { Listing } from '../components/listing';
import { getSubreddit, RedditParams, Posts } from '../services/reddit';

export function Reddit() {

    const [results, setResults] = React.useState<AsyncOp<Posts>>({ status: 'notStarted' });

    const getResults = async (params: RedditParams) => {
        // if we have an outstanding request, we kill it. this prevents
        // issues were responses come back out of order.
        if (results.status === 'pending') {
            results.abortController?.abort();
        }

        if (!params.subreddit) {
            setResults({ status: 'notStarted' });
            return;
        }

        const abortController = new AbortController();
        setResults({ status: 'pending', abortController });

        const response = await getSubreddit(params, abortController.signal);
        // in this case we want to ignore aborted requests. Aborted requests will be immediately
        // replaced with a new pending request
        if (response.status !== 'aborted') {
            setResults(fromHttpResponse(response));
        }
    }

    return <Listing onSearch={getResults} results={results} />
}