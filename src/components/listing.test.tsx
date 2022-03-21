import React from 'react';
import { render, screen } from '@testing-library/react';
import { Listing } from './listing';
import { Posts, Post } from '../services/reddit';

describe('Listing Component', () => {
    it('renders when not started', () => {
        render(<Listing onSearch={jest.fn()} results={{ status: 'notStarted' }} />);
        const textElem = screen.getByText(/Enter a subreddit to get started./i);
        expect(textElem).toBeInTheDocument();
    });
    it('renders when pending', () => {
        render(<Listing onSearch={jest.fn()} results={{ status: 'pending' }} />);
        const textElem = screen.getByText(/Loading.../i);
        expect(textElem).toBeInTheDocument();
    });
    it('renders when failure', () => {
        render(<Listing onSearch={jest.fn()} results={{ status: 'failure', error: '' }} />);
        const textElem = screen.getByText(/Something went wrong./i);
        expect(textElem).toBeInTheDocument();
    });
    describe('success request', () => {
        it('shows no results when empty list', () => {
            const result: Posts = { data: [] };
            render(<Listing onSearch={jest.fn()} results={{ status: 'success', result }} />);
            const textElem = screen.getByText(/No posts found./i);
            expect(textElem).toBeInTheDocument();
        });
        it('shows results when not empty', () => {
            const data: Post[] = [1,2,3].map(i => ({
                id: `${i}`,
                title: `title${i}`,
                author: `author${i}`,
                created_utc: i,
                selftext: `content${i}`,
                thumbnail: `thumbnail${i}`
            }));
            const result: Posts = { data };
            render(<Listing onSearch={jest.fn()} results={{ status: 'success', result }} />);
            const postElem = screen.getByTestId('posts');
            expect(postElem).toBeInTheDocument();
            const postElems = screen.getAllByTestId('post');
            expect(postElems).toHaveLength(3);
        });
    });
});
