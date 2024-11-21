import {BlockWithInfoAndIconComponent} from "./BlockWithInfoAndIconComponent";

export const LandingScreenServices = () => {

    return(<div className={'landing-screen-services'}>
        <div className={'landing-screen-services-block'}>
        <h3>The MCI Medical delivery service</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis eleifend quam, non efficitur nisi
            mattis quis. Vivamus scelerisque orci nec erat cursus, sed facilisis velit porttitor. Vestibulum ligula
            sapien, cursus sed consectetur nec, tincidunt ac metus.</p>
        </div>
        <div className={'landing-screen-services-blocks'}>
            <BlockWithInfoAndIconComponent text={'Experienced driver'}
                                           subText={'facilisis eleifend quam, non efficitur nisi mattis quis.'}/>
            <BlockWithInfoAndIconComponent text={'Quick Delivery'}
                                           subText={'facilisis eleifend quam, non efficitur nisi mattis quis.'}/>
            <BlockWithInfoAndIconComponent text={'Integration of API'}
                                           subText={'facilisis eleifend quam, non efficitur nisi mattis quis.'}/>
            <BlockWithInfoAndIconComponent text={'Outstanding service'}
                                           subText={'facilisis eleifend quam, non efficitur nisi mattis quis.'}/>
        </div>
    </div>)
}