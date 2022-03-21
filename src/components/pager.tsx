import { PagerButton } from './pager-button';

type Props = {
    onPrev?: () => void;
    onNext?: () => void;
};

export function Pager(props: Props) {
    const { onPrev, onNext } = props;

    return <nav className="pagination">
        <PagerButton onClick={onPrev}><i className='fa-solid fa-arrow-left-long'></i></PagerButton>
        <PagerButton onClick={onNext}><i className='fa-solid fa-arrow-right-long'></i></PagerButton>
    </nav>
}