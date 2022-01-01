import {useState} from "react";
import {Dropdown, DropdownButton} from 'react-bootstrap';

const NavBar = ({tabKey, setKey}) => {
    const [userName, setUserName] = useState('User template')

    return (
        <div id={'navbar'}>
            <Dropdown>
                <Dropdown.Toggle variant="success mt-0" id="dropdown-basic" className={'user-nav'}>
                    <img className={'avatar'}
                         src={'https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png'}
                         alt={'avatar'}/>
                    <span>{userName}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className={'dropdown'}>
                    <Dropdown.Item href="/users">Zarządzaj</Dropdown.Item>
                    <Dropdown.Item href="/login">Wyloguj</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default NavBar;