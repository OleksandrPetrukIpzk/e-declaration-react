

type BlockWithInfoAndIconComponentType = {
    text: string,
    subText: string,
}

export const BlockWithInfoAndIconComponent = (props: BlockWithInfoAndIconComponentType) => {

    return (<div className={'block-with-info'}>
        <p className={'block-with-info-main-text'}>{props.text}</p>
        <p className={'block-with-info-subtitle-text'}>{props.subText}</p>
    </div>)
}