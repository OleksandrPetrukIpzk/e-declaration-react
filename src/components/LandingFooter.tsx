
export const LandingFooter = () => {
    //@todo add href
    return <footer className="landing-screen-footer">
        <div className="landing-screen-footer-text">
            <h4>E-Declaration</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet neque tortor.</p>
        </div>
        <div className="landing-screen-footer-access">
            <p  className="landing-screen-footer-access-logo">Quick Links</p>
            <div className="landing-screen-footer-access-elements">
                <a href={'/'}>First</a>
                <a href={'/'}>Second</a>
                <a href={'/'}>Third</a>
                <a href={'/'}>First</a>
            </div>
        </div>
        <div className="landing-screen-footer-access">
            <p className="landing-screen-footer-access-logo">Contact us</p>
            <div className="landing-screen-footer-access-elements">
                <p>Olexsandr.petruk@gmail.com</p>
                <p>Zhitomur</p>
                <p>+380992241245</p>
            </div>
        </div>
    </footer>
}