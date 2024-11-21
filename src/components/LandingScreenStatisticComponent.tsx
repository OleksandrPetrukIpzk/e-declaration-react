import {StatisticBlockComponent} from "./StatisticBlockComponent";

export const LandingScreenStatisticComponent = () => {
    //@todo add statistic from backend
    return <div className={'landing-screen-services'}>
        <div className={'landing-screen-services-block'}>
            <h3>Stats For Medical Courier</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis eleifend quam, non efficitur nisi
                mattis quis. Vivamus scelerisque orci nec erat cursus, sed facilisis velit porttitor. Vestibulum ligula
                sapien, cursus sed consectetur nec, tincidunt ac metus.</p>
        </div>
        <div className={'landing-screen-services-statistic'}>
            <StatisticBlockComponent text={'12'} greenText={'+'} subText={'asdawd dad dwqd asdwq'}/>
            <StatisticBlockComponent text={'32'} greenText={'sas'} subText={'asdawd dad dwqd asdwq'}/>
            <StatisticBlockComponent text={'1'} greenText={'-214'} subText={'asdawd dad dwqd asdwq'}/>
            <StatisticBlockComponent text={'asd'} greenText={'12'} subText={'asdawd dad dwqd asdwq'}/>
        </div>
    </div>
        }