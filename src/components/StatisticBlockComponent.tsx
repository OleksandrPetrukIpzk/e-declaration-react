
type StatisticBlockComponent = {
    text: string;
    greenText: string;
    subText: string;
}

export const StatisticBlockComponent = (props: StatisticBlockComponent) =>{

    return <div className={'statistic-block'}>
        <span className={'statistic-block-span'}>{props.text}<p>{props.greenText}</p></span>
        <p className={'statistic-block-subscribe'}>{props.subText}</p>
    </div>
}