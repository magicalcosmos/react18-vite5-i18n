import ParticlesBg from 'particles-bg';
import "./Login.scss";
const Login = () => {
    return (
        <div className='login'>
            <ParticlesBg type="circle" bg={true} />
            <ul className='login-list'>
                <li className='login-item head'>
                   BiXin-Web Management
                </li>
                <li className='login-item'>
                    <input placeholder='请输入用户名'/>
                </li>
                <li className='login-item'>
                    <input type="password" placeholder='请输入密码'/>
                </li>
                <li className='login-item'>
                    <span className='login-btn'>登 录</span>
                </li>
            </ul>
        </div>
    );
};

export default Login;