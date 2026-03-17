import { Login } from '../../../components/auth/login';
import '../../../styles/global.css';

export default function LoginPage() {
  return (
    <div className="login-page-wrapper">
      <div className="login-brand-logo">MakanMate</div>
      
      {/* Background Images */}
      <img src="/mee kari.png" alt="Mee Kari" className="login-bg-img img-top-right" />
      <img src="/cendol.png" alt="Cendol" className="login-bg-img img-bottom-left" />

      {/* Login Card Component */}
      <Login />
    </div>
  );
}