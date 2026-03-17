import { Signup } from '../../../components/auth/signup';
import '../../../styles/global.css';

export default function SignupPage() {
  return (
    <div className="signup-page-wrapper">
      {/* Left side: Image */}
      <div className="signup-image-section">
        <img 
          src="/3gmbrmakanan.png" 
          alt="MakanMate Food Display" 
          className="signup-hero-image" 
        />
        <div className="signup-brand-logo">MakanMate</div>
      </div>

      {/* Right side: Form Container */}
      <div className="signup-form-section">
        <Signup />
      </div>
    </div>
  );
}
