import { Post } from '../services/reddit';
import { PostItem } from './post-item';

type Props = {
    posts: Post[];
}

export function PostList(props: Props) {
    const { posts } = props;
    return posts.length
        ? <ul data-testid="posts">
            {posts.map(post => (<li className="field" key={post.id} data-testid="post"><PostItem {...post} /></li>))}
        </ul>
        : <div>No posts found.</div>;
}