import React from 'react';

type Props = React.PropsWithChildren<{
    onClick?: () => void;
}>;

export function PagerButton(props: Props) {
    const { onClick, children } = props;
    return <button className="pagination-link" disabled={!onClick} onClick={onClick}>{children}</button>
}