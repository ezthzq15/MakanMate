import { Signup } from '../../../components/auth/signup';
import '../../../styles/global.css';

export default function SignupPage() {
  return (
    <div className="signup-page-wrapper">
      <div className="login-brand-logo">MakanMate</div>
      
      {/* Left side: Graphics */}
      <div className="signup-left-pane">
        <div className="signup-vertical-strip" />
        <img 
          src="/3gmbrmakanan.png" 
          alt="MakanMate Food Display" 
          className="signup-food-cluster" 
        />
      </div>

      {/* Right side: Form Container */}
      <div className="signup-right-pane">
        <Signup />
      </div>
    </div>
  );
}
