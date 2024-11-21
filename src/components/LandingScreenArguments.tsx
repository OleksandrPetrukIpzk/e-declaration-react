import {BlockWithInfoAndIconComponent} from "./BlockWithInfoAndIconComponent";

export const LandingScreenArguments = () => {

    return(<div className={'landing-screen-arguments-block'}>
        <div className={'landing-screen-arguments-block-text'}>
            <h3>Why choose E-Declaration?</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis eleifend quam, non efficitur nisi</p>
        </div>
        <div className={'landing-screen-arguments-block-info'}>
            <BlockWithInfoAndIconComponent text={'Experienced driver'} subText={'facilisis eleifend quam, non efficitur nisi mattis quis.'}/>
            <BlockWithInfoAndIconComponent text={'Quick Delivery'} subText={'facilisis eleifend quam, non efficitur nisi mattis quis.'}/>
            <BlockWithInfoAndIconComponent text={'Integration of API'} subText={'facilisis eleifend quam, non efficitur nisi mattis quis.'}/>
            <BlockWithInfoAndIconComponent text={'Outstanding service'} subText={'facilisis eleifend quam, non efficitur nisi mattis quis.'}/>
        </div>
    </div>)
}