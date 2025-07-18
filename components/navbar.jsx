import Styles from '../css-comp/navbar.module.css'
function Navbar(){
        return (
            <>
            <div className={Styles.div1}>
                <ul className={Styles.ul}>
                    <li className={Styles.li}>Dashboard</li>
                    <li className={Styles.li}>Stocks </li>
                    <li className={Styles.li}>Data Entry</li>
                    <li className={Styles.li}>Alert History</li>
                </ul>
            </div>
            </>
        )
}
export default Navbar