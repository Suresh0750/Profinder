import { toast } from 'sonner';
import {FormData,ErrorState} from '@/types/otpTypes/otpTypes'


export const HandlError = (
  formData: FormData,
  error: ErrorState
) => {
  if (!formData.otpValue.length) {
    toast.error("OTP is missing");
    error.otpValue = "OTP is missing";
    return;
  } else if (formData.otpValue.length < 4) {
    toast.error("Check OTP");
    error.otpValue = "Check OTP";
    return;
  }
  error.otpValue = "";

  if (!formData.newPass.length) {
    toast.error("Password is missing");
    error.newPass = "Password is missing";
    return;
  } else if (formData.newPass.length < 6) {
    toast.error("Password length is minimum 6");
    error.newPass = "Password length is minimum 6";
    return;
  } else if (!/[A-Za-z]/.test(formData.newPass)) {
    toast.error("Password must contain at least one letter");
    error.newPass = "Password must contain at least one letter";
    return;
  } else if (!/\d/.test(formData.newPass)) {
    toast.error("Password must contain at least one number");
    error.newPass = "Password must contain at least one number";
    return;
  } else if (!/[@$!%*?&]/.test(formData.newPass)) {
    toast.error("Password must contain at least one special character");
    error.newPass = "Password must contain at least one special character";
    return;
  }
  error.newPass = "";

  if (!formData.confirmPass) {
    toast.error("Confirm Password is missing");
    error.confirmPass = "Confirm Password is missing";
    return;
  } else if (formData.newPass !== formData.confirmPass) {
    toast.error("Passwords didn't match");
    error.confirmPass = "Passwords didn't match";
    return;
  }
  error.confirmPass = "";
  return true
};
