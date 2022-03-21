import { Post } from '../services/reddit';

export function PostItem(props: Post) {
    const { title, author, thumbnail, selftext } = props;
    return <article className="media">
        <figure className="media-left">
            <div className="image is-128x128">
                <img src={thumbnail} />
            </div>
        </figure>
        <div className="media-content">
            <div className="content">
                <p>
                    <strong>{title}</strong>
                    <br />
                    <small>{author}</small>
                    <br />
                    {selftext}
                </p>
            </div>
        </div>
    </article>
}